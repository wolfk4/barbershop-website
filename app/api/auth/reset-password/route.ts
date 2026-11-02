import { NextResponse } from "next/server";
import { randomBytes, createHash } from "crypto";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db/db";
import { usersTable, passwordResetTokens } from "@/db/schema";
import { sendPasswordResetEmail } from "@/lib/email";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ONE_HOUR = 60 * 60 * 1000;

// POST { email } -> sends a reset link if the email belongs to a user
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";

  if (!email || email.length > 255 || !EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  try {
    const [user] = await db
      .select({ id: usersTable.id, name: usersTable.name, email: usersTable.email })
      .from(usersTable)
      .where(sql`lower(${usersTable.email}) = lower(${email})`)
      .limit(1);

    if (user) {
      // only the hash goes in the db, the raw token only goes in the email
      const token = randomBytes(32).toString("hex");
      const tokenHash = createHash("sha256").update(token).digest("hex");

      // old links stop working when a new one is requested
      await db.delete(passwordResetTokens).where(eq(passwordResetTokens.userId, user.id));
      await db.insert(passwordResetTokens).values({
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + ONE_HOUR),
      });

      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(req.url).origin;
      const link = `${baseUrl}/reset-password/new?token=${token}`;

      // if the email fails we just log it, otherwise the response would show the account exists
      try {
        await sendPasswordResetEmail(user.email, user.name, link);
      } catch (err) {
        console.error("Failed to send reset email", err);
      }
    }

    // same response either way so nobody can tell if an email is registered
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Password reset request failed", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
