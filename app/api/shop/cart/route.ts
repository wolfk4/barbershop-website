import { db } from "@/db/drizzle";
import { cart, productBySize, shopItems } from "@/db/schema";
import { and, eq } from "drizzle-orm";

const userId = "7f3c2a91-5d84-4e17-9b63-2c8a6f104d75";
const maxPurchaseQuantity = 10;

async function getAvailableStock(productId: string, size: string) {
  const stockRows = await db
    .select({ stock: productBySize.stock })
    .from(productBySize)
    .where(
      and(
        eq(productBySize.productId, productId),
        eq(productBySize.size, size)
      )
    );

  return stockRows.reduce((total, row) => total + Number(row.stock ?? 0), 0);
}

export async function GET() {
  try {
    const items = await db
      .select({
        id: cart.uid,
        productId: cart.productId,
        size: cart.size,
        quantity: cart.quantity,
        addedAt: cart.addedAt,
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { itemId, size } = body;

    if (typeof itemId !== "string" || typeof size !== "string" || !size) {
      return Response.json(
        { error: "A product and size are required" },
        { status: 400 }
      );
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


export const PATCH = async (request: Request) => {
  try {
    const body = await request.json();
    const { id, quantity } = body;

    if (typeof id !== "string" || !Number.isInteger(quantity) || quantity < 0) {
      return Response.json(
        { error: "A valid cart item id and quantity are required" },
        { status: 400 }
      );
    }

    if (quantity > maxPurchaseQuantity) {
      return Response.json(
        { error: `You can buy up to ${maxPurchaseQuantity} of this item` },
        { status: 400 }
      );
    }

    const [item] = await db
      .select({ id: cart.uid, productId: cart.productId, size: cart.size })
      .from(cart)
      .where(eq(cart.uid, id))
      .limit(1);

    if (!item) {
      return Response.json({ error: "Cart item not found" }, { status: 404 });
    }

    if (quantity === 0) {
      await db.delete(cart).where(eq(cart.uid, item.id));
      return Response.json({ removed: true });
    }

    const availableStock = await getAvailableStock(item.productId, item.size);

    if (availableStock < 1) {
      return Response.json(
        { error: "This item is out of stock" },
        { status: 400 }
      );
    }

    if (quantity > availableStock) {
      return Response.json(
        { error: `Only ${availableStock} item(s) are in stock` },
        { status: 400 }
      );
    }

    await db
      .update(cart)
      .set({ quantity })
      .where(eq(cart.uid, item.id));
    return Response.json({ quantity });
  } catch (error) {
    console.error("Failed to update cart quantity:", error);
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};