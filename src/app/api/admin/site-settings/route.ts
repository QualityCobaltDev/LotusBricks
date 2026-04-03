import { z } from "zod";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { BRAND_SETTING_KEY } from "@/lib/constants";
import { logAuditEvent } from "@/lib/admin-control";
import { failResult, okResult, toUserFacingError } from "@/lib/mutation-result";
import { logServerError } from "@/lib/observability";
import { revalidatePublicContent } from "@/lib/admin-revalidate";
import { BRAND_SETTINGS_FALLBACK } from "@/lib/site-settings.defaults";
import { removeStoredAssetByUrl } from "@/lib/asset-storage";

const brandSettingsSchema = z.object({
  siteName: z.string().min(2),
  tagline: z.string().default(""),
  supportEmail: z.string().email(),
  displayPhone: z.string().min(3),
  phoneLink: z.string().min(3),
  whatsappLink: z.string().min(3),
  telegramLink: z.string().min(3),
  supportHours: z.string().default(""),
  address: z.string().default(""),
  maintenanceBanner: z.string().default(""),
  headerLogoUrl: z.string().default(""),
  faviconUrl: z.string().default(BRAND_SETTINGS_FALLBACK.faviconUrl),
  assetVersion: z.coerce.number().int().positive().default(1)
});

export async function GET() {
  const session = await getSession();
  if (session?.role !== "ADMIN") return NextResponse.json(failResult("Forbidden"), { status: 403 });
  const setting = await db.siteSetting.findUnique({ where: { key: BRAND_SETTING_KEY } });
  return NextResponse.json(okResult((setting?.value as Record<string, unknown>) ?? BRAND_SETTINGS_FALLBACK));
}

export async function PUT(req: Request) {
  const session = await getSession();
  if (session?.role !== "ADMIN") return NextResponse.json(failResult("Forbidden"), { status: 403 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(failResult("Invalid JSON payload", { fieldErrors: { body: ["Request body must be valid JSON."] } }), { status: 400 });
  }

  const parsed = brandSettingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(failResult("Invalid payload", { fieldErrors: parsed.error.flatten().fieldErrors }), { status: 400 });
  }

  try {
    const current = await db.siteSetting.findUnique({ where: { key: BRAND_SETTING_KEY } });
    const currentValue = (current?.value as Record<string, unknown> | undefined) ?? {};

    const row = await db.siteSetting.upsert({
      where: { key: BRAND_SETTING_KEY },
      create: { key: BRAND_SETTING_KEY, value: parsed.data as never },
      update: { value: parsed.data as never }
    });

    try {
      await logAuditEvent({
        at: new Date().toISOString(),
        actor: session.userId,
        action: "UPDATE",
        objectType: "SETTINGS",
        summary: "Updated site identity settings"
      });
    } catch (auditError) {
      logServerError("admin-site-settings-audit", auditError, { actor: session.userId });
    }

    const previousLogo = typeof currentValue.headerLogoUrl === "string" ? currentValue.headerLogoUrl : "";
    const previousFavicon = typeof currentValue.faviconUrl === "string" ? currentValue.faviconUrl : "";
    if (previousLogo && previousLogo !== parsed.data.headerLogoUrl) await removeStoredAssetByUrl(previousLogo);
    if (previousFavicon && previousFavicon !== parsed.data.faviconUrl) await removeStoredAssetByUrl(previousFavicon);

    revalidatePublicContent();
    return NextResponse.json(okResult(row, "Site identity saved."));
  } catch (error) {
    logServerError("admin-site-settings-put", error);
    const result = toUserFacingError(error, "Unable to save site identity settings.");
    return NextResponse.json(result, { status: 500 });
  }
}
