import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
 
const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
 
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "admin") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }
 
    const { id } = await params;
    if (!uuidPattern.test(id)) {
      return Response.json({ error: "Order not found." }, { status: 404 });
    }
 
    const body = await request.json().catch(() => null);
    const status = typeof body?.status === "string" ? body.status : "";
    if (!STATUSES.includes(status)) {
      return Response.json({ error: "Invalid status." }, { status: 400 });
    }
 
    const [updated] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning({ id: orders.id, status: orders.status });
 
    if (!updated) {
      return Response.json({ error: "Order not found." }, { status: 404 });
    }
 
    return Response.json(updated);
  } catch (error) {
    console.error("Failed to update order status:", error);
    return Response.json({ error: "Update failed." }, { status: 500 });
  }
}
 
 