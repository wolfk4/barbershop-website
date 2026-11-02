import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
 
export const metadata = {
  title: "Book an Appointment | Kaizen Cutz",
}
 
const BOOKSY_URL =
  "https://booksy.com/en-us/974082_kaizen-cutz_barber-shop_100342_citrus-heights"
 
export default function SchedulingPage() {
  return (
    <div className="font-sans bg-black text-white">
      <Header />
 
      <section className="relative flex min-h-[calc(100svh-88px)] items-center justify-center overflow-hidden px-6 py-24">
        {/* soft glow behind the text */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
 
        <div className="relative z-10 text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.4em] text-gray-400">Kaizen Cutz</p>
          <h1 className="text-5xl font-extrabold md:text-7xl">Book Your Appointment</h1>
          <div className="mx-auto my-10 h-px w-24 bg-white/40" />
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href={BOOKSY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white px-10 py-4 font-bold uppercase tracking-wide text-black transition hover:bg-gray-200"
            >
              Book with Booksy
            </a>
            <Link
              href="/meet-the-team"
              className="rounded-full border border-white px-10 py-4 font-bold uppercase tracking-wide text-white transition hover:bg-white hover:text-black"
            >
              Meet the Team
            </Link>
          </div>
        </div>
      </section>
 
      <Footer />
    </div>
  )
}
