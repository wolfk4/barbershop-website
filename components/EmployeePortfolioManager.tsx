"use client";
 
import { ImagePlus, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import EmployeeProfileForm from "@/components/EmployeeProfileForm";
import { PORTFOLIO_SLOT_COUNT } from "@/lib/portfolio";
 
type PortfolioImage = {
  id: string;
  slot: number;
  contentType: string;
  createdAt: string;
  url: string;
};
 
type PortfolioData = {
  heroImage: string | null;
  images: PortfolioImage[];
};
 
type Status = { type: "success" | "error"; text: string } | null;
 
const IMAGES_URL = "/api/employee/images";
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png"]);
 
async function fetchPortfolioData(): Promise<PortfolioData> {
  const response = await fetch(IMAGES_URL, { cache: "no-store" });
  const data = await response.json();
 
  if (!response.ok) {
    throw new Error(data.error ?? "Failed to load portfolio images.");
  }
 
  return {
    heroImage: data.heroImage ?? null,
    images: Array.isArray(data.images) ? data.images : [],
  };
}
 
export default function EmployeePortfolioManager() {
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [images, setImages] = useState<PortfolioImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [status, setStatus] = useState<Status>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
 
  useEffect(() => {
    let cancelled = false;
 
    async function loadPortfolio() {
      try {
        const portfolio = await fetchPortfolioData();
        if (!cancelled) {
          setHeroImage(portfolio.heroImage);
          setImages(portfolio.images);
        }
      } catch {
        if (!cancelled) {
          setStatus({ type: "error", text: "Couldn't load your work photos. Try refreshing." });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
 
    void loadPortfolio();
    return () => {
      cancelled = true;
    };
  }, []);
 
  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || selectedSlot === null) return;
    event.target.value = "";
 
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      setStatus({ type: "error", text: "Choose a JPG or PNG image." });
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setStatus({ type: "error", text: "Images must be 5 MB or smaller." });
      return;
    }
 
    setUploading(true);
    setStatus(null);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("slot", String(selectedSlot));
 
    try {
      const response = await fetch(IMAGES_URL, {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
 
      if (!response.ok) {
        throw new Error(result.error ?? "Couldn't upload this image.");
      }
 
      const portfolio = await fetchPortfolioData();
      setHeroImage(portfolio.heroImage);
      setImages(portfolio.images);
      setStatus({ type: "success", text: "Work photo uploaded." });
    } catch (error) {
      setStatus({
        type: "error",
        text: error instanceof Error ? error.message : "Couldn't upload this image.",
      });
    } finally {
      setUploading(false);
    }
  }
 
  const slots = Array.from(
    { length: PORTFOLIO_SLOT_COUNT },
    (_, index) => images.find((image) => image.slot === index) ?? null,
  );
  const selectedImage = selectedSlot === null ? null : slots[selectedSlot];
 
  async function handleDelete() {
    if (!selectedImage) return;
    if (!window.confirm("Delete this photo? This can't be undone.")) return;
 
    setDeleting(true);
    setStatus(null);
 
    try {
      const response = await fetch(`${IMAGES_URL}/${selectedImage.id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? "Couldn't delete this image.");
      }
 
      setImages((previous) => previous.filter((image) => image.id !== selectedImage.id));
      setStatus({ type: "success", text: "Work photo deleted." });
    } catch (error) {
      setStatus({
        type: "error",
        text: error instanceof Error ? error.message : "Couldn't delete this image.",
      });
    } finally {
      setDeleting(false);
    }
  }
 
  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(300px,0.9fr)_minmax(0,1.5fr)]">
      <section className="space-y-6" aria-label="Employee profile">
        <div className="flex items-center gap-5 rounded-2xl border p-5">
          <div className="relative size-24 shrink-0 overflow-hidden rounded-full bg-gray-100 ring-1 ring-gray-200">
            {heroImage ? (
              <Image
                src={heroImage}
                alt="Barber profile portrait"
                fill
                unoptimized
                sizes="(max-width: 1024px) 100vw, 35vw"
                className="object-cover object-center"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-gray-400">
                <ImagePlus aria-hidden="true" className="size-7" />
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide">Profile photo</p>
            <p className="mt-1 text-sm text-gray-500">
              {heroImage ? "This is what customers see on your page." : "No profile photo linked yet."}
            </p>
          </div>
        </div>
 
        <EmployeeProfileForm />
      </section>
 
      <section className="space-y-5 rounded-2xl border p-6 md:p-8" aria-label="Portfolio photos">
        <div>
          <h2 className="text-lg font-extrabold uppercase tracking-widest">Portfolio</h2>
          <p className="mt-1 text-sm text-gray-500">
            Up to {PORTFOLIO_SLOT_COUNT} photos. Pick a slot, then upload or delete.
          </p>
        </div>
 
        {status && (
          <output
            aria-live="polite"
            className={`block text-sm ${status.type === "success" ? "text-green-700" : "text-red-600"}`}
          >
            {status.text}
          </output>
        )}
 
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {slots.map((image, index) => (
            <button
              type="button"
              key={image?.id ?? `empty-${index}`}
              onClick={() => setSelectedSlot(index)}
              aria-pressed={selectedSlot === index}
              aria-label={image ? `Select work photo ${index + 1}` : `Select empty slot ${index + 1}`}
              className={`relative aspect-4/5 overflow-hidden rounded-xl border-2 bg-gray-50 transition hover:border-gray-400 ${
                selectedSlot === index ? "border-black ring-2 ring-black/10" : "border-gray-200"
              }`}
            >
              {image ? (
                <Image
                  src={image.url}
                  alt={`Barber portfolio work ${index + 1}`}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-gray-400">
                  <ImagePlus aria-hidden="true" className="size-7" />
                  <span className="text-xs">Photo slot</span>
                </div>
              )}
            </button>
          ))}
        </div>
 
        {loading && (
          <output className="block text-sm text-gray-500" aria-live="polite">
            Loading work photos...
          </output>
        )}
 
        <div className="flex flex-wrap justify-end gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,image/jpeg,image/png"
            onChange={handleUpload}
            className="sr-only"
            aria-label="Choose a work photo to upload"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || deleting || selectedSlot === null || selectedImage !== null}
            className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Upload aria-hidden="true" className="size-4" />
            {uploading ? "Uploading..." : "Upload photo"}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={uploading || deleting || selectedImage === null}
            className="inline-flex items-center gap-2 rounded-full border border-black px-6 py-3 text-sm font-bold uppercase tracking-wide text-black transition-colors hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-black"
          >
            <Trash2 aria-hidden="true" className="size-4" />
            {deleting ? "Deleting..." : "Delete photo"}
          </button>
        </div>
      </section>
    </div>
  );
}