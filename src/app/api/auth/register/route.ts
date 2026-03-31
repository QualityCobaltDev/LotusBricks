import { NextResponse } from "next/server";
import { z } from "zod";
import { setRoleCookie } from "@/lib/session/cookie";

const schema = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(8) });

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, message: "Invalid registration payload." }, { status: 400 });
  await setRoleCookie("customer");
  return NextResponse.json({ ok: true, role: "customer" });
}
