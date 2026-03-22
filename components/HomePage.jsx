import Image from "next/image";

export default function HomePage() {
  return (
    <div>
      {/* Hero Image Section */}
      <div className="relative mx-auto" style={{ paddingTop: "40.00%" }}>
        <Image
          src="/hero.webp"
          alt="Kaizen Cuts barbershop storefront"
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>

      {/* Red Rectangle Section */}
      <div
        className="w-full"
        style={{
          backgroundColor: "#FF3B30", 
          height: "80px", 
        }}
      ></div>
    </div>
  );
}