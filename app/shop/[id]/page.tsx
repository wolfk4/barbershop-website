'use client';
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { SizeSelector } from "@/components/size-selector";
import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
 
export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);
 
  useEffect(() => {
    const controller = new AbortController();
 
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${encodeURIComponent(id)}`, {
          signal: controller.signal,
        });
 
        if (res.status === 404) {
          setMissing(true);
          return;
        }
 
        if (!res.ok) throw new Error("Failed to load product.");
 
        const data = await res.json();
        if (!data) {
          setMissing(true);
          return;
        }
 
        setItem(data);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Error fetching product:", error);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
 
    fetchProduct();
    return () => controller.abort();
  }, [id]);
 
  if (missing) notFound();
 
  return (
    <div className="font-sans bg-white text-black min-h-screen flex flex-col">
      <Header />
 
      <main className="flex-1 max-w-300 mx-auto w-full px-6 py-12 md:py-16 text-left">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-500 hover:text-black transition mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>
 
        {loading || !item ? (
          <div className="grid gap-10 md:grid-cols-2 md:gap-16">
            <div className="aspect-square rounded-2xl bg-gray-100 animate-pulse" />
            <div className="space-y-4 pt-4">
              <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
              <div className="h-12 w-2/3 bg-gray-100 rounded animate-pulse" />
              <div className="h-8 w-28 bg-gray-100 rounded animate-pulse" />
              <div className="h-24 w-full bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        ) : (
          <div className="grid gap-10 md:grid-cols-2 md:gap-16">
            {/* image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
                priority
              />
            </div>
 
            {/* details */}
            <div className="flex flex-col">
              <h1 className="text-4xl md:text-5xl font-bold">{item.title}</h1>
              <p className="text-3xl font-bold mt-4">${Number(item.price).toFixed(2)}</p>
 
              <div className="h-px bg-gray-200 my-8" />
 
              <SizeSelector
                itemId={item.id}
                stockBySize={item.stockBySize ? JSON.parse(item.stockBySize) : {}}
              />
 
              {item.description && (
                <div className="mt-10">
                  <h2 className="text-sm font-semibold uppercase tracking-wide mb-2">
                    Description
                  </h2>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              )}
 
              {item.moreInfo && (
                <div className="mt-6">
                  <h2 className="text-sm font-semibold uppercase tracking-wide mb-2">
                    Details
                  </h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {item.moreInfo}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
 
      <Footer />
    </div>
  );
}
