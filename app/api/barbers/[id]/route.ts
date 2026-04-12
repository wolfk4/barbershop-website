import { NextResponse } from "next/server";

const mockBarbers = [
    {
        id: "p-da-barber",
        name: "P. Da Barber",
        bio: "P is a skilled barber who specializes in clean\nfades, classic cuts, and precise beard work.\nHe's detail-oriented, friendly, and focused on\nmaking every client look and feel their best.",
        heroImage: "/barber-hero.jpg",
        portfolio: [
            "/portfolio/cut1.jpeg",
            "/portfolio/cut2.jpeg",
            "/portfolio/cut3.jpeg",
            "/portfolio/cut4.jpeg",
            "/portfolio/cut5.jpeg",
            "/portfolio/cut6.jpeg",
        ],
        booksyUrl: "https://booksy.com/en-us/385969_p-da-barber_barber-shop_100342_citrus-heights#ba_s=seo",
    },
];

export async function GET(req: Request, context: { params: { id: string } }) {
    const { id } = await context.params; 

    const barber = mockBarbers.find((b) => b.id === id);

    if (!barber) {
        return NextResponse.json({ error: "Barber not found" }, { status: 404 });
    }

    return NextResponse.json(barber);
}