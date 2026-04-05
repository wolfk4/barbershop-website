import Image from "next/image";

export default function HomePage() {
  const shopConfig = {
    address: "5411 San Juan Ave, Citrus Heights, CA 95610",
    phone: " (916) 844-7020",
  };

  return (
    <div>
      {/* Hero Image Section */}
      <div className="relative mx-auto" style={{ paddingTop: "40.00%" }}>
        <Image
          src="/hero.webp"
          alt="Kaizen Cuts barbershop storefront"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </div>

      {/* Red Rectangle Section */}
      <div
        className="w-full flex items-center justify-center"
        style={{
          backgroundColor: "#FF3B30", // Vibrant red color
          height: "80px", 
        }}
      >
        <p className="text-white text-lg sm:text-2xl md:text-3xl font-black font-inter text-center px-4">
        {shopConfig.address} <span className="mx-2">•</span>
          <a href={`tel:${shopConfig.phone}`} className="hover:underline">
            {shopConfig.phone}
          </a>
          </p>
      </div>
    </div>
  );
}