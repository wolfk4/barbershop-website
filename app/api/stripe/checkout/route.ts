import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { eq } from "drizzle-orm"

import { stripe } from "@/lib/stripe"
import { db } from "@/db/drizzle"
import { cart, orders, orderItems, shopItems } from "@/db/schema"

// Matches the cart owner currently used by /api/shop/cart.
const CART_USER_ID = "7f3c2a91-5d84-4e17-9b63-2c8a6f104d75"

export async function POST(req: Request) {
  try {
    const headersList = await headers()
    const origin = headersList.get("origin")
    if (!origin) return NextResponse.json({ error: "Missing origin" }, { status: 400 })

    const formData = await req.formData()

    const field = (name: string) => {
      const value = formData.get(name)
      return typeof value === "string" ? value.trim() : ""
    }
    const firstName = field("firstName").slice(0, 100)
    const lastName = field("lastName").slice(0, 100)
    const email = field("email")
    const phone = field("phone")
    const streetAddress = field("streetAddress").slice(0, 255)
    const city = field("city").slice(0, 100)
    const state = field("state")
    const zipCode = field("zipCode")

    if (
      !firstName || !lastName ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255 ||
      !/^\d{10}$/.test(phone) || !streetAddress || !city ||
      !/^[A-Z]{2}$/.test(state) || !/^\d{5}$/.test(zipCode)
    ) {
      return NextResponse.json(
        { error: "Name, valid email, phone, and shipping address are required" },
        { status: 400 }
      )
    }

    const items = await db
      .select({
        productId: shopItems.id,
        title: shopItems.title,
        price: shopItems.price,
        stripePriceId: shopItems.stripeLink,
        deletedAt: shopItems.deletedAt,
        size: cart.size,
        quantity: cart.quantity,
      })
      .from(cart)
      .innerJoin(shopItems, eq(cart.productId, shopItems.id))
      .where(eq(cart.userId, CART_USER_ID))

    if (items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    for (const item of items) {
      if (item.deletedAt || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 10) {
        return NextResponse.json({ error: `Invalid cart item: ${item.title}` }, { status: 400 })
      }
      if (!item.stripePriceId?.startsWith("price_")) {
        return NextResponse.json(
          { error: `Missing or invalid Stripe Price ID for ${item.title}` },
          { status: 400 }
        )
      }
    }

    const orderId = crypto.randomUUID()
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      line_items: items.map((item) => ({ price: item.stripePriceId!, quantity: item.quantity })),
      metadata: { orderId },
      success_url: `${origin}/order-confirmation/${orderId}`,
      cancel_url: `${origin}/checkout`,
      managed_payments: {
        enabled: false,
      },
    })

    await db.batch([
      db.insert(orders).values({
        id: orderId,
        customerFirstName: firstName,
        customerLastName: lastName,
        customerEmail: email,
        customerPhone: phone,
        shippingStreet: streetAddress,
        shippingCity: city,
        shippingState: state,
        shippingZip: zipCode,
        total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        status: "pending",
        stripeCheckoutSessionId: session.id,
      }),
      db.insert(orderItems).values(items.map((item) => ({
        orderId,
        productId: item.productId,
        title: item.title,
        price: item.price,
        size: item.size,
        quantity: item.quantity,
      }))),
    ])

    return NextResponse.redirect(session.url!, { status: 303 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Stripe checkout failed" }, { status: 500 })
  }
}
