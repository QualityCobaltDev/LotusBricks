import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, setSession } from "@/lib/auth";
import { registerSchema } from "@/lib/auth-validation";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  if (!checkRateLimit(`register:${ip}`, 20, 15 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
  }

  const payload = await request.json();
  const parsed = registerSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: "Invalid form data", issues: parsed.error.flatten() }, { status: 400 });

  const existing = await prisma.user.findFirst({ where: { OR: [{ email: parsed.data.email }, { username: parsed.data.username }] } });
  if (existing) return NextResponse.json({ error: "An account with this email or username already exists." }, { status: 409 });

  const user = await prisma.user.create({
    data: {
      email: parsed.data.email.toLowerCase(),
      username: parsed.data.username,
      passwordHash: hashPassword(parsed.data.password),
      role: "BUYER",
      profile: { create: { fullName: parsed.data.fullName } }
    }
  });

  await setSession(user.id, user.role);
  return NextResponse.json({ ok: true });
}
