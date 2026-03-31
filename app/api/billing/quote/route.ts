import { NextResponse } from "next/server";
import { getCheckoutBreakdown, resolvePlan } from "@/lib/plans";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));
  const plan = resolvePlan(payload?.plan);
  const isNewSignup = Boolean(payload?.isNewSignup ?? true);

  if (plan.isContactOnly) {
    return NextResponse.json({
      ok: true,
      contactOnly: true,
      message: "Custom Tier is sales-assisted. Please contact RightBricks to discuss pricing."
    });
  }

  const breakdown = getCheckoutBreakdown(plan, isNewSignup);
  return NextResponse.json({ ok: true, plan: plan.key, breakdown });
}
