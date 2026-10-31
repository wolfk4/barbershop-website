import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { db } from "@/db/drizzle"
import { barbers } from "@/db/schema"
 
export const metadata = {
  title: "Meet the Team | Kaizen Cutz",
}
 
// re-check the database each request so new barbers show up right away
export const dynamic = "force-dynamic"
 
function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}
 
export default async function MeetTheTeamPage() {
  // TODO: SHIFT TO API
  const barberList = await db.select().from(barbers)
 
  return (
    <div className="min-h-screen bg-white">
      <Header />
 
      <main className="mx-auto max-w-7xl px-6 py-20">
        {/* title */}
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-gray-500">
            Our Barbers
          </p>
          <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">Meet the Team</h1>
          <p className="mx-auto max-w-xl text-gray-600">
            Get to know the people behind the chair.
          </p>
        </div>
 
        {barberList.length === 0 ? (
          <p className="text-center text-gray-500">Team info coming soon.</p>
        ) : (
          <div className="flex flex-wrap justify-center gap-8">
            {barberList.map((barber) => (
              <Link
                key={barber.id}
                href={`/barbers/${barber.id}`}
                className="group w-full max-w-65 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                {/* photo */}
                <div className="relative aspect-4/5 w-full overflow-hidden bg-black">
                  {barber.image ? (
                    <Image
                      src={barber.image}
                      alt={barber.name}
                      fill
                      sizes="260px"
                      className="object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="text-5xl font-extrabold tracking-widest text-white">
                        {getInitials(barber.name)}
                      </span>
                    </div>
                  )}
                </div>
 
                {/* info */}
                <div className="p-5 text-center">
                  <h2 className="text-lg font-bold">{barber.name}</h2>
                  {barber.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                      {barber.description}
                    </p>
                  )}
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold uppercase tracking-wide text-black">
                    View Profile
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
 
      <Footer />
    </div>
  )
}
 
