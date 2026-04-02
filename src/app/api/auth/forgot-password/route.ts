import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { passwordResetRequestSchema } from "@/lib/validators";
import { createResetToken } from "@/lib/password-reset";
import { sendTransactionalEmail } from "@/lib/email";
import { getSafeSiteUrl } from "@/lib/env";
import { logServerError } from "@/lib/observability";

export async function POST(req: Request) {
  try {
    const parsed = passwordResetRequestSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ ok: true, message: "If an account exists, a reset link has been sent." });
    }

    const user = await db.user.findUnique({ where: { email: parsed.data.email } });
    if (!user) {
      return NextResponse.json({ ok: true, message: "If an account exists, a reset link has been sent." });
    }

    await db.passwordResetToken.deleteMany({ where: { userId: user.id, usedAt: null } });
    const { rawToken, tokenHash } = createResetToken();
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    await db.passwordResetToken.create({ data: { userId: user.id, tokenHash, expiresAt } });
    const resetLink = `${getSafeSiteUrl()}/support/reset-password?token=${rawToken}`;

    await sendTransactionalEmail({
      type: "PASSWORD_RESET",
      to: user.email,
      subject: "Reset your RightBricks password",
      template: {
        heading: "Password reset request",
        intro: "Use the secure link below to reset your password. This link expires in 30 minutes.",
        ctaLabel: "Reset password",
        ctaHref: resetLink,
        closing: "If you did not request this, you can safely ignore this email."
      },
      metadata: { userId: user.id }
    });

    return NextResponse.json({ ok: true, message: "If an account exists, a reset link has been sent." });
  } catch (error) {
    logServerError("api-forgot-password", error);
    return NextResponse.json({ ok: true, message: "If an account exists, a reset link has been sent." });
  }
}
