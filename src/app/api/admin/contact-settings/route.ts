import { CONTACT } from "@/lib/contact";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { contactSettingsSchema } from "@/lib/validators";
import { getContactSettings, upsertContactSettings } from "@/lib/site-settings";
import { logServerError } from "@/lib/observability";
import { failResult, okResult } from "@/lib/mutation-result";

export async function GET() {
  const session = await getSession();
  if (session?.role !== "ADMIN") return NextResponse.json(failResult("Forbidden"), { status: 403 });
  const settings = await getContactSettings();
  return NextResponse.json(okResult(settings));
}

export async function PUT(req: Request) {
  const session = await getSession();
  if (session?.role !== "ADMIN") return NextResponse.json(failResult("Forbidden"), { status: 403 });

  const parsed = contactSettingsSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(failResult("Invalid payload", { fieldErrors: parsed.error.flatten().fieldErrors }), { status: 400 });
  }

  try {
    const settings = await upsertContactSettings({
      ...parsed.data,
      email: CONTACT.email,
      emailHref: CONTACT.emailHref,
      phoneDisplay: CONTACT.phoneDisplay,
      phoneHref: CONTACT.phoneHref,
      whatsappHref: CONTACT.whatsappHref,
      telegramHref: CONTACT.telegramHref
    });

    return NextResponse.json(okResult(settings, "Contact settings updated."));
  } catch (error) {
    logServerError("admin-contact-settings-put", error);
    return NextResponse.json(failResult("Unable to update contact settings."), { status: 500 });
  }
}
