import { auth } from "@/auth";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { db } from "@/db/drizzle";
import { cart, productBySize, shopItems } from "@/db/schema";
import { s3, portfolioBucket } from "@/lib/s3-client";
import { and, eq, isNull, sql } from "drizzle-orm";
 
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "admin") return Response.json({ error: "Forbidden" }, { status: 403 });

  let uploadedKey: string | null = null;
  let updateStarted = false;
  try {
    const { id } = await params;
    if (!uuidPattern.test(id)) return Response.json({ error: "Product not found." }, { status: 404 });
    const [product] = await db.select({ id: shopItems.id }).from(shopItems)
      .where(and(eq(shopItems.id, id), isNull(shopItems.deletedAt))).limit(1);
    if (!product) return Response.json({ error: "Product not found." }, { status: 404 });

    const form = await request.formData();
    const title = String(form.get("name") ?? "").trim();
    const description = String(form.get("description") ?? "").trim();
    const rawPrice = String(form.get("price") ?? "").trim();
    const cents = Math.round(Number(rawPrice) * 100);
    const sizes = form.getAll("sizes").map(String);
    const image = form.get("image");
    if (!title || title.length > 255 || !description) {
      return Response.json({ error: "A valid name and description are required." }, { status: 400 });
    }
    if (!/^\d+(\.\d{1,2})?$/.test(rawPrice) || !Number.isSafeInteger(cents) || cents <= 0 || cents > 2147483647) {
      return Response.json({ error: "Price must be a positive amount with at most two decimal places." }, { status: 400 });
    }
    if (!sizes.length || new Set(sizes).size !== sizes.length || sizes.some((size) => !size || size.length > 10)) {
      return Response.json({ error: "Pick at least one valid size." }, { status: 400 });
    }
    const stock: { size: string; stock: number }[] = [];
    for (const size of sizes) {
      const raw = String(form.get(`stock_${size}`) ?? "").trim();
      const quantity = Number(raw);
      if (!/^\d+$/.test(raw) || !Number.isInteger(quantity) || quantity > 2147483647) {
        return Response.json({ error: `Stock for ${size} must be a whole number 0 or more.` }, { status: 400 });
      }
      stock.push({ size, stock: quantity });
    }
    if (image instanceof File && image.size > 0 && !image.type.startsWith("image/")) {
      return Response.json({ error: "Image must be an image file." }, { status: 400 });
    }

    let imageUrl: string | undefined;
    if (image instanceof File && image.size > 0) {
      const safeName = image.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      uploadedKey = `products/${crypto.randomUUID()}-${safeName}`;
      await s3.send(new PutObjectCommand({
        Bucket: portfolioBucket, Key: uploadedKey,
        Body: Buffer.from(await image.arrayBuffer()), ContentType: image.type,
      }));
      imageUrl = `${process.env.AWS_ENDPOINT_URL_S3}/${portfolioBucket}/${uploadedKey}`;
    }

    const activeProduct = sql`exists (select 1 from ${shopItems} where ${shopItems.id} = ${id} and ${shopItems.deletedAt} is null)`;
    updateStarted = true;
    const [updated] = await db.batch([
      db.update(shopItems).set({
        title, description, price: cents, ...(imageUrl ? { image: imageUrl } : {}),
        stockBySize: JSON.stringify(Object.fromEntries(stock.map((item) => [item.size, item.stock]))),
      }).where(and(eq(shopItems.id, id), isNull(shopItems.deletedAt))).returning({ id: shopItems.id }),
      db.delete(productBySize).where(and(eq(productBySize.productId, id), activeProduct)),
      db.execute(sql`insert into ${productBySize} (product_id, size, stock)
        select ${id}::uuid, v.size, v.stock from (values ${sql.join(stock.map((item) => sql`(${item.size}::varchar, ${item.stock}::integer)`), sql`, `)}) as v(size, stock)
        where ${activeProduct}`),
    ]);

    if (!updated.length) {
      if (uploadedKey) await s3.send(new DeleteObjectCommand({ Bucket: portfolioBucket, Key: uploadedKey }));
      return Response.json({ error: "Product not found." }, { status: 404 });
    }
    return Response.json({ id });
  } catch (error) {
    console.error("Failed to update product:", error);
    if (uploadedKey && !updateStarted) {
      try {
        await s3.send(new DeleteObjectCommand({ Bucket: portfolioBucket, Key: uploadedKey }));
      } catch (cleanupError) {
        console.error("Failed to remove uploaded product image:", cleanupError);
      }
    }
    return Response.json({ error: "Update failed." }, { status: 500 });
  }
}
 
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
 
    const [, , deleted] = await db.batch([
      db.delete(cart).where(eq(cart.productId, id)),
      db.delete(productBySize).where(eq(productBySize.productId, id)),
      db.delete(shopItems).where(and(eq(shopItems.id, id), isNull(shopItems.deletedAt))).returning({ id: shopItems.id }),
    ]);

    if (!deleted.length) return Response.json({ error: "Product not found." }, { status: 404 });
    return Response.json({ id });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return Response.json({ error: "Deletion failed." }, { status: 500 });
  }
}
 