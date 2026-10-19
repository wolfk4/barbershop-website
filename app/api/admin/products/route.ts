import { PutObjectCommand } from "@aws-sdk/client-s3";
import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { productBySize, shopItems } from "@/db/schema";
import { s3, portfolioBucket } from "@/lib/s3-client";
import { eq } from "drizzle-orm";
 
const SIZES = ["S", "M", "L", "XL", "XXL"];
 
function bad(message: string) {
  return Response.json({ error: message }, { status: 400 });
}
 
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }
 
  let productId: string | null = null;
 
  try {
    const form = await request.formData();
    const title = String(form.get("name") ?? "").trim();
    const description = String(form.get("description") ?? "").trim();
    const price = Number(form.get("price"));
    const sizes = form.getAll("sizes").map(String);
    const image = form.get("image");
 
    if (!title || !description) return bad("Name and description are required.");
    if (!Number.isFinite(price) || price <= 0) return bad("Price must be a positive number.");
    if (sizes.length === 0 || sizes.some((s) => !SIZES.includes(s))) {
      return bad("Pick at least one valid size.");
    }
 
    const stock: { size: string; stock: number }[] = [];
    for (const size of sizes) {
      const raw = String(form.get(`stock_${size}`) ?? "").trim();
      const n = Number(raw);
      if (raw === "" || !Number.isInteger(n) || n < 0) {
        return bad(`Stock for ${size} must be a whole number 0 or more.`);
      }
      stock.push({ size, stock: n });
    }
 
    // Image is optional
    let imageUrl: string | null = null;
    if (image instanceof File && image.size > 0) {
      if (!image.type.startsWith("image/")) return bad("Image must be an image file.");
      const safeName = image.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const key = `products/${crypto.randomUUID()}-${safeName}`;
      await s3.send(
        new PutObjectCommand({
          Bucket: portfolioBucket,
          Key: key,
          Body: Buffer.from(await image.arrayBuffer()),
          ContentType: image.type,
        }),
      );
      imageUrl = `${process.env.AWS_ENDPOINT_URL_S3}/${portfolioBucket}/${key}`;
    }
 
    const [product] = await db
      .insert(shopItems)
      .values({
        title,
        description,
        // stored in cents, change to Math.round(price) if your shop stores whole dollars
        price: Math.round(price * 100),
        image: imageUrl,
      })
      .returning({ id: shopItems.id });
 
    productId = product.id;
 
    await db.insert(productBySize).values(
      stock.map((s) => ({ productId: product.id, size: s.size, stock: s.stock })),
    );
 
    return Response.json({ id: product.id }, { status: 201 });
  } catch (error) {
    console.error("Failed to create product:", error);
    // don't leave a product with no sizes behind
    if (productId) {
      await db.delete(shopItems).where(eq(shopItems.id, productId)).catch(() => {});
    }
    return Response.json({ error: "Failed to create product." }, { status: 500 });
  }
}
