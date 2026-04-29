import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
//import { barbers, getBarberBySlug } from "@/lib/barbers";
import { Button } from "@/components/ui/button";
 
export function generateStaticParams() {
  return barbers.map((b) => ({ slug: b.slug }));
}
 
export function generateMetadata({ params }: { params: { slug: string } }) {
  const barber = getBarberBySlug(params.slug);
  if (!barber) return { title: "Barber Not Found" };
  return { title: `${barber.name} | Kaizen Cutz` };
}
 
export default function BarberBioPage({ params }: { params: { slug: string } }) {
  const barber = getBarberBySlug(params.slug);
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
              {barber.image ? (
                <Image
                  src={barber.image}
                  alt={barber.name}
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
              <h1 className="text-2xl font-bold">{barber.name}</h1>
              <p className="text-gray-500 text-sm mt-1">{barber.title}</p>
 
              <p className="mt-4 text-gray-700">{barber.bio}</p>
 
              {barber.specialties.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-500 mb-1">Specialties</p>
                  <p className="text-sm text-gray-700">{barber.specialties.join(", ")}</p>
                </div>
              )}
 
              <Button className="mt-6 w-full" asChild>
                <Link href="/book">Book with {barber.name}</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
 
      <Footer />
    </div>
  );
}
 