"use client"
 
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Menu, X } from "lucide-react"
import { useEffect, useState } from "react"
 
const navLinks = [
  { label: "Meet the Team", href: "/meet-the-team" },
  { label: "Shop", href: "/shop" },
  { label: "About Us", href: "/about-us" },
  { label: "Contact", href: "/contact" },
]
 
function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [count, setCount] = useState(0)
 
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await fetch("/api/shop/cart")
        if (!response.ok) throw new Error("Failed to fetch cart")
        const products = await response.json()
        setCount(products.length)
      } catch (error) {
        console.error(error)
      }
    }
    fetchCount()
  }, [])
 
  const closeMenu = () => setIsMenuOpen(false)
 
  return (
    <header className="sticky top-0 z-50 w-full bg-black text-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 py-3">
        {/* logo + name */}
        <Link href="/" onClick={closeMenu} className="flex items-center gap-3">
          <Image src="/KClogo.png" alt="Kaizen Cutz logo" width={64} height={64} />
          <span className="text-lg md:text-xl font-extrabold tracking-widest uppercase">
            Kaizen Cutz
          </span>
        </Link>
 
        {/* desktop links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm uppercase tracking-wider text-gray-300 hover:text-white transition"
            >
              {link.label}
            </Link>
          ))}
        </nav>
 
        {/* right side */}
        <div className="flex items-center gap-5">
          <Link href="/shop/cart" className="relative inline-flex" aria-label="Cart">
            <ShoppingCart className="h-6 w-6" />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-xs text-black">
                {count}
              </span>
            )}
          </Link>
 
          <Link
            href="/scheduling"
            className="hidden sm:inline-block bg-white text-black px-5 py-2 text-sm font-bold uppercase tracking-wide rounded-full hover:bg-gray-200 transition"
          >
            Book Now
          </Link>
 
          {/* hamburger, phones only */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>
      </div>
 
      {/* mobile menu */}
      {isMenuOpen && (
        <nav className="md:hidden border-t border-gray-800 bg-black px-6 py-4 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className="block text-base uppercase tracking-wider text-gray-300 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/scheduling"
            onClick={closeMenu}
            className="block text-center bg-white text-black py-3 font-bold uppercase tracking-wide rounded-full"
          >
            Book Now
          </Link>
        </nav>
      )}
    </header>
  )
}
 
export default Header
 
