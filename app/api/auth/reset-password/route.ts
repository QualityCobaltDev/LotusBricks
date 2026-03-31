import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resetSchema } from "@/lib/auth-validation";
import { hashPassword } from "@/lib/auth";

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = resetSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const row = await prisma.passwordReset.findUnique({ where: { tokenHash: hashToken(parsed.data.token) } });
  if (!row || row.usedAt || row.expiresAt < new Date()) return NextResponse.json({ error: "Reset token is invalid or expired." }, { status: 400 });

  await prisma.$transaction([
    prisma.user.update({ where: { id: row.userId }, data: { passwordHash: hashPassword(parsed.data.password) } }),
    prisma.passwordReset.update({ where: { id: row.id }, data: { usedAt: new Date() } })
  ]);

  return NextResponse.json({ ok: true });
}
