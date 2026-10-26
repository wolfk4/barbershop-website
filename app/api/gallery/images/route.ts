import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { galleryImages} from "@/db/schema";
import { s3, galleryBucket } from "@/lib/s3-client";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { eq } from "drizzle-orm";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};
 
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




export async function POST(request: Request) {
  let uploadedKey: string | undefined;

  try {
    // const session = await auth();

    // if (!session?.user?.id) {
    //   return Response.json(
    //     { error: "Unauthorized." },
    //     { status: 401 },
    //   );
    // }

    // if (session.user.role !== "employee") {
    //   return Response.json(
    //     { error: "Forbidden." },
    //     { status: 403 },
    //   );
    // }

    let formData: FormData;

    try {
      formData = await request.formData();
    } catch {
      return Response.json(
        { error: "Invalid upload data." },
        { status: 400 },
      );
    }

    const file = formData.get("file");
    const rawSlot = formData.get("slot");

    if (typeof rawSlot !== "string" || rawSlot.trim() === "") {
      return Response.json(
        { error: "Choose a photo slot." },
        { status: 400 },
      );
    }

    const slot = Number(rawSlot);

    if (!Number.isSafeInteger(slot) || slot < 0) {
      return Response.json(
        { error: "Invalid photo slot." },
        { status: 400 },
      );
    }

    if (!(file instanceof File) || file.size === 0) {
      return Response.json(
        { error: "Choose an image file." },
        { status: 400 },
      );
    }

    const extension = ALLOWED_TYPES[file.type];

    if (!extension) {
      return Response.json(
        { error: "Choose a JPG, PNG, or WebP image." },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return Response.json(
        { error: "Images must be 5 MB or smaller." },
        { status: 400 },
      );
    }

    const [occupied] = await db
      .select({ id: galleryImages.id })
      .from(galleryImages)
      .where(eq(galleryImages.slot, slot))
      .limit(1);

    if (occupied) {
      return Response.json(
        { error: "That slot already has a photo. Delete it first." },
        { status: 409 },
      );
    }

    const objectKey = `gallery/${crypto.randomUUID()}${extension}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: galleryBucket,
        Key: objectKey,
        Body: Buffer.from(await file.arrayBuffer()),
        ContentType: file.type,
      }),
    );

    uploadedKey = objectKey;

  const [image] = await db
    .insert(galleryImages)
    .values({
      objectKey,
      slot,
      contentType: file.type,
    })
    .returning({
      id: galleryImages.id,
      objectKey: galleryImages.objectKey,
      slot: galleryImages.slot,
      contentType: galleryImages.contentType,
    });

    // The database now owns the uploaded object.
    uploadedKey = undefined;

    return Response.json({ image }, { status: 201 });
  } catch (error) {
    if (uploadedKey) {
      try {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: galleryBucket,
            Key: uploadedKey,
          }),
        );
      } catch (cleanupError) {
        console.error("Failed to clean up gallery image:", cleanupError);
      }
    }

    console.error("Failed to upload gallery image:", error);

    return Response.json(
      { error: "Failed to upload gallery image." },
      { status: 500 },
    );
  }
}