import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getPricingPlans, upsertPricingSettings } from "@/lib/pricing-settings";
import { pricingSettingsSchema } from "@/lib/validators";
import { failResult, okResult } from "@/lib/mutation-result";
import { logServerError } from "@/lib/observability";

export async function GET() {
  return NextResponse.json(okResult(await getPricingPlans()));
}

export async function PUT(req: Request) {
  const session = await getSession();
  if (session?.role !== "ADMIN") return NextResponse.json(failResult("Forbidden"), { status: 403 });

  const parsed = pricingSettingsSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json(failResult("Invalid payload", { fieldErrors: parsed.error.flatten().fieldErrors }), { status: 400 });

  try {
    const value = await upsertPricingSettings(parsed.data as any);
    return NextResponse.json(okResult(value, "Pricing settings updated."));
  } catch (error) {
    logServerError("pricing-put", error);
    return NextResponse.json(failResult("Unable to update pricing settings."), { status: 500 });
  }
}
