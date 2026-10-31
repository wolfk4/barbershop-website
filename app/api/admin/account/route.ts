import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { compare, hash } from "bcryptjs";
 
const BCRYPT_HASH_PATTERN = /^\$2[aby]\$\d{2}\$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 
// same check as auth.ts (handles old plain-text passwords too)
async function verifyPassword(input: string, stored: string) {
  if (BCRYPT_HASH_PATTERN.test(stored)) return compare(input, stored);
  return input === stored;
}
 
// only a logged-in admin gets their own id back
async function getAdminId() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "admin") return null;
  const id = Number(session.user.id);
  return Number.isInteger(id) ? id : null;
}
 
// GET: current email for the settings page
export async function GET() {
  const adminId = await getAdminId();
  if (!adminId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
 
  const [user] = await db
    .select({ email: usersTable.email })
    .from(usersTable)
    .where(eq(usersTable.id, adminId))
    .limit(1);
 
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ email: user.email });
}
 
// PUT: update email and/or password
export async function PUT(req: Request) {
  const adminId = await getAdminId();
  if (!adminId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
 
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
 
  const currentPassword = typeof body?.currentPassword === "string" ? body.currentPassword : "";
  const newEmail = typeof body?.email === "string" ? body.email.trim() : "";
  const newPassword = typeof body?.password === "string" ? body.password : "";
 
  if (!currentPassword) {
    return NextResponse.json({ error: "Current password required" }, { status: 400 });
  }
  // nothing to change
  if (!newEmail && !newPassword) {
    return NextResponse.json({ error: "No changes" }, { status: 400 });
  }
  if (newEmail && !EMAIL_PATTERN.test(newEmail)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
 
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, adminId))
    .limit(1);
 
  if (!user || !(await verifyPassword(currentPassword, user.password))) {
    return NextResponse.json({ error: "Wrong password" }, { status: 403 });
  }
 
  // empty fields stay the same
  const updates: { email?: string; password?: string } = {};
  if (newEmail) updates.email = newEmail;
  if (newPassword) updates.password = await hash(newPassword, 10);
 
  try {
    const [updated] = await db
      .update(usersTable)
      .set(updates)
      .where(eq(usersTable.id, adminId))
      .returning({ email: usersTable.email });
 
    return NextResponse.json({ email: updated.email });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
 