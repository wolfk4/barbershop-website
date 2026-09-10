

import { db } from "@/db/drizzle";
import { shopItems } from "@/db/schema";
import { ShopItem } from "@/lib/types";


export async function GET() {
    try {
        const items = await db
            .select()
            .from(shopItems);

        return Response.json(items);
    } catch (error) {
        console.error("Failed to fetch shop items:", error);

        return new Response("Internal Server Error", {
            status: 500,
        });
    }
}

export async function POST(request: Request) {

    try {
        const body = await request.json()
        const { title, image, price, description, moreInfo } = body
        const [newItem] = await db.insert(shopItems).values({
            title: title,
            image: image,
            price: price,
            description: description,
            moreInfo: moreInfo,
        }).returning({
            id: shopItems.id,
        });

        return new Response(JSON.stringify(newItem), {
            status: 201,
        });
    }
    catch (error) {
        console.error("Failed to add shop item:", error);
    }
    return new Response("Internal Server Error", {
        status: 500,
    });
}
