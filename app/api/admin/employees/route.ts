import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { usersTable } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "admin") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    // Never select the password column.
    const employees = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
      })
      .from(usersTable)
      .where(eq(usersTable.role, "employee"))
      .orderBy(asc(usersTable.name));

    return Response.json({ employees });
  } catch (error) {
    console.error("Failed to load employees", error);
    return Response.json({ error: "Failed to load employees" }, { status: 500 });
  }
}
