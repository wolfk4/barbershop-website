import { db } from "@/db/drizzle";
import { galleryImages} from "@/db/schema";
import { s3, galleryBucket } from "@/lib/s3-client";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";



export async function GET() {
  try {
    const rows = await db
      .select({
        id: galleryImages.id,
        objectKey: galleryImages.objectKey,
        slot: galleryImages.slot,
      })
      .from(galleryImages);

    const images = await Promise.all(
      rows.map(async ({ objectKey, ...image }) => ({
        ...image,
        section: objectKey === "hero.webp" ? "Main Image" : "gallery",
        slot: objectKey === "hero.webp" ? 0 : image.slot,
        url: await getSignedUrl(
          s3,
          new GetObjectCommand({
            Bucket: galleryBucket,
            Key: objectKey,
          }),
          { expiresIn: 3600 },
        ),
      })),
    );

    return Response.json(
      { images },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    console.error("Failed to fetch gallery images:", error);

    return Response.json(
      { error: "Failed to load gallery images." },
      { status: 500 },
    );
  }
}
