import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({ email: z.string().email() });

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, message: "Invalid email" }, { status: 400 });
  return NextResponse.json({ ok: true, message: "If your account exists, a reset link has been sent." });
}
