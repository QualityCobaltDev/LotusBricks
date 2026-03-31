import { NextResponse } from "next/server";
import { genericConfirmationTemplate } from "@/lib/email/templates";
import { sendEmail } from "@/lib/email/service";
import { contactSchema } from "@/lib/lead-validation";
import { OFFICIAL_CONTACT } from "@/lib/contact";
import { createId, leads } from "@/lib/server-store";

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid contact payload", issues: parsed.error.flatten() }, { status: 400 });
  }

  leads.unshift({
    id: createId("lead"),
    type: "contact",
    sourcePage: "/contact",
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    message: `${parsed.data.subject}: ${parsed.data.message}`,
    status: "new",
    createdAt: new Date().toISOString()
  });

  await sendEmail({
    to: OFFICIAL_CONTACT.email,
    subject: `New contact form: ${parsed.data.subject}`,
    html: genericConfirmationTemplate({ name: "Admin", title: "New contact form submission", summary: `${parsed.data.name} sent a ${parsed.data.subject} message.` }),
    type: "contact_admin"
  });

  await sendEmail({
    to: parsed.data.email,
    subject: "RightBricks support request received",
    html: genericConfirmationTemplate({ name: parsed.data.name, title: "Thanks for contacting RightBricks", summary: "Your request has reached our team. We will reply shortly." }),
    type: "contact_user"
  });

  return NextResponse.json({ ok: true, message: "We’ve received your enquiry. Our team will contact you shortly via phone or email." });
}
