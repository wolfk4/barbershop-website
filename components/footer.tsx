import React from 'react'
import { FaFacebook, FaInstagram } from "react-icons/fa";


function Footer(): React.JSX.Element {
  return (
    <div className='w-full h-12 bg-gray-800 fixed bottom-0 text-white flex items-center justify-center'>
        <h1>Basic Footer </h1>

      {/* Company Logo */}
      <img
        src="/KClogo.png"
        style={{ width: 80, display: "block" }}
      />

      {/* Social Icons */}
      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>

        <a
          href="https://www.facebook.com/kaizencutz23"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#ffffff" }}
        >
          <FaFacebook size={20} />
        </a>

        <a
          href="https://www.instagram.com/kaizencutz23"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#ffffff" }}
        >
          <FaInstagram size={20} />
        </a>

      </div>
     </div>

  )
}

export default Footer