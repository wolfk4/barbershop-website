import Link from "next/link"
import Image from "next/image"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { db } from "@/db/drizzle"
import { barbers } from "@/db/schema"

export const metadata = {
  title: "Meet the Team | Kaizen Cutz",
}

export default async function MeetTheTeamPage() {
  const barbers2 = await db.select().from(barbers)



  return (
    <div className="bg-[#f0f0f0] min-h-screen">
      <Header />

      <main className="flex flex-col items-center py-16">
        <h1 className="text-4xl font-bold underline mb-12 tracking-wide w-full text-center">Meet the Team</h1>

        <div className="flex flex-wrap justify-center gap-10">
          {barbers2.map((barber) => (
            <Link
              key={barber.id}
              href={`/barbers/${barber.id}`}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="relative w-48 h-60 rounded-2xl overflow-hidden bg-gray-200 group-hover:opacity-90 transition-opacity">
                {barber.image ? (
                  <Image
                    src={barber.image}
                    alt={barber.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <svg viewBox="0 0 100 120" className="w-20 h-20 text-gray-400" fill="currentColor">
                      <circle cx="50" cy="38" r="22" />
                      <path d="M10 110 Q10 75 50 75 Q90 75 90 110 Z" />
                    </svg>
                  </div>
                )}
              </div>
              <span className="text-sm font-semibold">{barber.name}</span>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}