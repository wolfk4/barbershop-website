"use client"
 
import Link from "next/link"
import { useEffect, useState } from "react"
 
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
 
export default function ShopHours() {
  // set on the client so it uses the real current time
  const [today, setToday] = useState<number | null>(null)
  const [isOpen, setIsOpen] = useState(false)
 
  useEffect(() => {
    const now = new Date(
      new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })
    )
    const day = now.getDay()
    const hour = now.getHours() + now.getMinutes() / 60
    setToday(day)
    setIsOpen(hour >= hours[day].open && hour < hours[day].close)
  }, [])
 
  return (
    <section className="w-full bg-white px-6 py-20">
      <div className="mx-auto flex max-w-lg flex-col items-center text-center">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-gray-500">
          Visit Us
        </p>
        <h2 className="mb-4 text-4xl font-extrabold md:text-5xl">Shop Hours</h2>
 
        {today !== null && (
          <span
            className={`mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold ${
              isOpen ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${isOpen ? "bg-green-500" : "bg-gray-400"}`}
            />
            {isOpen
              ? `Open now · until ${formatHour(hours[today].close)}`
              : "Closed now"}
          </span>
        )}
 
        {/* hours list */}
        <ul className="mb-8 w-full rounded-2xl border border-gray-200 p-4 text-left shadow-sm">
          {hours.map((h, i) => {
            const isToday = i === today
            return (
              <li
                key={h.day}
                className={`flex justify-between rounded-lg px-4 py-3 ${
                  isToday ? "bg-black font-semibold text-white" : "text-gray-700"
                }`}
              >
                <span>{h.day}</span>
                <span>
                  {formatHour(h.open)} – {formatHour(h.close)}
                </span>
              </li>
            )
          })}
        </ul>
 
        <p className="mb-6 text-gray-600">
          Walk-ins welcome. Appointments recommended.
        </p>
        <Link
          href="/scheduling"
          className="inline-block rounded-full bg-black px-8 py-3 font-bold uppercase tracking-wide text-white transition hover:bg-gray-800"
        >
          Book Now
        </Link>
      </div>
    </section>
  )
}