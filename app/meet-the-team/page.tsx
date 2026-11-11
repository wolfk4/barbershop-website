import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Scissors } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { db } from "@/db/drizzle"
import { barbers } from "@/db/schema"
import { resolveImageUrl } from "@/lib/image-url"

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
  const rows = await db.select().from(barbers)

  // turn bucket paths into signed links so private images can load
  const barberList = await Promise.all(
    rows.map(async (barber) => ({ ...barber, image: await resolveImageUrl(barber.image) })),
  )

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-black">
      <Header />

      {/* title - uppercase + wide spacing to match the home page and logo */}
      <section className="bg-black px-6 py-14 text-center text-white md:py-16">
        <h1 className="text-4xl font-extrabold uppercase tracking-widest md:text-6xl">
          Meet the Team
        </h1>
      </section>

      <main className="mx-auto w-full max-w-300 flex-1 px-6 py-16">
        {barberList.length === 0 ? (
          <div className="rounded-2xl border px-6 py-20 text-center">
            <div className="mx-auto mb-6 w-fit rounded-full bg-black p-4 text-white">
              <Scissors className="h-7 w-7" />
            </div>
            <h2 className="mb-3 text-2xl font-semibold">Team info coming soon</h2>
            <p className="text-gray-500">Check back soon to meet our barbers.</p>
          </div>
        ) : (
          // flex-wrap + justify-center keeps the last row centered no matter how many barbers there are
          <div className="flex flex-wrap justify-center gap-8">
            {barberList.map((barber) => (
              <Link
                key={barber.id}
                href={`/barbers/${barber.id}`}
                className="group relative block aspect-3/4 w-full overflow-hidden rounded-2xl bg-black shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)]"
              >
                {/* photo or initials */}
                {barber.image ? (
                  <Image
                    src={barber.image}
                    alt={barber.name}
                    fill
                    unoptimized
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-neutral-800 via-neutral-900 to-black">
                    <Image
                      src="/KClogo.png"
                      alt=""
                      width={220}
                      height={220}
                      className="absolute opacity-10 transition duration-500 group-hover:scale-105"
                    />
                    <span className="relative text-6xl font-extrabold tracking-widest text-white">
                      {getInitials(barber.name)}
                    </span>
                  </div>
                )}

                {/* dark fade so the text is readable on any photo */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/90 via-black/50 to-transparent" />

                {/* name + info */}
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <h2 className="text-xl font-extrabold uppercase tracking-wider">
                    {barber.name}
                  </h2>
                  {barber.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-gray-300">
                      {barber.description}
                    </p>
                  )}
                  <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide text-black transition group-hover:bg-gray-200">
                    View Profile
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* booking CTA */}
      <section className="bg-black px-6 py-16 text-center text-white">
        <h2 className="mb-3 text-3xl font-bold md:text-4xl">Ready for a fresh cut?</h2>
        <p className="mx-auto mb-8 max-w-md text-gray-300">
          Pick your barber and book a time that works for you.
        </p>
        <Link
          href="/scheduling"
          className="inline-block rounded-full bg-white px-10 py-4 font-bold uppercase tracking-wide text-black transition hover:bg-gray-200"
        >
          Book Now
        </Link>
      </section>

      <Footer />
    </div>
  )
}
