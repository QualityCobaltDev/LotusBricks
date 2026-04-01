import type { Metadata } from "next";
import { db, isDatabaseConfigured } from "@/lib/db";
import { ContactForm } from "@/components/ui/contact-form";
import { logServerError } from "@/lib/observability";
import { getContactSettings } from "@/lib/site-settings";
import { CONTACT } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact RightBricks at contact@rightbricks.online or (+855) 011 389 625. WhatsApp and Telegram available.",
  alternates: { canonical: "/contact" }
};

type ContactPageProps = {
  searchParams: Promise<{ plan?: string; tierNeeds?: string }>;
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = await searchParams;
  const contact = await getContactSettings();
  let fallbackListing: { id: string } | null = null;

  if (isDatabaseConfigured()) {
    try {
      fallbackListing = await db.listing.findFirst({ where: { status: "PUBLISHED" }, select: { id: true } });
    } catch (error) {
      logServerError("contact-page", error);
    }
  }

  const isCustomPlan = params.plan === "custom" || params.tierNeeds === "10-plus";

  return (
    <section className="shell section">
      <div className="section-head narrow">
        <h1>Contact RightBricks Cambodia</h1>
        <p className="muted">{CONTACT.availabilityLine} {CONTACT.responseTime}</p>
      </div>

      <div className="two-col">
        <article className="card-pad">
          <h2>{isCustomPlan ? "Speak to sales" : "Talk to a specialist"}</h2>
          <p>Email: <a href={contact.emailHref}>{contact.email}</a></p>
          <p>Phone: <a href={contact.phoneHref}>{contact.phoneDisplay}</a></p>
          <p>
            <a className="btn btn-ghost" href={CONTACT.whatsappHref}>WhatsApp</a>{" "}
            <a className="btn btn-ghost" href={CONTACT.telegramHref}>Telegram</a>
          </p>
          <p className="muted">Available on WhatsApp and Telegram for faster responses.</p>
          {contact.supportHours && <p>Support hours: {contact.supportHours}</p>}
          {contact.supportAddress && <p>Office: {contact.supportAddress}</p>}
        </article>
        <article className="card-pad">
          <h2>{isCustomPlan ? "Request a Custom Tier" : "Send us a message"}</h2>
          <p className="muted">What happens next: we review your goals, confirm fit, and reply with next-step options.</p>
          <ContactForm
            listingId={fallbackListing?.id ?? ""}
            selectedPlan={(params.plan ?? "").toUpperCase()}
            inquiryType={isCustomPlan ? "CUSTOM_PLAN" : "CONTACT"}
          />
        </article>
      </div>
    </section>
  );
}
