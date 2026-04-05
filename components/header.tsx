
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

function Header() {
  return (
    <header className="w-full h-16 bg-gray-800 text-white flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <Image src="/file.svg" alt="logo" width={40} height={40} />
        <span className="text-xl font-bold">Kaizen Cutz</span>
      </div>
      <Link href="/cart">
        <ShoppingCart className="h-6 w-6" />
      </Link>
    </header>
  );
}

export default Header;