import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/auth-validation";
import { checkRateLimit } from "@/lib/rate-limit";
import { setSession, verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  if (!checkRateLimit(`login:${ip}`, 30, 15 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  const payload = await request.json();
  const parsed = loginSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: "Invalid credentials format." }, { status: 400 });

  const identifier = parsed.data.identifier.toLowerCase();
  const user = await prisma.user.findFirst({ where: { OR: [{ email: identifier }, { username: parsed.data.identifier }] } });
  if (!user || !user.isActive || !verifyPassword(parsed.data.password, user.passwordHash)) {
    return NextResponse.json({ error: "Invalid username/email or password." }, { status: 401 });
  }

  await setSession(user.id, user.role);
  return NextResponse.json({ ok: true, role: user.role });
}
