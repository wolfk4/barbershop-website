import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { eq } from "drizzle-orm"

import { stripe } from "@/lib/stripe"
import { db } from "@/db/drizzle"
import { orders, shopItems } from "@/db/schema"

export async function POST(req: Request) {
  try {
    const headersList = await headers()
    const origin = headersList.get("origin")
    if (!origin) return NextResponse.json({ error: "Missing origin" }, { status: 400 })

    const formData = await req.formData()

    const title = formData.get("title")
    if (typeof title !== "string" || !title) {
      return NextResponse.json({ error: "Missing title" }, { status: 400 })
    }

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

    const [p] = await db.select().from(shopItems).where(eq(shopItems.title, title)).limit(1)
    if (!p) return NextResponse.json({ error: "Product not found" }, { status: 404 })

    const priceId = p.stripeLink
    if (!priceId) {
      return NextResponse.json({ error: "Missing stripe id for product" }, { status: 400 })
    }

    const orderId = crypto.randomUUID()
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/order-confirmation/${orderId}`,
      cancel_url: `${origin}/shop/${p.id}`,
        managed_payments: {
        enabled: false,
      },
    })

    await db.insert(orders).values({
      id: orderId,
      customerFirstName: firstName.slice(0, 100),
      customerLastName: lastName.slice(0, 100),
      customerEmail: email,
      customerPhone: phone,
      shippingStreet: streetAddress,
      shippingCity: city,
      shippingState: state,
      shippingZip: zipCode,
      total: p.price,
      status: "pending",
      stripeCheckoutSessionId: session.id,
    })

    return NextResponse.redirect(session.url!, { status: 303 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Stripe checkout failed" }, { status: 500 })
  }
}
