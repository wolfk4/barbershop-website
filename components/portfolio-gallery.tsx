"use client";
 
import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
 
type Props = {
  images: string[];
  barberName: string;
};
 
export default function PortfolioGallery({ images, barberName }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
 
  const close = () => setOpenIndex(null);
  const prev = () =>
    setOpenIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  const next = () => setOpenIndex((i) => (i === null ? null : (i + 1) % images.length));
 
  // keyboard: esc to close, arrows to move
  useEffect(() => {
    if (openIndex === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
 
  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((url, index) => (
          <button
            key={url}
            type="button"
            onClick={() => setOpenIndex(index)}
            aria-label={`View ${barberName}'s work ${index + 1}`}
            className="group relative aspect-4/5 overflow-hidden rounded-xl bg-gray-100"
          >
            <Image
              src={url}
              alt={`${barberName}'s work ${index + 1}`}
              fill
              unoptimized
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          </button>
        ))}
      </div>
 
      {/* enlarged view */}
      {openIndex !== null && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 p-4"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 text-white hover:text-gray-300"
          >
            <X className="h-8 w-8" />
          </button>
 
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous photo"
              className="absolute left-4 text-white hover:text-gray-300"
            >
              <ChevronLeft className="h-10 w-10" />
            </button>
          )}
 
          <div
            className="relative h-[80vh] w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[openIndex]}
              alt={`${barberName}'s work ${openIndex + 1}`}
              fill
              unoptimized
              sizes="100vw"
              className="object-contain"
            />
          </div>
 
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next photo"
              className="absolute right-4 text-white hover:text-gray-300"
            >
              <ChevronRight className="h-10 w-10" />
            </button>
          )}
 
          <p className="absolute bottom-4 text-sm text-gray-400">
            {openIndex + 1} / {images.length}
          </p>
        </div>
      )}
    </>
  );
}
