import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { db } from "@/db/drizzle";
import { shopItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { AddToCartButton } from "@/components/cart-btn";
import { ProductSizes } from "@/components/product-sizes";


 
export default async function ProductPage({ params }: { params: { id: any } }) {

  const { id } = await params;


  const [ item ] = await db.select().from(shopItems).where(eq(shopItems.id, id)).limit(1);
    if(!item) {
    notFound();
  }
  


  return (
    <div className="bg-[#f0f0f0] min-h-screen">
      <Header />
 
      <div className="flex flex-col items-center py-16 px-6">
        <div className="w-full max-w-lg">
          <h3>{item?.title || "Product not found"}</h3>
          <Image src={item.image || "/shirt.jpg"} alt={item?.title} width={400} height={400} />
          <ProductSizes
            itemId={item.id}
            sizes={[
              { size: "S", stock: 77 },
              { size: "M", stock: 0 },
              { size: "L", stock: 33 },
            ]}
/>
        </div>
      </div>
       <Footer />
    </div>
  );
}
 