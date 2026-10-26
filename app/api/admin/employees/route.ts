import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { usersTable } from "@/db/schema";
import { sqlInjectCheck } from "@/lib/sql-inject-check";
import { asc, eq, sql } from "drizzle-orm";
import { hash } from "bcryptjs";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "admin") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json().catch(() => null);
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!name || name.length > 255 || !email || email.length > 255 || !password) {
      return Response.json({ error: "Name, email, and password are required" }, { status: 400 });
    }
    if (!sqlInjectCheck(email) || !EMAIL_PATTERN.test(email)) {
      return Response.json({ error: "Invalid email" }, { status: 400 });
    }

    const passwordHash = await hash(password, 10);

    // One statement, so the user and barber rows are created together or not at all.
    const result = await db.execute(sql`
      WITH new_user AS (
        INSERT INTO users (name, email, role, password)
        VALUES (${name}, ${email}, 'employee', ${passwordHash})
        RETURNING id, name, email
      ), new_barber AS (
        INSERT INTO barbers (name, user_id)
        SELECT name, id FROM new_user
      )
      SELECT id, name, email FROM new_user
    `);

    return Response.json({ employee: result.rows[0] }, { status: 201 });
  } catch (error) {
    // 23505 = unique_violation (email already exists)
    if ((error as { code?: string })?.code === "23505") {
      return Response.json({ error: "Email already in use" }, { status: 409 });
    }
    console.error("Failed to create employee", error);
    return Response.json({ error: "Failed to create employee" }, { status: 500 });
  }
}
