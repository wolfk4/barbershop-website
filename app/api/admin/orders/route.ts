import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { orderItems, orders } from "@/db/schema";
import { desc, inArray } from "drizzle-orm";
 
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "admin") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }
 
    const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
 
    if (allOrders.length === 0) {
      return Response.json([]);
    }
 
    const items = await db
      .select({
        orderId: orderItems.orderId,
        title: orderItems.title,
        size: orderItems.size,
        quantity: orderItems.quantity,
      })
      .from(orderItems)
      .where(inArray(orderItems.orderId, allOrders.map((o) => o.id)));
 
    const result = allOrders.map((order) => ({
      id: order.id,
      customerName: order.customerName,
      total: order.total,
      // older orders were saved as "placed", which means the same thing as pending
      status: order.status === "placed" ? "pending" : order.status,
      createdAt: order.createdAt,
      items: items
        .filter((item) => item.orderId === order.id)
        .map(({ title, size, quantity }) => ({ title, size, quantity })),
    }));
 
    return Response.json(result);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return Response.json({ error: "Failed to fetch orders." }, { status: 500 });
  }
}