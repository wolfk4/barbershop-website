import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { db } from "@/db/drizzle";
import { shopItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { AddToCartButton } from "@/components/cart-btn";
import { SizeSelector } from "@/components/size-selector";

/* For the time being, we will fetch the product data from the API route instead of directly from the database. This is a temporary solution until I can set up a proper database connection in the Next.js app.
 */

export default async function ProductPage({ params }: { params: { id: string } }) {

  const { id } = await params;

  //Used for data base connection, but for now we will use the API route to fetch the product data.


    const [item] = await db.select().from(shopItems).where(eq(shopItems.id, id)).limit(1);
    if(!item) {
      notFound();
      }

  return (
    <div className="flex min-h-screen flex-col bg-[#f0f0f0]">
      <Header />
      <div className="flex flex-1 flex-col items-start gap-8 py-16 px-6 pl-6 md:pl-16 lg:pl-32">
        <div className="flex w-full max-w-6xl flex-col gap-24 md:flex-row">
          <div className="w-full md:w-1/2">
            <Image
              src={item.image || "/placeholder.png"}
              alt={item.title}
              width={400}
              height={400} />
          </div>

          <div className="flex w-full flex-col items-center justify-center text-center md:w-1/2">
            <h1 className="text-5xl font-bold">{item.title}</h1>
            <p className="mx-auto mt-4 max-w-md indent-8 text-muted-foreground text-left">{item.description}</p>
            <p className="mt-4 mb-4 text-2xl font-semibold">${item.price.toFixed(2)}</p>
            {/* Not Sure What the input is add to db schema first this menu */}
            {/* <SizeSelector stockBySize={item.stockBySize} /> */}
            <AddToCartButton itemId={item.id} />
          </div>

        </div>
      </div>
       <Footer />
    </div>
  );
}
 