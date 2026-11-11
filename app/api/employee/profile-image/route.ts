import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { barbers } from "@/db/schema";
import { s3, portfolioBucket } from "@/lib/s3-client";
import { eq } from "drizzle-orm";

const maxBytes = 5 * 1024 * 1024;
const allowedTypes = { "image/jpeg": ".jpg", "image/png": ".png" };

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "employee") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = Number(session.user.id);

  const file = (await request.formData()).get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "Choose an image file." }, { status: 400 });
  }
  const extension = allowedTypes[file.type as keyof typeof allowedTypes];
  if (!extension || file.size > maxBytes) {
    return Response.json({ error: "Use a JPG or PNG image up to 5 MB." }, { status: 400 });
  }

  const [barber] = await db
    .select({ image: barbers.image })
    .from(barbers)
    .where(eq(barbers.userId, userId))
    .limit(1);
  if (!barber) {
    return Response.json({ error: "No barber profile found." }, { status: 404 });
  }

  const objectKey = `profile/${userId}/${crypto.randomUUID()}${extension}`;
  try {
    await s3.send(new PutObjectCommand({
      Bucket: portfolioBucket,
      Key: objectKey,
      Body: Buffer.from(await file.arrayBuffer()),
      ContentType: file.type,
    }));
    await db.update(barbers).set({ image: objectKey }).where(eq(barbers.userId, userId));
  } catch (error) {
    console.error("Failed to upload profile image:", error);
    return Response.json({ error: "Failed to upload image." }, { status: 500 });
  }

  // delete their old profile pic if it was uploaded here
  if (barber.image?.startsWith("profile/")) {
    await s3.send(new DeleteObjectCommand({ Bucket: portfolioBucket, Key: barber.image })).catch(() => {});
  }

  return Response.json({ ok: true });
}
