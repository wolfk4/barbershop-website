
import { db } from "@/db/drizzle";
import { cart, shopItems, orders, orderItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sendOrderConfirmation } from "@/lib/email";
 
// same hardcoded user the cart route uses for now
const CART_USER_ID = "7f3c2a91-5d84-4e17-9b63-2c8a6f104d75";
 
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\d{10}$/;
const ZIP_REGEX = /^\d{5}$/;
const STATE_REGEX = /^[A-Z]{2}$/;

const str = (value: unknown) => (typeof value === "string" ? value.trim() : "");
 
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const firstName = str(body?.firstName).slice(0, 100);
    const lastName = str(body?.lastName).slice(0, 100);
    const email = str(body?.email);
    const phone = str(body?.phone);
    const street = str(body?.shipping?.streetAddress).slice(0, 255);
    const city = str(body?.shipping?.city).slice(0, 100);
    const state = str(body?.shipping?.state).toUpperCase();
    const zip = str(body?.shipping?.zipCode);
 
    if (
      !firstName ||
      !lastName ||
      !EMAIL_REGEX.test(email) ||
      !PHONE_REGEX.test(phone) ||
      !street ||
      !city ||
      !STATE_REGEX.test(state) ||
      !ZIP_REGEX.test(zip)
    ) {
      return Response.json(
        { error: "Name, valid email, phone, and shipping address are required" },
        { status: 400 }
      );
    }
    const name = `${firstName} ${lastName}`;
 
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
        customerFirstName: firstName,
        customerLastName: lastName,
        customerEmail: email,
        customerPhone: phone,
        shippingStreet: street,
        shippingCity: city,
        shippingState: state,
        shippingZip: zip,
        total,
      }),
      // inner join above means productId is never null here
      db.insert(orderItems).values(items.map((item) => ({ orderId, ...item, productId: item.productId! }))),
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
