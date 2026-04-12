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
            <main className="w-full">
                {/* Hero Image */}
                <div className="relative w-full max-w-[552px] p-4 py-8 sm:py-16 sm:mx-auto md:ml-24 md:mt-8">
                    <Image
                        src={barberData.heroImage}
                        alt={`${barberData.name}'s hero image`}
                        width={552}
                        height={607}
                        priority
                        className="object-cover rounded-lg"
                    />
                </div>
            </main>
            <Footer />
        </>
    );
}