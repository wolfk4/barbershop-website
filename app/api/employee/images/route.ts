import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { barbers, portfolioImages } from "@/db/schema";
import { s3, portfolioBucket } from "@/lib/s3-client";
import { PORTFOLIO_SLOT_COUNT } from "@/lib/portfolio";
import { and, asc, eq, isNotNull } from "drizzle-orm";

const maxBytes = 5 * 1024 * 1024;
const allowedTypes = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
};

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "employee") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const ownerUserId = Number(session.user.id);
    if (!Number.isSafeInteger(ownerUserId)) {
      return Response.json({ error: "Invalid user" }, { status: 401 });
    }

    const images = await db
      .select({
        id: portfolioImages.id,
        slot: portfolioImages.slot,
        objectKey: portfolioImages.objectKey,
        contentType: portfolioImages.contentType,
        createdAt: portfolioImages.createdAt,
      })
      .from(portfolioImages)
      .where(and(eq(portfolioImages.ownerUserId, ownerUserId), isNotNull(portfolioImages.slot)))
      .orderBy(asc(portfolioImages.slot));

    const [barber] = await db
      .select({ heroImage: barbers.image })
      .from(barbers)
      .where(eq(barbers.userId, ownerUserId))
      .limit(1);

    const imagesWithUrls = await Promise.all(
      images.map(async ({ objectKey, ...image }) => ({
        ...image,
        url: await getSignedUrl(
          s3,
          new GetObjectCommand({ Bucket: portfolioBucket, Key: objectKey }),
          { expiresIn: 3600 },
        ),
      })),
    );

    return Response.json(
      { heroImage: barber?.heroImage ?? null, images: imagesWithUrls },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    console.error("Failed to fetch portfolio images:", error);
    return Response.json({ error: "Failed to load images." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let uploadedKey: string | undefined;

  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "employee") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const ownerUserId = Number(session.user.id);
    if (!Number.isSafeInteger(ownerUserId)) {
      return Response.json({ error: "Invalid user" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const slot = Number(formData.get("slot"));

    if (!Number.isInteger(slot) || slot < 0 || slot >= PORTFOLIO_SLOT_COUNT) {
      return Response.json({ error: "Choose one of the six photo slots." }, { status: 400 });
    }
    if (!(file instanceof File)) {
      return Response.json({ error: "Choose an image file." }, { status: 400 });
    }

    const extension = allowedTypes[file.type as keyof typeof allowedTypes];
    if (!extension || file.size > maxBytes) {
      return Response.json(
        { error: "Use a JPG or PNG image up to 5 MB." },
        { status: 400 }
      );
    }

    const [occupied] = await db
      .select({ id: portfolioImages.id })
      .from(portfolioImages)
      .where(and(eq(portfolioImages.ownerUserId, ownerUserId), eq(portfolioImages.slot, slot)))
      .limit(1);
    if (occupied) {
      return Response.json({ error: "That slot already has a photo. Delete it first." }, { status: 409 });
    }

    const objectKey = `portfolio/${ownerUserId}/${crypto.randomUUID()}${extension}`;

    await s3.send(new PutObjectCommand({
      Bucket: portfolioBucket,
      Key: objectKey,
      Body: Buffer.from(await file.arrayBuffer()),
      ContentType: file.type,
    }));
    uploadedKey = objectKey;

    const [image] = await db
      .insert(portfolioImages)
      .values({
        ownerUserId,
        slot,
        objectKey,
        contentType: file.type,
      })
      .returning();

    return Response.json({ image }, { status: 201 });
  } catch (error) {
    if (uploadedKey) {
      try {
        await s3.send(new DeleteObjectCommand({
          Bucket: portfolioBucket,
          Key: uploadedKey,
        }));
      } catch (cleanupError) {
        console.error("Failed to clean up uploaded image:", cleanupError);
      }
    }

    console.error("Failed to upload portfolio image:", error);
    return Response.json({ error: "Failed to upload image." }, { status: 500 });
  }
}