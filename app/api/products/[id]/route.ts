import { db } from "@/db/drizzle";
import { productBySize, shopItems } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Fetch the product by ID
  const [product] = await db.select().from(shopItems).where(eq(shopItems.id, id)).limit(1);

  if (!product) {
    return Response.json({ error: "Product not found" }, { status: 404 });
  }

  // Fetch sizes and stock for the product
  const sizes = await db
    .select({size: productBySize.size, stock: productBySize.stock,})
    .from(productBySize)
    .where(eq(productBySize.productId, product.id));

  // Return the product along with its sizes and stock
  return Response.json({...product, sizes: sizes.map((variant) => ({
      size: variant.size,
      stock: Number(variant.stock ?? 0),
    })),
  });
}
