import Footer from "@/components/footer"
import Header from "@/components/header"
import { MapPin, Phone, Mail, Clock, ArrowUpRight } from "lucide-react"

const ADDRESS = "5411 San Juan Ave, Citrus Heights, CA 95610"
const PHONE = "(916) 844-7020"
const EMAIL = "info@barbershop.com" // Replace with the shop email

export default function Page() {
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`

  const inputClassName =
    "w-full rounded-none border border-gray-300 bg-white px-4 py-3 text-base placeholder:text-gray-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"

  return (
    <div className="bg-white font-sans text-gray-950">
      <Header />

      <main>
        {/* Hero */}
        <section className="bg-gray-950 px-6 py-16 text-white sm:py-24">
          <div className="mx-auto max-w-6xl text-center">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
              Kaizen Cutz
            </p>

            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Get in Touch
            </h1>

            <p className="mx-auto mt-5 max-w-md text-base leading-7 text-gray-300">
              Walk-ins welcome. Book ahead to skip the wait.
              We look forward to seeing you.
            </p>

            <a
              href="tel:+19168447020"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-black transition hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <Phone size={16} aria-hidden="true" />
              Call Us
            </a>
          </div>
        </section>

        {/* Contact details */}
        <section className="border-b border-gray-200 px-6 py-10 sm:py-12">
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3 md:gap-10">
            <div className="flex items-start gap-4">
              <Clock
                className="mt-1 shrink-0 text-gray-500"
                size={22}
                aria-hidden="true"
              />

              <div className="min-w-0">
                <h2 className="text-lg font-semibold">Hours</h2>
                <div className="mt-3 space-y-1 text-sm leading-6 text-gray-600">
                  <p>Monday to Friday: 10 AM to 6 PM</p>
                  <p>Saturday: 9 AM to 5 PM</p>
                  <p>Sunday: 10 AM to 5 PM</p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MapPin
                className="mt-1 shrink-0 text-gray-500"
                size={22}
                aria-hidden="true"
              />

              <div className="min-w-0">
                <h2 className="text-lg font-semibold">Visit Us</h2>
                <a
                  href={mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 block text-sm leading-6 text-gray-600 hover:text-black hover:underline"
                >
                  5411 San Juan Ave
                  <br />
                  Citrus Heights, CA 95610
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone
                className="mt-1 shrink-0 text-gray-500"
                size={22}
                aria-hidden="true"
              />

              <div className="min-w-0">
                <h2 className="text-lg font-semibold">Contact</h2>
                <div className="mt-3 space-y-2 text-sm leading-6 text-gray-600">
                  <a
                    href="tel:+19168447020"
                    className="block hover:text-black hover:underline"
                  >
                    {PHONE}
                  </a>
                  <a
                    href={`mailto:${EMAIL}`}
                    className="flex items-start gap-2 hover:text-black hover:underline"
                  >
                    <Mail
                      size={16}
                      className="mt-1 shrink-0"
                      aria-hidden="true"
                    />
                    <span className="break-words">{EMAIL}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Form and map */}
        <section className="bg-gray-100 px-6 py-12 sm:py-20">
          <div className="mx-auto grid max-w-6xl items-stretch gap-8 lg:grid-cols-2">
            <div className="p-6 sm:p-10">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Send Us a Message
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Have a question? Leave us a message below.
              </p>

              {/* Connect this form to your submission handler. */}
              <form className="mt-8 space-y-6">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="mb-2 block text-sm font-medium"
                  >
                    Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Your name"
                    required
                    className={inputClassName}
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="mb-2 block text-sm font-medium"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={6}
                    placeholder="How can we help?"
                    required
                    className={`${inputClassName} block resize-y`}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-gray-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
                >
                  Send Message
                </button>
              </form>
            </div>

            <div className="flex overflow-hidden rounded-none border border-gray-200 bg-white flex-col">


              <iframe
                src={`https://www.google.com/maps?q=${encodeURIComponent(ADDRESS)}&output=embed`}
                className="min-h-[400px] w-full flex-1 border-0"
                loading="lazy"
                title="Kaizen Cutz location"
                allowFullScreen
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}