import { db } from "@/db/drizzle";
import { cart, shopItems } from "@/db/schema"; 
import { eq } from "drizzle-orm";  

const userId = "7f3c2a91-5d84-4e17-9b63-2c8a6f104d75";
const maxPurchaseQuantity = 10;

export async function GET() 
{
  try {
    const items = await db
      .select({
        id: shopItems.id, 
        uid: cart.uid,
        productId: cart.productId,
        size: cart.size,
        quantity: cart.quantity,
        addedAt: cart.addedAt,
        title: shopItems.title,
        image: shopItems.image, 
        price: shopItems.price, 
        description: shopItems.description, 
        moreInfo: shopItems.moreInfo,
        size: cart.size, 
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
        const { itemId, size } = body


        await db.insert(cart).values({
            productId: itemId,
            userId: userId, 
            size: size,
        });

        return new Response("Item added to cart", {
            status: 201,
        });
    } 
    catch (error) {
        console.error("Failed to add item to cart:", error);
        return new Response("Internal Server Error", {
            status: 500,  
        });
    }

    const availableStock = await getAvailableStock(itemId, size);

    if (availableStock < 1) {
      return Response.json(
        { error: "This item is out of stock" },
        { status: 400 }
      );
    }

    const [existingItem] = await db
      .select({ uid: cart.uid, quantity: cart.quantity })
      .from(cart)
      .where(and(eq(cart.productId, itemId), eq(cart.size, size)))
      .limit(1);
    const nextQuantity = (existingItem?.quantity ?? 0) + 1;

    if (nextQuantity > availableStock) {
      return Response.json(
        { error: `Only ${availableStock} of this item are in stock` },
        { status: 400 }
      );
    }

    if (existingItem) {
      await db
        .update(cart)
        .set({ quantity: nextQuantity })
        .where(eq(cart.uid, existingItem.uid));
    } else {
      await db.insert(cart).values({
        productId: itemId,
        userId,
        size,
      });
    }

    return Response.json(
      { quantity: nextQuantity },
      { status: existingItem ? 200 : 201 }
    );
  } catch (error) {
    console.error("Failed to add item to cart:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export const DELETE = async (request: Request) => {
  try{
    const body = await request.json(); 
    const { uid } = body; 

    await db.delete(cart).where(eq(cart.uid, uid));
    return new Response("Item removed from cart", {
      status: 200, 
    });
  }  
  catch (error) { 
    console.error("Failed to remove item from cart:", error);
    return new Response("Internal Server Error", { 
      status: 500,  
    });
  }

}
