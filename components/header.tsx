import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Menu } from "lucide-react";

function Header() {
  return (
    <header className="w-full h-16 bg-black text-white flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <Image src="/KClogo.png" alt="logo" width={50} height={50} />
      </div>

      <h1 className="text-2xl font-extrabold tracking-widest uppercase"> Kaizen Cutz </h1>

      <div className="flex items-center gap-3 w-32 justify-end">
        <Link href="/cart">
          <ShoppingCart className="h-6 w-6" />
        </Link>
        <button>
          <Menu className="h-6 w-6" />
        </button>
        <Link href="/book" 
          className="bg-white text-black px-3 py-1 text-xs font-bold uppercase tracking-wide rounded-md shadow-md"> 
          Book Now 
        </Link>
      </div>
    </header>
  );
}

export default Header;