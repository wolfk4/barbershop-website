'use client'
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart} from "lucide-react";
import { useState } from "react";


function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="w-full bg-black text-white flex items-center justify-between px-4 py-6">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Image src="/KClogo.png" alt="logo" width={50} height={50} />
        </Link>
      </div>
      <Link href="/">
        <h1 className="text-2xl font-extrabold tracking-widest uppercase"> Kaizen Cutz </h1>
      </Link>
      <div className="flex items-center gap-3 w-32 justify-end">
        <Link href="/cart">
          <ShoppingCart className="h-6 w-6" />
        </Link>
            <div
              className="HAMBURGER-ICON space-y-2"
              onClick={toggleMenu}
            >
              <span className="block h-0.5 w-8 bg-white"></span>
              <span className="block h-0.5 w-8 bg-white"></span>
              <span className="block h-0.5 w-8 bg-white"></span>
            </div>
            {isMenuOpen && (
              <div className="absolute top-12 right-0 w-40 bg-white text-black rounded-md shadow-lg py-3 z-50">
                <div className="space-y-6 bg-white text-black p-8 rounded-lg">
                  <Link href="/contact" className="block hover:underline">
                    Contact
                  </Link>
                  <Link href="/about-us" className="block hover:underline">
                    About Us
                  </Link>
                  <Link href="/shop" className="block hover:underline">
                    Shop
                  </Link>
                </div>
              </div>
            )}
        <Link href="/book" 
          className="bg-white text-black px-3 py-1 text-xs font-bold uppercase tracking-wide rounded-md shadow-md"> 
          Book Now 
        </Link>
      </div>
    </header>
  );
}

export default Header;