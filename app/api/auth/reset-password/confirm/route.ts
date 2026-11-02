import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { and, eq, gt, isNull } from "drizzle-orm";
import { hash } from "bcryptjs";
import { db } from "@/db/db";
import { usersTable, passwordResetTokens } from "@/db/schema";

const MIN_PASSWORD_LENGTH = 8;

// POST { token, password } -> sets the new password if the token is still good
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const token = typeof body?.token === "string" ? body.token : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!token) {
    return NextResponse.json({ error: "This reset link is invalid or has expired." }, { status: 400 });
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json(
      { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` },
      { status: 400 }
    );
  }

  try {
    const tokenHash = createHash("sha256").update(token).digest("hex");

    // marks the token used in the same query so a link can't be used twice
    const [row] = await db
      .update(passwordResetTokens)
      .set({ usedAt: new Date() })
      .where(
        and(
          eq(passwordResetTokens.tokenHash, tokenHash),
          isNull(passwordResetTokens.usedAt),
          gt(passwordResetTokens.expiresAt, new Date())
        )
      )
      .returning({ userId: passwordResetTokens.userId });

    if (!row) {
      return NextResponse.json({ error: "This reset link is invalid or has expired." }, { status: 400 });
    }

    await db
      .update(usersTable)
      .set({ password: await hash(password, 10) })
      .where(eq(usersTable.id, row.userId));

    await db.delete(passwordResetTokens).where(eq(passwordResetTokens.userId, row.userId));

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Password reset failed", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
