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
  const barber =  await db.select().from(barbers).where(eq(barbers.id, id)).limit(1)
  if (!barber) notFound();

 
  return (
    <div className="bg-[#f0f0f0] min-h-screen">
      <Header />
 
      <main className="flex flex-col items-center py-16 px-6">
        <div className="w-full max-w-lg">
          <Link href="/meet-the-team" className="text-sm text-gray-600 hover:underline">
            ← Back to Meet the Team
          </Link>
 
          <div className="mt-6 bg-white rounded-xl overflow-hidden">
            <div className="relative w-full h-72 bg-gray-200">
              {barber[0].image ? (
                <Image
                  src={barber[0].image}
                  alt={barber[0].name}
                  fill
                  className="object-cover object-top"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg viewBox="0 0 100 120" className="w-24 h-24 text-gray-400" fill="currentColor">
                    <circle cx="50" cy="38" r="22" />
                    <path d="M10 110 Q10 75 50 75 Q90 75 90 110 Z" />
                  </svg>
                </div>
              )}
            </div>
 
            <div className="p-6">
              <h1 className="text-2xl font-bold">{barber[0].name}</h1>
              <p className="text-gray-500 text-sm mt-1">{barber[0].createdAt.toLocaleDateString()}</p>
 
              <p className="mt-4 text-gray-700">{barber[0].description}</p>
 
              {/* {barber[0].specialties.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-500 mb-1">Specialties</p>
                  <p className="text-sm text-gray-700">{barber.specialties.join(", ")}</p>
                </div>
              )}
  */}
              {/* <Button className="mt-6 w-full" asChild>
                <Link href="/book">Book with {barber.name}</Link>
              </Button> */}
            </div>
          </div>
        </div>
      </main>
 
      <Footer />
    </div>
  );
}
 