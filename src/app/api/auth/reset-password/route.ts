import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { passwordResetConfirmSchema } from "@/lib/validators";
import { hashResetToken } from "@/lib/password-reset";
import { logServerError } from "@/lib/observability";

export async function POST(req: Request) {
  try {
    const parsed = passwordResetConfirmSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid reset payload." }, { status: 400 });

    const tokenHash = hashResetToken(parsed.data.token);
    const token = await db.passwordResetToken.findUnique({ where: { tokenHash }, include: { user: true } });

    if (!token || token.usedAt || token.expiresAt < new Date()) {
      return NextResponse.json({ error: "Reset link is invalid or expired." }, { status: 400 });
    }

    await db.$transaction([
      db.user.update({ where: { id: token.userId }, data: { passwordHash: hashPassword(parsed.data.password) } }),
      db.passwordResetToken.update({ where: { id: token.id }, data: { usedAt: new Date() } })
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    logServerError("api-reset-password", error);
    return NextResponse.json({ error: "Unable to reset password right now." }, { status: 500 });
  }
}
