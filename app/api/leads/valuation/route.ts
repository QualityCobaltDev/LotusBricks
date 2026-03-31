import { NextResponse } from "next/server";
import { genericConfirmationTemplate } from "@/lib/email/templates";
import { sendEmail } from "@/lib/email/service";
import { valuationSchema } from "@/lib/lead-validation";
import { OFFICIAL_CONTACT } from "@/lib/contact";
import { createId, leads } from "@/lib/server-store";

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = valuationSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid valuation payload", issues: parsed.error.flatten() }, { status: 400 });
  }

  leads.unshift({
    id: createId("lead"),
    type: "valuation",
    sourcePage: "/request-valuation",
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    message: `${parsed.data.city} | ${parsed.data.propertyType} | ${parsed.data.details}`,
    status: "new",
    createdAt: new Date().toISOString()
  });

  await sendEmail({
    to: OFFICIAL_CONTACT.email,
    subject: `New valuation request - ${parsed.data.city}`,
    html: genericConfirmationTemplate({ name: "Admin", title: "New valuation request", summary: `${parsed.data.name} submitted a valuation request for ${parsed.data.propertyType} in ${parsed.data.city}.` }),
    type: "valuation_admin"
  });

  await sendEmail({
    to: parsed.data.email,
    subject: "We received your valuation request",
    html: genericConfirmationTemplate({ name: parsed.data.name, title: "Valuation request confirmed", summary: "Thank you for sharing your property details. We will review market comparables and contact you with pricing guidance." }),
    type: "valuation_user"
  });

  return NextResponse.json({ ok: true, message: "We’ve received your enquiry. Our team will contact you shortly via phone or email." });
}
