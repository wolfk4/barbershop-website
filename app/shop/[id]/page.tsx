import { notFound } from "next/navigation";
import Image from "next/image";
//import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
//import { db } from "@/db/drizzle";
//import { shopItems } from "@/db/schema";
//import { eq } from "drizzle-orm";
import { AddToCartButton } from "@/components/cart-btn";

export default async function ProductPage({ params }: { params: { id: any } }) {

  const { id } = await params;

  const response = await fetch(`http://localhost:3000/api/products/${id}`)
  if(!response.ok) {
    notFound();
  }

  const item = await response.json();

  /*const [ item ] = await db.select().from(shopItems).where(eq(shopItems.id, id)).limit(1);
    if(!item) {
    notFound();
  }*/

  return (
    <div className="flex min-h-screen flex-col bg-[#f0f0f0]">
      <Header />
      <div className="flex flex-1 flex-col items-start gap-8 py-16 px-6 pl-6 md:pl-16 lg:pl-32">
        <div className="flex w-full max-w-6xl flex-col gap-24 md:flex-row">
          <div className="w-full md:w-1/2">
            <Image
              src={item.image}
              alt={item.name}
              width={400}
              height={400} />
          </div>

          <div className="flex w-full flex-col items-center justify-center text-center md:w-1/2">
            <h1 className="text-5xl font-bold">{item.name}</h1>
            <p className="mx-auto mt-4 max-w-md indent-8 text-muted-foreground text-left">{item.description}</p>
            <p className="mt-4 text-2xl font-semibold">${item.price.toFixed(2)}</p>
            <AddToCartButton itemId={item.id} />
          </div>

        </div>
      </div>
       <Footer />
    </div>
  );
}
 