import { z } from "zod";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { failResult, okResult } from "@/lib/mutation-result";
import { getSmtpSettings, upsertSmtpSettings } from "@/lib/smtp-settings";
import { logServerError } from "@/lib/observability";

const smtpSettingsSchema = z.object({
  host: z.string().min(1),
  port: z.coerce.number().int().positive(),
  user: z.string().min(1),
  pass: z.string().min(1),
  from: z.string().min(1)
});

export async function GET() {
  const session = await getSession();
  if (session?.role !== "ADMIN") return NextResponse.json(failResult("Forbidden"), { status: 403 });

  const settings = await getSmtpSettings();
  return NextResponse.json(okResult(settings ?? {}));
}

export async function PUT(req: Request) {
  const session = await getSession();
  if (session?.role !== "ADMIN") return NextResponse.json(failResult("Forbidden"), { status: 403 });

  const parsed = smtpSettingsSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(failResult("Invalid payload", { fieldErrors: parsed.error.flatten().fieldErrors }), { status: 400 });
  }

  try {
    const settings = await upsertSmtpSettings(parsed.data);
    return NextResponse.json(okResult(settings, "SMTP settings saved."));
  } catch (error) {
    logServerError("admin-smtp-settings-put", error);
    return NextResponse.json(failResult("Unable to save SMTP settings."), { status: 500 });
  }
}
