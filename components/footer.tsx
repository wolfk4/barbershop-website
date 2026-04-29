import React from 'react';
import Image from 'next/image';
import { FaFacebook, FaInstagram } from "react-icons/fa";

function Footer(): React.JSX.Element {
  return (
    <footer className="w-full bg-white border-t border-gray-200 py-4 px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start gap-10">

        <div className="flex flex-col items-start gap-4">
          <Image
            src="/KClogo_black.png"
            alt="Kaizen Cutz"
            width={140}
            height={140}
            className="object-contain object-left -ml-4"
          />
          <div className="flex gap-5">
            <a href="https://www.facebook.com/kaizencutz23" target="_blank" rel="noopener noreferrer" className="text-black hover:opacity-60 transition">
              <FaFacebook size={28} />
            </a>
            <a href="https://www.instagram.com/kaizencutz23" target="_blank" rel="noopener noreferrer" className="text-black hover:opacity-60 transition">
              <FaInstagram size={28} />
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <p className="font-black uppercase tracking-widest text-sm text-black mb-1">Business Information</p>
            <p className="text-black text-sm">5411 San Juan Ave, Citrus Heights, CA 95610</p>
            <p className="text-black text-sm">(916) 844-7020</p>
          </div>
          <a href="/contact" className="font-black uppercase tracking-widest text-sm text-black hover:opacity-60 transition">Contact</a>
          <a href="/gallery" className="font-black uppercase tracking-widest text-sm text-black hover:opacity-60 transition">Gallery</a>
          <a href="/team" className="font-black uppercase tracking-widest text-sm text-black hover:opacity-60 transition">Meet Our Team</a>
        </div>

      </div>
    </footer>
  );
}

export default Footer;