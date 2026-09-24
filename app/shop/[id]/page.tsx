import { notFound } from "next/navigation";
import Image from "next/image";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { AddToCartButton } from "@/components/cart-btn";
import { SizeSelector } from "@/components/size-selector";


export default async function ProductPage({ params }: { readonly params: Promise<{ id: string }> }) {

  const { id } = await params;

  // Fetch product data from the API
  const response = await fetch(`http://localhost:3000/api/products/${id}`)
  if(!response.ok) {
    notFound();
  }

  // Parse the response as JSON
  const item = await response.json();

  return (
    <div className="flex min-h-screen flex-col bg-[#f0f0f0]">
      <Header />
      <div className="flex flex-1 flex-col items-start gap-8 py-16 px-6 pl-6 md:pl-16 lg:pl-32">
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
            <SizeSelector sizes={item.sizes} />
            <AddToCartButton itemId={item.id} />
          </div>

        </div>
      </div>
       <Footer />
    </div>
  );
}
 