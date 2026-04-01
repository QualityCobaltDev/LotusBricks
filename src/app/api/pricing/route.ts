import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getPricingPlans, upsertPricingSettings } from "@/lib/pricing-settings";
import { pricingSettingsSchema } from "@/lib/validators";

export async function GET() {
  return NextResponse.json(await getPricingPlans());
}

export async function PUT(req: Request) {
  const session = await getSession();
  if (session?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const parsed = pricingSettingsSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });

  await upsertPricingSettings(parsed.data as any);
  return NextResponse.json({ ok: true });
}
