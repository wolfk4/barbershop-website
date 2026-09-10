import { db } from "@/db/drizzle";
import { cart, shopItems } from "@/db/schema";
import { eq } from "drizzle-orm";



export async function GET() {
  try {
    const items = await db
      .select({
        productId: cart.productId,
        title: shopItems.title,
        image: shopItems.image,
        price: shopItems.price,
        description: shopItems.description,
        moreInfo: shopItems.moreInfo,
      })
      .from(cart)
      .innerJoin(shopItems, eq(cart.productId, shopItems.id));

    return Response.json(items);
  } catch (error) {
    console.error("Failed to fetch cart items:", error);

    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
export const POST = async (request: Request) => {

    const userId = "7f3c2a91-5d84-4e17-9b63-2c8a6f104d75";
    try {
        const body = await request.json()
        const { itemId } = body


        await db.insert(cart).values({
            productId: itemId,
            userId: userId,
        });
        return new Response("Item added to cart", {
            status: 201,
        });
    } catch (error) {
        console.error("Failed to add item to cart:", error);
        return new Response("Internal Server Error", {
            status: 500,
        });
    }
}