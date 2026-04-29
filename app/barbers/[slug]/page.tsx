import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { getBarberBySlug, getAllBarberSlugs } from "@/lib/barbers"
import { Button } from "@/components/ui/button"
 
export const revalidate = 60
 
export async function generateStaticParams() {
  const slugs = await getAllBarberSlugs()
  return slugs.map((b) => ({ slug: b.slug }))
}
 
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const barber = await getBarberBySlug(params.slug)
  if (!barber) return { title: "Not Found" }
  return { title: `${barber.name} | Kaizen Cutz` }
}
 
export default async function BarberBioPage({ params }: { params: { slug: string } }) {
  const barber = await getBarberBySlug(params.slug)
  if (!barber) notFound()
 
  const bookLink = barber.booking_url ?? "/book"
 
  // pading for the gallery to show 6 slots
  const photos = Array.from({ length: 6 }, (_, i) => barber.gallery[i] ?? null)
 
  return (
    <div className="bg-[#f0f0f0] min-h-screen">
      <Header />
 
      <main className="max-w-4xl mx-auto px-6 py-12">
        <Link href="/meet-the-team" className="text-sm text-black hover:underline">
          ← Back to Meet the Team
        </Link>
 
        <div className="mt-8 flex flex-col md:flex-row gap-6">
 
          {/* main photo */}
          <div className="relative w-full md:w-80 h-80 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-200">
            {barber.image ? (
              <Image
                src={barber.image}
                alt={barber.name}
                fill
                className="object-cover object-top"
              />
            ): 
            (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <svg viewBox="0 0 100 120" className="w-20 h-20 text-black" fill="currentColor">
                  <circle cx="50" cy="38" r="22" />
                  <path d="M10 110 Q10 75 50 75 Q90 75 90 110 Z" />
                </svg>
              </div>
            )}
          </div>
 
          {/* haircut photos */}
          <div className="grid grid-cols-3 gap-2 flex-1">
            {photos.map((src, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-200">
                {src && (
                  <Image
                    src={src}
                    alt={`haircut ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
 
        <div className="mt-8 max-w-sm">
          <h1 className="text-2xl font-bold">{barber.name}</h1>
          {barber.title && <p className="text-sm text-black mt-1">{barber.title}</p>}
 
          <p className="mt-4 text-sm text-black leading-relaxed">
            {barber.bio || "Bio coming soon."}
          </p>
 
          {barber.specialties.length > 0 && (
            <p className="mt-3 text-sm text-black">
              <span className="font-semibold">Specialties: </span>
              {barber.specialties.join(", ")}
            </p>
          )}
 
          <Button className="mt-6 bg-black hover:bg-black text-white uppercase tracking-widest text-sm px-8 py-3" asChild>
            <Link href={bookLink}>Book Now</Link>
          </Button>
        </div>
      </main>
 
      <Footer />
    </div>
  )
}