import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { db } from "@/db/drizzle";
import { barbers } from "@/db/schema";
import { eq } from "drizzle-orm";

 
export default async function BarberBioPage({ params }: { params: { id: number } }) {
  const { id } = await params
 
  return (
    <div className="bg-[#f0f0f0] min-h-screen">
      <Header />
 
      <main className="flex flex-col items-center py-16 px-6">
        <div className="w-full max-w-lg">
          <h3>Product Page</h3>
          <Image src="/tshirt.jpg" alt="Product" width={400} height={400} />
        </div>
      </main>
       <Footer />
    </div>
  );
}
 