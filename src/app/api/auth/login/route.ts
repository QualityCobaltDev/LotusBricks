import { logServerError } from "@/lib/observability";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSession, hashPassword, roleToAppRole, roleToRedirect } from "@/lib/auth";
import { loginSchema } from "@/lib/validators";
import { authError } from "@/lib/auth-contract";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(authError("VALIDATION_ERROR", "Please enter a valid email and password."), { status: 400 });
    }

    const user = await db.user.findUnique({ where: { email: parsed.data.email } });
    if (!user || user.passwordHash !== hashPassword(parsed.data.password)) {
      return NextResponse.json(authError("INVALID_CREDENTIALS", "Invalid email or password"), { status: 401 });
    }

    if (!user.isActive) {
      return NextResponse.json(authError("ACCOUNT_DISABLED", "Your account is disabled. Please contact support."), { status: 403 });
    }

    await createSession(user.id, user.role, Boolean(body.remember));

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.fullName,
        role: roleToAppRole(user.role)
      },
      redirectTo: roleToRedirect(user.role)
    });
  } catch (error) {
    logServerError("api-auth-login", error, { hasAuthSecret: Boolean(process.env.AUTH_SECRET) });
    return NextResponse.json(
      authError("AUTH_UNAVAILABLE", "Authentication service is temporarily unavailable. Please try again."),
      { status: 500 }
    );
  }
}
