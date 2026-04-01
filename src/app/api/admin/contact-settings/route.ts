import { CONTACT } from "@/lib/contact";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { contactSettingsSchema } from "@/lib/validators";
import { getContactSettings, upsertContactSettings } from "@/lib/site-settings";

export async function GET() {
  const session = await getSession();
  if (session?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const settings = await getContactSettings();
  return NextResponse.json(settings);
}

export async function PUT(req: Request) {
  const session = await getSession();
  if (session?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const parsed = contactSettingsSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });

  await upsertContactSettings({ ...parsed.data, email: CONTACT.email, emailHref: CONTACT.emailHref, phoneDisplay: CONTACT.phoneDisplay, phoneHref: CONTACT.phoneHref, whatsappHref: CONTACT.whatsappHref, telegramHref: CONTACT.telegramHref });
  return NextResponse.json({ ok: true });
}
