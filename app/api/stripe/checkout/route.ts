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

    const customerName = formData.get("customer_name")

    if (
      typeof customerName !== "string" ||
      customerName.trim().length < 2
    ) {
      return NextResponse.json(
        { error: "Customer name must be at least 2 characters" },
        { status: 400 }
      )
    }

    const safeName = customerName.trim().slice(0, 120)
    const [p] = await db.select().from(shopItems).where(eq(shopItems.title, title)).limit(1)
    if (!p) return NextResponse.json({ error: "Product not found" }, { status: 404 })

    const priceId = p.stripeLink
    if (!priceId) {
      return NextResponse.json({ error: "Missing stripe id for product" }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/checkout/success`,
      cancel_url: `${origin}/shop/${p.id}`,
        managed_payments: {
        enabled: false,
      },
    })

    await db.insert(orders).values({
      customerName: safeName,
      customerEmail: "test@email.com",
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