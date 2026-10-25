"use client";

import { ImagePlus, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { PORTFOLIO_SLOT_COUNT } from "@/lib/portfolio";

type Section = "Main Image" | "about" | "gallery";

type GalleryImage = {
  id: string;
  section: Section;
  slot: number;
  url: string;
};

type Selection = {
  section: Section;
  slot: number;
};

type Status = {
  type: "success" | "error";
  text: string;
} | null;

const IMAGES_URL = "/api/gallery/images";
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

async function fetchImages(): Promise<GalleryImage[]> {
  const response = await fetch(IMAGES_URL, {
    method: "GET",
    cache: "no-store",
  });

  if (response.status === 401) {
    throw new Error("Please sign in to manage gallery images.");
  }
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to load images.");
  }

  if (!Array.isArray(data.images)) {
    throw new Error("Invalid gallery response.");
  }

  return data.images;
}

export default function AdminGalleryManager() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [status, setStatus] = useState<Status>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const busy = loading || uploading || deleting;

  const selectedImage = selection
    ? images.find(
        (image) =>
          image.section === selection.section &&
          image.slot === selection.slot,
      ) ?? null
    : null;

  useEffect(() => {
    let cancelled = false;

    async function loadImages() {
      try {
        const data = await fetchImages();

        if (!cancelled) {
          setImages(data);
        }
      } catch (error) {
        if (!cancelled) {
          setStatus({
            type: "error",
            text:
              error instanceof Error
                ? error.message
                : "Couldn't load images. Try refreshing.",
          });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadImages();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
  const file = event.target.files?.[0];
  event.target.value = "";

  if (!file || !selection || busy) return;

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    setStatus({
      type: "error",
      text: "Choose a JPG, PNG, or WebP image.",
    });
    return;
  }

  if (file.size > MAX_FILE_SIZE) {
    setStatus({
      type: "error",
      text: "Images must be 5 MB or smaller.",
    });
    return;
  }

  setUploading(true);
  setStatus(null);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("section", selection.section);
  formData.append("slot", String(selection.slot));

  try {
    // Replace imagesid with your actual ID variable.
    const response = await fetch(
      `/api/gallery/images`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      const text = await response.text();
      let message = `Couldn't upload this image (${response.status}).`;

      try {
        const result = JSON.parse(text);
        if (typeof result.error === "string") {
          message = result.error;
        }
      } catch {
        console.error("Unexpected upload response:", response.status, text);
      }

      throw new Error(message);
    }

    try {
      setImages(await fetchImages());
      setStatus({
        type: "success",
        text: "Gallery updated successfully.",
      });
    } catch {
      setStatus({
        type: "error",
        text: "Image saved, but previews couldn't refresh. Reload the page.",
      });
    }
  } catch (error) {
    setStatus({
      type: "error",
      text:
        error instanceof Error
          ? error.message
          : "Update failed. Please try again.",
    });
  } finally {
    setUploading(false);
  }
}

  async function handleDelete() {
    if (!selectedImage || busy) return;
    if (!window.confirm("Delete this photo? This can't be undone.")) return;

    setDeleting(true);
    setStatus(null);

    try {
      const response = await fetch(
        `${IMAGES_URL}/${encodeURIComponent(selectedImage.id)}`,
        { method: "DELETE" },
      );

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error ?? "Couldn't delete this image.");
      }

      setImages((previous) =>
        previous.filter((image) => image.id !== selectedImage.id),
      );

      setStatus({
        type: "success",
        text: "Photo deleted.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Couldn't delete this image.",
      });
    } finally {
      setDeleting(false);
    }
  }

  function renderSlot(
    section: Section,
    slot: number,
    label: string,
    aspect = "aspect-[4/5]",
  ) {
    const image = images.find(
      (item) => item.section === section && item.slot === slot,
    );

    const selected =
      selection?.section === section && selection.slot === slot;

    return (
      <div key={`${section}-${slot}`} className="space-y-2">
        <button
          type="button"
          onClick={() => setSelection({ section, slot })}
          disabled={busy}
          aria-label={label}
          aria-pressed={selected}
          className={`relative block w-full ${aspect} overflow-hidden rounded-md border-2 bg-gray-100 disabled:cursor-not-allowed ${
            selected ? "border-black" : "border-gray-200"
          }`}
        >
          {image ? (
            <Image
              src={image.url}
              alt={label}
              fill
              unoptimized
              sizes={
                section === "gallery"
                  ? "(max-width: 640px) 50vw, 25vw"
                  : "(max-width: 1024px) 100vw, 35vw"
              }
              className="object-cover object-center"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-gray-400">
              <ImagePlus aria-hidden="true" className="size-7" />
              <span className="text-xs">Add photo</span>
            </div>
          )}
        </button>

        <p className="text-sm text-gray-600">{label}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {status && (
        <output
          aria-live="polite"
          className={`block text-sm ${
            status.type === "success" ? "text-green-700" : "text-red-600"
          }`}
        >
          {status.text}
        </output>
      )}

      <div className="grid items-start gap-10 lg:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.5fr)]">
        <section className="space-y-7" aria-label="Page images">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-black">
              Main landing page
            </h2>

            {renderSlot("Main Image", 0, "Main landing page image", "aspect-video")}
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-black">About Us</h2>

            {renderSlot("about", 0, "About Us main image", "aspect-video")}
          </div>
        </section>

        <section className="space-y-5" aria-label="Gallery photos">
          <div>
            <h2 className="text-lg font-semibold text-black">
              Gallery photos
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Select a photo to replace or delete it, or an empty slot to
              upload a new image.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {Array.from({ length: PORTFOLIO_SLOT_COUNT }, (_, index) =>
              renderSlot("gallery", index, `Gallery photo ${index + 1}`),
            )}
          </div>
        </section>
      </div>

      {loading && (
        <output className="block text-sm text-gray-500" aria-live="polite">
          Loading images...
        </output>
      )}

      <div className="flex justify-end gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          onChange={handleUpload}
          disabled={busy}
          className="sr-only"
          aria-label="Choose a photo to upload"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={busy || !selection}
          className="inline-flex items-center gap-2 rounded-md bg-black px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Upload aria-hidden="true" className="size-4" />
          {uploading
            ? "Uploading..."
            : selectedImage
              ? "Replace photo"
              : "Upload photo"}
        </button>

        <button
          type="button"
          onClick={handleDelete}
          disabled={busy || !selectedImage}
          className="inline-flex items-center gap-2 rounded-md border border-black px-4 py-2.5 text-sm font-medium text-black transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Trash2 aria-hidden="true" className="size-4" />
          {deleting ? "Deleting..." : "Delete photo"}
        </button>
      </div>
    </div>
  );
}
