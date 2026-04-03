import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { inquirySchema } from "@/lib/validators";
import { sendTransactionalEmail } from "@/lib/email";
import { getContactSettings } from "@/lib/site-settings";
import { getSafeSiteUrl } from "@/lib/env";

export async function POST(req: Request) {
  const parsed = inquirySchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
  const session = await getSession();
  const payload = parsed.data;

  if (payload.honeypot) {
    return NextResponse.json({ ok: true }, { status: 202 });
  }

  const duplicateWindowStart = new Date(Date.now() - 1000 * 60 * 5);
  const possibleDuplicate = await db.inquiry.findFirst({
    where: {
      email: payload.email,
      listingId: payload.listingId || null,
      inquiryType: payload.inquiryType,
      message: payload.message,
      createdAt: { gte: duplicateWindowStart }
    },
    orderBy: { createdAt: "desc" }
  });
  if (possibleDuplicate) {
    return NextResponse.json({ id: possibleDuplicate.id, status: possibleDuplicate.status, duplicate: true }, { status: 200 });
  }

  const inquiry = await db.inquiry.create({
    data: {
      listingId: payload.listingId || null,
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone || null,
      companyName: payload.companyName || null,
      requestedListings: payload.requestedListings ?? null,
      inquiryType: payload.inquiryType,
      selectedPlan: payload.selectedPlan || null,
      sourcePage: payload.sourcePage || null,
      isUrgent: payload.inquiryType === "VALUATION" || payload.inquiryType === "LISTING_SUBMISSION",
      message: payload.message,
      userId: session?.userId || null
    },
    include: { listing: { select: { title: true, slug: true, city: true, district: true } } }
  });

  const contact = await getContactSettings();
  const listingLabel = inquiry.listing ? `${inquiry.listing.title} (${inquiry.listing.district}, ${inquiry.listing.city})` : "General enquiry";
  const listingUrl = inquiry.listing ? `${getSafeSiteUrl()}/listings/${inquiry.listing.slug}` : `${getSafeSiteUrl()}/contact`;

  await Promise.all([
    sendTransactionalEmail({
      type: `${payload.inquiryType}_ADMIN`,
      to: contact.email,
      subject: `New ${payload.inquiryType.toLowerCase().replace("_", " ")} lead from ${payload.fullName}`,
      metadata: { inquiryId: inquiry.id },
      template: {
        heading: "New lead received",
        intro: "A new lead has been submitted on RightBricks and is ready for follow-up.",
        rows: [
          { label: "Lead type", value: payload.inquiryType },
          { label: "Name", value: payload.fullName },
          { label: "Email", value: payload.email },
          { label: "Phone", value: payload.phone || "Not provided" },
          { label: "Property", value: listingLabel },
          { label: "Message", value: payload.message },
          { label: "Submitted", value: new Date(inquiry.createdAt).toLocaleString("en-US", { timeZone: "UTC", timeZoneName: "short" }) }
        ],
        ctaLabel: "Open admin leads",
        ctaHref: `${getSafeSiteUrl()}/admin/inquiries`
      }
    }),
    sendTransactionalEmail({
      type: `${payload.inquiryType}_USER_CONFIRMATION`,
      to: payload.email,
      subject: "We received your RightBricks enquiry",
      metadata: { inquiryId: inquiry.id },
      template: {
        heading: "Thanks, we received your enquiry",
        intro: "Our team will contact you shortly via phone or email.",
        rows: [
          { label: "Reference", value: inquiry.id },
          { label: "Property", value: listingLabel },
          { label: "Your message", value: payload.message }
        ],
        ctaLabel: "View listing",
        ctaHref: listingUrl,
        closing: `For urgent assistance, contact us at ${contact.phoneDisplay} or ${contact.email}.`
      }
    })
  ]);

  return NextResponse.json({ id: inquiry.id, status: inquiry.status }, { status: 201 });
}

export async function GET() {
  const session = await getSession();
  if (session?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const items = await db.inquiry.findMany({ orderBy: { createdAt: "desc" }, include: { listing: { select: { title: true, slug: true } } } });
  return NextResponse.json(items);
}
