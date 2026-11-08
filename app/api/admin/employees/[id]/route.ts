import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { usersTable } from "@/db/schema";
import { isValidEmployeeEmail, parseEmployeeId } from "@/lib/employee-validation";
import { hash } from "bcryptjs";
import { and, eq } from "drizzle-orm";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "admin") return Response.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const employeeId = parseEmployeeId(id);
  if (employeeId === null) return Response.json({ error: "Employee not found" }, { status: 404 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!body || typeof body !== "object" || !("email" in body)
    || typeof body.email !== "string"
    || ("password" in body && typeof body.password !== "string")) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const email = body.email.trim();
  if (!isValidEmployeeEmail(email)) return Response.json({ error: "Invalid email" }, { status: 400 });
  const password = "password" in body && typeof body.password === "string" ? body.password : "";

  try {
    const updates = {
      email,
      ...(password ? { password: await hash(password, 10) } : {}),
    };
    const [employee] = await db
      .update(usersTable)
      .set(updates)
      .where(and(eq(usersTable.id, employeeId), eq(usersTable.role, "employee")))
      .returning({ id: usersTable.id, email: usersTable.email });

    if (!employee) return Response.json({ error: "Employee not found" }, { status: 404 });
    return Response.json({ employee });
  } catch (error) {
    console.error("Failed to update employee", error);
    return Response.json({ error: "Update failed" }, { status: 500 });
  }
}
