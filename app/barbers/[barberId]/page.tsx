import Image from "next/image";
import Header from "@/components/header";
import Footer from "@/components/footer";

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
            <main className="w-full flex flex-col items-center p-4 sm:py-16">
                {/* Hero Image and Text */}
                <div className="flex flex-col items-center w-full max-w-[552px]">
                    {/* Hero Image */}
                    <div className="relative w-full">
                        <Image
                            src={barberData.heroImage}
                            alt={`${barberData.name}'s hero image`}
                            width={552}
                            height={607}
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
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}