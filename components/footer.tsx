import Image from "next/image"
import Link from "next/link"
import { FaFacebook, FaInstagram } from "react-icons/fa"
import { MapPin, Phone } from "lucide-react"
 
const ADDRESS = "5411 San Juan Ave, Citrus Heights, CA 95610"
const PHONE = "(916) 844-7020"
const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`
 
const links = [
  { label: "Book Now", href: "/scheduling" },
  { label: "Meet Our Team", href: "/meet-the-team" },
  { label: "Contact", href: "/contact" },
]
 
const headingClass = "font-black uppercase tracking-widest text-sm mb-4"
 
function Footer() {
  return (
    <footer className="w-full bg-black text-white">
      <div className="max-w-7xl mx-auto px-8 py-12 grid gap-10 sm:grid-cols-3 text-center sm:text-left">
        {/* logo + socials */}
        <div className="flex flex-col items-center gap-4 w-fit mx-auto sm:mx-0">
          <Image
            src="/KClogo_black.png"
            alt="Kaizen Cutz"
            width={140}
            height={140}
            className="object-contain invert"
          />
          <div className="flex gap-5">
            <a
              href="https://www.facebook.com/kaizencutz23"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:opacity-60 transition"
            >
              <FaFacebook size={26} />
            </a>
            <a
              href="https://www.instagram.com/kaizencutz23"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:opacity-60 transition"
            >
              <FaInstagram size={26} />
            </a>
          </div>
        </div>
 
        {/* quick links */}
        <div>
          <p className={headingClass}>Quick Links</p>
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm text-gray-300 hover:text-white transition"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
 
        {/* contact */}
        <div>
          <p className={headingClass}>Visit Us</p>
          <div className="space-y-3 text-sm text-gray-300">
            <a
              href={MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start justify-center sm:justify-start gap-2 hover:text-white transition"
            >
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
              {ADDRESS}
            </a>
            <a
              href={`tel:${PHONE.replace(/\D/g, "")}`}
              className="flex items-center justify-center sm:justify-start gap-2 hover:text-white transition"
            >
              <Phone className="w-4 h-4 shrink-0" />
              {PHONE}
            </a>
            <p className="italic text-gray-400">Walk-ins welcome</p>
          </div>
        </div>
      </div>
 
      {/* bottom line */}
      <div className="border-t border-gray-800 py-5 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Kaizen Cutz. All rights reserved.
      </div>
    </footer>
  )
}
 
export default Footer
 