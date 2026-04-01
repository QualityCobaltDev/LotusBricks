import { logServerError } from "@/lib/observability";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSession, hashPassword, roleToAppRole, roleToRedirect } from "@/lib/auth";
import { registerSchema } from "@/lib/validators";
import { STANDARD_PLAN_KEYS } from "@/lib/plans";
import { authError } from "@/lib/auth-contract";

export async function POST(req: Request) {
  try {
    const parsed = registerSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(authError("VALIDATION_ERROR", "Please complete all required fields."), { status: 400 });
    }

    const exists = await db.user.findUnique({ where: { email: parsed.data.email } });
    if (exists) return NextResponse.json(authError("VALIDATION_ERROR", "Email already used"), { status: 409 });

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
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.fullName,
        role: roleToAppRole(user.role)
      },
      redirectTo: roleToRedirect(user.role),
      requiresSignupFee: true,
      signupFeeUsd: 50
    });
  } catch (error) {
    logServerError("api-auth-register", error);
    return NextResponse.json(authError("AUTH_UNAVAILABLE", "Registration is temporarily unavailable. Please try again."), { status: 500 });
  }
}
