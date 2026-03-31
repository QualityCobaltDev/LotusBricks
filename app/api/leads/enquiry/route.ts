import { NextResponse } from "next/server";
import { enquiryAdminTemplate, enquiryUserTemplate } from "@/lib/email/templates";
import { sendEmail } from "@/lib/email/service";
import { enquirySchema } from "@/lib/lead-validation";
import { OFFICIAL_CONTACT } from "@/lib/contact";
import { createId, leads } from "@/lib/server-store";

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = enquirySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid enquiry payload", issues: parsed.error.flatten() }, { status: 400 });
  }

  const lead = {
    id: createId("lead"),
    type: "enquiry" as const,
    listingSlug: parsed.data.listingSlug,
    sourcePage: parsed.data.sourcePage || `/listings/${parsed.data.listingSlug}`,
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    message: parsed.data.message,
    status: "new" as const,
    createdAt: new Date().toISOString()
  };
  leads.unshift(lead);

  const timestamp = new Date().toLocaleString("en-US", { timeZone: "Asia/Phnom_Penh" });

  await sendEmail({
    to: OFFICIAL_CONTACT.email,
    subject: `New enquiry: ${parsed.data.listingTitle}`,
    html: enquiryAdminTemplate({ ...parsed.data, timestamp }),
    type: "new_property_enquiry_admin"
  });

  await sendEmail({
    to: parsed.data.email,
    subject: `We received your enquiry - ${parsed.data.listingTitle}`,
    html: enquiryUserTemplate({ name: parsed.data.name, listingTitle: parsed.data.listingTitle }),
    type: "new_property_enquiry_user"
  });

  return NextResponse.json({ ok: true, message: "We’ve received your enquiry. Our team will contact you shortly via phone or email." });
}
