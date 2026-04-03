import { z } from "zod";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { logAuditEvent } from "@/lib/admin-control";
import { failResult, okResult, toUserFacingError } from "@/lib/mutation-result";
import { logServerError } from "@/lib/observability";
import { revalidatePublicContent } from "@/lib/admin-revalidate";

const KEY = "admin.brand-settings.v1";

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
  maintenanceBanner: z.string().default("")
});

export async function GET() {
  const session = await getSession();
  if (session?.role !== "ADMIN") return NextResponse.json(failResult("Forbidden"), { status: 403 });
  const setting = await db.siteSetting.findUnique({ where: { key: KEY } });
  return NextResponse.json(okResult((setting?.value as Record<string, unknown>) ?? {}));
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
    const row = await db.siteSetting.upsert({
      where: { key: KEY },
      create: { key: KEY, value: parsed.data as never },
      update: { value: parsed.data as never }
    });

    try {
      await logAuditEvent({
        at: new Date().toISOString(),
        actor: session.userId,
        action: "UPDATE",
        objectType: "SETTINGS",
        summary: "Updated global brand settings"
      });
    } catch (auditError) {
      logServerError("admin-site-settings-audit", auditError, { actor: session.userId });
    }

    revalidatePublicContent();
    return NextResponse.json(okResult(row, "Global settings saved."));
  } catch (error) {
    logServerError("admin-site-settings-put", error);
    const result = toUserFacingError(error, "Unable to save global settings.");
    return NextResponse.json(result, { status: 500 });
  }
}
