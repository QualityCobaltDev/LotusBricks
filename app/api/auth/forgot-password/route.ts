import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { forgotSchema } from "@/lib/auth-validation";

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = forgotSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: "Invalid email" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (user) {
    const token = crypto.randomBytes(24).toString("hex");
    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(token),
        expiresAt: new Date(Date.now() + 1000 * 60 * 30)
      }
    });
    return NextResponse.json({ ok: true, message: "Reset link generated.", resetToken: token });
  }

  return NextResponse.json({ ok: true, message: "If that account exists, a reset link has been sent." });
}
