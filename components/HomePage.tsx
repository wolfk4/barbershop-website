import Image from "next/image"
import Link from "next/link"
import { Phone, MapPin } from "lucide-react"
import { TypingAnimation } from "./ui/typing-animation"
 
export default function HomePage() {
  const shopConfig = {
    address: "5411 San Juan Ave, Citrus Heights, CA 95610",
    phone: "(916) 844-7020",
    phoneHref: "+19168447020",
  }
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shopConfig.address)}`
 
  return (
    <main className="w-full">
      {/* hero */}
      <section className="relative h-[85vh] min-h-125 w-full">
        <Image
          src="/hero.webp"
          alt="Kaizen Cutz barbershop storefront"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* dark overlay so text is readable */}
        <div className="absolute inset-0 bg-black/55 backdrop-blur-[7px]" />
 
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
          <p className="mb-4 text-sm uppercase tracking-[0.4em] text-gray-300">
            Citrus Heights · Est. 2023
          </p>
          <h1 className="mb-6 text-5xl font-extrabold uppercase tracking-widest drop-shadow-lg md:text-7xl">
            Kaizen Cutz
          </h1>
          <p className="mb-10 max-w-2xl text-base text-gray-200 md:text-lg">
            Precision cuts and esthetic treatments for clients who care about detail,
            consistency, and a refined experience.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/scheduling"
              className="rounded-full bg-white px-10 py-4 font-bold uppercase tracking-wide text-black transition hover:bg-gray-200"
            >
              Book Now
            </Link>
            <Link
              href="/meet-the-team"
              className="rounded-full border border-white px-10 py-4 font-bold uppercase tracking-wide text-white transition hover:bg-white hover:text-black"
            >
              Meet the Team
            </Link>
          </div>
        </div>
      </section>
 
      {/* contact strip (keeps the typing animation) */}
      <div className="flex min-h-20 w-full flex-col items-center justify-center gap-3 bg-black px-4 py-5 text-center text-lg font-black text-white sm:flex-row sm:gap-6 sm:text-xl">
        <a
          href={`tel:${shopConfig.phoneHref}`}
          className="flex shrink-0 items-center gap-2 transition hover:text-gray-300"
        >
          <Phone className="h-5 w-5" />
          {shopConfig.phone}
        </a>
 
        <span aria-hidden="true" className="hidden text-gray-600 sm:inline">
          |
        </span>
 
        <a
          href={mapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 transition hover:text-gray-300"
        >
          <MapPin className="h-5 w-5 shrink-0" />
          <TypingAnimation
            words={[shopConfig.address]}
            typeSpeed={50}
            pauseDelay={2000}
            className="text-lg font-black sm:text-xl"
          />
        </a>
      </div>
    </main>
  )
}
 
