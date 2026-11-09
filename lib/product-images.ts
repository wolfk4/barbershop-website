import { createHash } from "node:crypto";

export function productImageKey(
  image: string,
  endpoint = process.env.AWS_ENDPOINT_URL_S3,
  bucket = process.env.PORTFOLIO_BUCKET,
): string | null {
  if (!endpoint || !bucket) return null;

  let url: URL;
  let base: URL;
  try {
    url = new URL(image);
    base = new URL(endpoint);
  } catch {
    return null;
  }

  const prefix = `${base.pathname.replace(/\/+$/, "")}/${encodeURIComponent(bucket)}/products/`;
  if (url.origin !== base.origin || !url.pathname.startsWith(prefix)) return null;

  try {
    const name = decodeURIComponent(url.pathname.slice(prefix.length));
    if (!name || name.includes("/") || name.includes("\\")) return null;
    return `products/${name}`;
  } catch {
    return null;
  }
}

export function productImageUrl(id: string, image: string | null): string | null {
  if (!image || !productImageKey(image)) return image;

  const version = createHash("sha256").update(image).digest("hex").slice(0, 16);
  return `/api/products/${encodeURIComponent(id)}/image?v=${version}`;
}
