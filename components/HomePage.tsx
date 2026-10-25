import Image from "next/image";
import { TypingAnimation } from "./ui/typing-animation";

export default function HomePage() {
  const shopConfig = {
    address: "5411 San Juan Ave, Citrus Heights, CA 95610",
    phone: "(916) 844-7020",
    phoneHref: "+19168447020",
  };

  return (
    <main className="w-full">
      {/* Hero Image */}
      <div className="relative mx-auto h-[800px] w-full">
        <Image
          src="/hero.webp"
          alt="Kaizen Cuts barbershop storefront"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Contact Information */}
      <div className="flex min-h-[80px] w-full flex-col items-center justify-center gap-2 bg-black px-4 py-4 text-center font-inter text-lg font-black text-white sm:flex-row sm:text-xl">
        <a
          href={`tel:${shopConfig.phoneHref}`}
          className="shrink-0 hover:underline"
        >
          {shopConfig.phone}
        </a>

        <span aria-hidden="true" className="hidden sm:inline">
          •
        </span>

        <TypingAnimation
          words={[shopConfig.address]}
          typeSpeed={50}
          pauseDelay={2000}
          className="text-lg font-black sm:text-xl"
        />
      </div>
    </main>
  );
}