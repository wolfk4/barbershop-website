import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { cart, productBySize, shopItems } from "@/db/schema";
import { and, eq, isNull } from "drizzle-orm";
 
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
 
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "admin") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }
 
    const { id } = await params;
    if (!uuidPattern.test(id)) {
      return Response.json({ error: "Product not found." }, { status: 404 });
    }
 
    const [product] = await db
      .select({ id: shopItems.id })
      .from(shopItems)
      .where(and(eq(shopItems.id, id), isNull(shopItems.deletedAt)))
      .limit(1);
 
    if (!product) {
      return Response.json({ error: "Product not found." }, { status: 404 });
    }
 
    // past orders point at this product, so we hide it instead of removing the row.
    // stock and cart entries get cleaned up for real.
    await db.batch([
      db.delete(cart).where(eq(cart.productId, id)),
      db.delete(productBySize).where(eq(productBySize.productId, id)),
      db.update(shopItems).set({ deletedAt: new Date() }).where(eq(shopItems.id, id)),
    ]);
 
    return Response.json({ id });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return Response.json({ error: "Deletion failed." }, { status: 500 });
  }
}
 