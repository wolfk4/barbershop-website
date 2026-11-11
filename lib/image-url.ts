import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3, portfolioBucket } from "@/lib/s3-client";

// image can be a full URL, a /public path, or a path in the bucket
export async function resolveImageUrl(value: string | null) {
  if (!value) return null;
  if (value.startsWith("http") || value.startsWith("/")) return value;
  return getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: portfolioBucket, Key: value }),
    { expiresIn: 3600 },
  );
}
