import Link from "next/link"
import Image from "next/image"
import { HeartHandshake, Smile, Star, Trophy } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
 
export const metadata = {
  title: "About Us | Kaizen Cutz",
}
 
const values = [
  {
    icon: Trophy,
    title: "Service Comes First",
    text: "Customer service is Number 1. Every client gets our full attention from the moment they walk in.",
  },
  {
    icon: HeartHandshake,
    title: "More Than a Cut",
    text: "It's not just a haircut. It's a relationship we build with you visit after visit.",
  },
  {
    icon: Smile,
    title: "Friendly Vibes",
    text: "A laid back, welcoming shop where everyone feels at home in the chair.",
  },
]
 
export default function AboutUsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-black">
      <Header />
 
      {/* banner with the shop photo behind it */}
      <section className="relative overflow-hidden bg-black px-6 py-24 text-center text-white md:py-32">
        <Image src="/hero.webp" alt="" fill priority sizes="100vw" className="object-cover opacity-30" />
        {/* inline-block so the line underneath matches the title width */}
        <div className="relative inline-block">
          <h1 className="text-4xl font-extrabold uppercase tracking-widest md:text-6xl">About Us</h1>
          <div className="mt-6 h-1 w-full bg-white" />
        </div>
      </section>
 
      <main className="flex-1">
        {/* intro */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:gap-16">
          <div>
            <h2 className="mb-6 text-3xl font-extrabold uppercase leading-tight tracking-widest md:text-4xl">
              Who We Are
            </h2>
            <p className="mb-4 text-lg leading-relaxed text-gray-700">
              We are the Premier Barbershop in the Sacramento area. We&apos;re different from other
              Barbers. We care about customer service &mdash; that&apos;s Number 1.
            </p>
            <p className="text-lg leading-relaxed text-gray-700">We are a very friendly environment.</p>
          </div>
 
          <div className="relative mx-auto flex aspect-square w-full max-w-sm items-center justify-center rounded-2xl bg-black shadow-2xl ring-1 ring-black/10">
            <Image src="/KClogo.png" alt="Kaizen Cutz logo" width={260} height={260} />
          </div>
        </section>
 
        {/* values */}
        <section className="bg-neutral-100 px-6 py-20">
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
            {values.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="flex flex-col rounded-2xl bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-6 w-fit rounded-full bg-black p-4 text-white">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mb-3 text-xl font-extrabold uppercase tracking-wider">{title}</h3>
                <p className="leading-relaxed text-gray-600">{text}</p>
              </div>
            ))}
          </div>
        </section>
 
        {/* call to action */}
        <section className="px-6 py-20 text-center">
          <h2 className="mb-4 text-3xl font-extrabold uppercase tracking-widest">Ready for a Fresh Cut?</h2>
          <p className="mb-10 text-lg text-gray-600">Come see why Sacramento keeps coming back.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/scheduling"
              className="rounded-full bg-black px-10 py-4 font-bold uppercase tracking-wide text-white transition hover:bg-gray-800"
            >
              Book Now
            </Link>
            <Link
              href="/meet-the-team"
              className="rounded-full border-2 border-black px-10 py-4 font-bold uppercase tracking-wide text-black transition hover:bg-black hover:text-white"
            >
              Meet the Team
            </Link>
          </div>
        </section>
      </main>
 
      <Footer />
 
      {/* staff login shortcut */}
      <Link
        href="/login"
        aria-label="Staff login"
        className="fixed bottom-6 right-6 z-50 rounded-full bg-black p-4 text-white shadow-xl ring-2 ring-white transition hover:scale-105 hover:bg-gray-800"
      >
        <Star className="h-6 w-6" />
      </Link>
    </div>
  )
}
 