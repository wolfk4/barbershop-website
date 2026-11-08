import { GetObjectCommand } from "@aws-sdk/client-s3";
import { db } from "@/db/drizzle";
import { shopItems } from "@/db/schema";
import { productImageKey } from "@/lib/product-images";
import { portfolioBucket, s3 } from "@/lib/s3-client";
import { and, eq, isNull } from "drizzle-orm";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!uuidPattern.test(id)) return new Response("Product not found", { status: 404 });

  try {
    const [product] = await db.select({ image: shopItems.image }).from(shopItems)
      .where(and(eq(shopItems.id, id), isNull(shopItems.deletedAt))).limit(1);
    const key = product?.image && productImageKey(product.image);
    if (!key) return new Response("Product image not found", { status: 404 });

    const object = await s3.send(new GetObjectCommand({ Bucket: portfolioBucket, Key: key }));
    if (!object.Body) {
      console.error("Product image has no body:", id);
      return new Response("Product image unavailable", { status: 502 });
    }

    return new Response(Buffer.from(await object.Body.transformToByteArray()), {
      headers: {
        "Content-Type": object.ContentType || "application/octet-stream",
        "Cache-Control": "public, max-age=60",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'; sandbox",
      },
    });
  } catch (error) {
    console.error("Failed to fetch product image:", error);
    return new Response("Product image unavailable", { status: 500 });
  }
}
