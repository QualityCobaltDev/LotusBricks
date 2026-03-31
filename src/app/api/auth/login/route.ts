import { NextResponse } from "next/server";
import { z } from "zod";
import { setRoleCookie } from "@/lib/session/cookie";

const schema = z.object({ email: z.string().email(), password: z.string().min(8) });

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, message: "Invalid credentials." }, { status: 400 });

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const isAdmin = Boolean(adminEmail && adminPassword && parsed.data.email === adminEmail && parsed.data.password === adminPassword);

  const role: "admin" | "customer" = isAdmin ? "admin" : "customer";
  await setRoleCookie(role);
  return NextResponse.json({ ok: true, role });
}
