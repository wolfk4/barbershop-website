
import { db } from "@/db/drizzle";
import { cart, shopItems, orders, orderItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sendOrderConfirmation } from "@/lib/email";
 
// same hardcoded user the cart route uses for now
const CART_USER_ID = "7f3c2a91-5d84-4e17-9b63-2c8a6f104d75";
 
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim() : "";
 
    if (!name || !EMAIL_REGEX.test(email)) {
      return Response.json(
        { error: "Name and a valid email are required" },
        { status: 400 }
      );
    }
 
    // get items + prices from the db instead of trusting what the browser sends
    const items = await db
      .select({
        productId: cart.productId,
        title: shopItems.title,
        price: shopItems.price,
        size: cart.size,
        quantity: cart.quantity,
      })
      .from(cart)
      .innerJoin(shopItems, eq(cart.productId, shopItems.id))
      .where(eq(cart.userId, CART_USER_ID));
 
    if (items.length === 0) {
      return Response.json({ error: "Cart is empty" }, { status: 400 });
    }
 
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderId = crypto.randomUUID();
 
    // batch runs these together so we don't end up with half an order
    await db.batch([
      db.insert(orders).values({
        id: orderId,
        customerName: name,
        customerEmail: email,
        total,
      }),
      db.insert(orderItems).values(items.map((item) => ({ orderId, ...item }))),
      db.delete(cart).where(eq(cart.userId, CART_USER_ID)),
    ]);
 
    // order is already saved at this point, so a failed email just gets logged
    try {
      await sendOrderConfirmation({ orderId, name, email, items, total });
    } catch (emailError) {
      console.error("Order saved but confirmation email failed:", emailError);
    }
 
    return Response.json({ orderId }, { status: 201 });
  } catch (error) {
    console.error("Failed to place order:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
 