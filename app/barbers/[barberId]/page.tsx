import Image from "next/image";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { BookNowButton } from "@/components/ui/BookNowButton"; 

export default async function BarberPage({ params }: { params: {barberId: string } }){
    const { barberId } = await params;

    const res = await fetch(`http://localhost:3000/api/barbers/${barberId}`, {
        cache: "no-store",
    });

    if (!res.ok){
        // Handle error for barber not found
        return (
            <>
                <Header />
                <main className="w-full flex text-center py-16">
                    <h1 className="text-2xl font-bold">Barber not found</h1>
                </main>
                <Footer />
            </>
        )
    }
    
    const barberData = await res.json();

    return (
        <>
            <Header />
            <main className="w-full flex flex-col sm:flex-row items-start p-4 sm:py-16">                {/* Hero Image and Text */}
                <div className="flex flex-col items-center w-full max-w-[552px] pl-16">
                    {/* Hero Image */}
                    <div className="relative w-full">
                        <Image
                            src={barberData.heroImage}
                            alt={`${barberData.name}'s hero image`}
                            width={488}
                            height={567.46}
                            priority
                            className="object-cover rounded-lg"
                        />
                    </div>

                    {/* Barber Name and Bio */}
                    <div className="text-center mt-8">
                        <h1 className="text-5xl font-bold mb-4">{barberData.name}</h1>
                        {barberData.bio.split("\n").map((line: string, index: number) => (
                            <p key={index} className="text-2xl text-gray-700 font-bold leading-snug">
                                {line}
                            </p>
                        ))}

                         {/* Book Now Button */}
                        <div className="mt-6">
                            <BookNowButton booksyUrl={barberData.booksyUrl} />
                        </div>
                    </div>
                </div>
                    
                {/* Right Section: Portfolio Grid */}
                <div className="grid grid-cols-3 gap-4 w-full sm:w-1/2 sm:ml-24">
                    {barberData.portfolio.map((image: string, index: number) => (
                        <div
                            key={index}
                            className="relative w-full h-[275.73px]" // Custom height for each grid item
                        >
                            <Image
                                src={image}
                                alt={`cut${index + 1}`}
                                layout="fill"
                                objectFit="cover"
                                className="rounded-lg"
                            />
                        </div>
                    ))}
                </div>

            </main>
            <Footer />
        </>
    );
}