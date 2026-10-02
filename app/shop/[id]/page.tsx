'use client';
import Image from "next/image";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { SizeSelector } from "@/components/size-selector";
import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";


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

        if (!res.ok) {
          throw new Error("Failed to load product.");
        }

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
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchProduct();

    return () => controller.abort();
  }, [id]);


  if (loading) return <p>Loading...</p>;
  if (missing) notFound();

  console.log(item)

  return (
    <div className="flex min-h-screen flex-col bg-[#f0f0f0]">
      <Header />
      <div className="flex flex-1 flex-col items-start gap-8 py-16 px-6 mx-auto">
        <div className="flex w-full max-w-6xl flex-col gap-24 md:flex-row">
          <div className="w-full md:w-1/2">
            <Image
              src={item.image}
              alt={item.title}
              width={400}
              height={400} />
          </div>
          
          <div className="flex w-full flex-col items-center justify-center text-center md:w-1/2">
            <h1 className="text-5xl font-bold">{item.title}</h1>
            <p className="mx-auto mt-4 max-w-md indent-8 text-muted-foreground text-left">{item.description}</p>
            <p className="mt-4 mb-4 text-2xl font-semibold">${item.price.toFixed(2)}</p>
            {/* Not Sure What the input is add to db schema first this menu */}
            <SizeSelector
              itemId={item.id}
              stockBySize={item.stockBySize ? JSON.parse(item.stockBySize) : {}}
            />
          </div>

        </div>
      </div>
       <Footer />
    </div>
  );
}
 