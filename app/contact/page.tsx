import Footer from "@/components/footer"
import Header from "@/components/header"
import Link from "next/link"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
 
// re-render each request so "today" and "open now" stay correct
export const dynamic = "force-dynamic"
 
const ADDRESS = "5411 San Juan Ave, Citrus Heights, CA 95610"
const PHONE = "(916) 844-7020"
const EMAIL = "info@barbershop.com" // TODO: real shop email
const BOOKING_URL = "/" // TODO: wherever the Booksy widget lives
 
// open/close in 24h time
const hours = [
  { day: "Sunday", open: 10, close: 17 },
  { day: "Monday", open: 10, close: 18 },
  { day: "Tuesday", open: 10, close: 18 },
  { day: "Wednesday", open: 10, close: 18 },
  { day: "Thursday", open: 10, close: 18 },
  { day: "Friday", open: 10, close: 18 },
  { day: "Saturday", open: 9, close: 17 },
]
 
function formatHour(h: number) {
  const suffix = h >= 12 ? "PM" : "AM"
  const hour = h % 12 === 0 ? 12 : h % 12
  return `${hour}:00 ${suffix}`
}
 
// current day + hour in the shop's timezone
function getShopTime() {
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })
  )
  return { dayIndex: now.getDay(), hour: now.getHours() + now.getMinutes() / 60 }
}
 
function Page() {
  const { dayIndex, hour } = getShopTime()
  const today = hours[dayIndex]
  const isOpen = hour >= today.open && hour < today.close
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`
 
  const contactItems = [
    { icon: MapPin, label: "Address", value: ADDRESS, href: mapsLink },
    { icon: Phone, label: "Phone", value: PHONE, href: `tel:${PHONE.replace(/\D/g, "")}` },
    { icon: Mail, label: "Email", value: EMAIL, href: `mailto:${EMAIL}` },
  ]
 
  return (
    <div className="font-sans bg-white text-black">
      <Header />
 
      {/* title */}
      <section className="bg-black text-white py-20 px-6 text-center">
        <p className="uppercase tracking-[0.3em] text-sm text-gray-400 mb-3">
          Kaizen Cutz
        </p>
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Get in Touch</h1>
        <p className="text-gray-300 max-w-xl mx-auto mb-8">
          Walk-ins welcome. Book ahead to skip the wait.
        </p>
        <Link
          href={BOOKING_URL}
          className="inline-block bg-white text-black font-semibold px-8 py-3 rounded-full hover:bg-gray-200 transition"
        >
          Book Now
        </Link>
      </section>
 
      <section className="max-w-300 mx-auto px-6 py-16 grid gap-10 md:grid-cols-2">
        {/* left side */}
        <div className="space-y-6">
          {/* contact cards */}
          <div className="grid gap-4">
            {contactItems.map(({ icon: Icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                target={label === "Address" ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="flex items-center gap-4 border rounded-2xl p-5 hover:border-black hover:shadow-md transition"
              >
                <div className="bg-black text-white rounded-full p-3 shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{label}</p>
                  <p className="text-lg font-medium">{value}</p>
                </div>
              </a>
            ))}
          </div>
 
          {/* hours */}
          <div className="border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Clock className="w-6 h-6" /> Hours
              </h2>
              <span
                className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  isOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                {isOpen ? "Open now" : "Closed now"}
              </span>
            </div>
 
            <ul>
              {hours.map((h, i) => {
                const isToday = i === dayIndex
                return (
                  <li
                    key={h.day}
                    className={`flex justify-between py-3 px-3 rounded-lg ${
                      isToday ? "bg-black text-white font-semibold" : "border-b last:border-b-0"
                    }`}
                  >
                    <span>{h.day}{isToday && " (Today)"}</span>
                    <span>{formatHour(h.open)} – {formatHour(h.close)}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
 
        {/* map */}
        <div className="rounded-2xl overflow-hidden border shadow-sm min-h-100 md:min-h-full">
          <iframe
            src={`https://www.google.com/maps?q=${encodeURIComponent(ADDRESS)}&output=embed`}
            className="w-full h-full min-h-100"
            loading="lazy"
            title="Kaizen Cutz location"
          />
        </div>
      </section>
 
      <Footer />
    </div>
  )
}
 
export default Page
