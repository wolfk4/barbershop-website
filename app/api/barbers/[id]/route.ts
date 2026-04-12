import { NextResponse } from "next/server";

const mockBarbers = [
    {
        id: "p-da-barber",
        name: "P. Da Barber",
        heroImage: "/barber-hero.jpg",
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