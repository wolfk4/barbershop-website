import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { galleryImages, portfolioImages } from "@/db/schema";
import { s3, galleryBucket } from "@/lib/s3-client";
import { and, eq } from "drizzle-orm";


const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// export async function DELETE(
//   _request: Request,
//   { params }: { params: Promise<{ imageId: string }> },
// ) {
//   try {
//     const session = await auth();

//     if (!session?.user?.id) {
//       return Response.json({ error: "Unauthorized" }, { status: 401 });
//     }
//     if (session.user.role !== "employee") {
//       return Response.json({ error: "Forbidden" }, { status: 403 });
//     }

//     const ownerUserId = Number(session.user.id);
//     if (!Number.isSafeInteger(ownerUserId)) {
//       return Response.json({ error: "Invalid user" }, { status: 401 });
//     }

//     const { imageId } = await params;
//     if (!uuidPattern.test(imageId)) {
//       return Response.json({ error: "Image not found." }, { status: 404 });
//     }

//     // Filtering by owner returns 404 for other employees' images instead of revealing they exist.
//     const [image] = await db
//       .select({ objectKey: galleryImages.objectKey })
//       .from(galleryImages)

//     if (!image) {
//       return Response.json({ error: "Image not found." }, { status: 404 });
//     }

//     // S3 deletes are idempotent, so deleting the object first keeps a failed request safe to retry.
//     await s3.send(new DeleteObjectCommand({ Bucket: galleryBucket, Key: image.objectKey }));
//     await db
//       .delete(galleryImages)
//       .where(and(eq(galleryImages.id, imageId), eq(galleryImages.imageId, imageId)));

//     return Response.json({ id: imageId });
//   } catch (error) {
//     console.error("Failed to delete gallery image:", error);
//     return Response.json({ error: "Failed to delete image." }, { status: 500 });
//   }
// }
