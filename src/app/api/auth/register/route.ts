import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSession, hashPassword } from "@/lib/auth";
import { registerSchema } from "@/lib/validators";
import { STANDARD_PLAN_KEYS } from "@/lib/plans";

export async function POST(req: Request) {
  const parsed = registerSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const exists = await db.user.findUnique({ where: { email: parsed.data.email } });
  if (exists) return NextResponse.json({ error: "Email already used" }, { status: 409 });

  const planTier = STANDARD_PLAN_KEYS.has(parsed.data.selectedPlan as never) ? parsed.data.selectedPlan : "TIER_1";

  const user = await db.user.create({
    data: {
      email: parsed.data.email,
      fullName: parsed.data.fullName,
      passwordHash: hashPassword(parsed.data.password),
      role: "CUSTOMER",
      planTier: planTier as "TIER_1" | "TIER_2" | "TIER_3",
      signupFeePaid: false
    }
  });

  await createSession(user.id, "CUSTOMER");
  return NextResponse.json({ ok: true, redirectTo: "/account", requiresSignupFee: true, signupFeeUsd: 50 });
}
