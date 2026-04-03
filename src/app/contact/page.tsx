import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { db, isDatabaseConfigured } from "@/lib/db";
import { ContactForm } from "@/components/ui/contact-form";
import { logServerError } from "@/lib/observability";
import { getContactSettings } from "@/lib/site-settings";
import { CONTACT } from "@/lib/contact";
import { normalizeContactPlan, normalizeContactSource } from "@/lib/routing";

export const metadata: Metadata = buildMetadata({
  title: "Contact RightBricks",
  description: "Contact RightBricks sales and support team via email, phone, WhatsApp, or Telegram.",
  path: "/contact"
});

type ContactPageProps = {
  searchParams: Promise<{ plan?: string; tierNeeds?: string; source?: string; listing?: string }>;
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
  const selectedPlan = normalizeContactPlan(params.plan ?? "");
  const source = normalizeContactSource(params.source ?? "");
  const sourceCopy: Record<string, string> = {
    pricing: "You’re enquiring from pricing. We’ll confirm the best tier and send exact next steps.",
    homepage: "Thanks for reaching out from the homepage. We’ll guide you to the fastest path to launch.",
    listing: "You’re enquiring from a listing journey. We’ll route you to the right specialist.",
    support: "You’re contacting support. We’ll route your request to the correct team.",
    direct: "Share your goals and we’ll help you move forward quickly."
  };

  return (
    <section className="shell section">
      <div className="section-head narrow">
        <h1>Contact RightBricks sales & advisory team</h1>
        <p className="muted">{CONTACT.availabilityLine} {CONTACT.responseTime} No obligation and direct support.</p>
      </div>

      <div className="two-col">
        <article className="card-pad">
          <h2>{isCustomPlan ? "Speak to sales" : "Talk to a specialist"}</h2>
          <p>Email: <a href={contact.emailHref} data-track-event="email_click" data-track-label="contact-page-email">{contact.email}</a></p>
          <p>Phone: <a href={contact.phoneHref} data-track-event="call_click" data-track-label="contact-page-phone">{contact.phoneDisplay}</a></p>
          <p>
            <a className="btn btn-ghost" href={CONTACT.whatsappHref} data-track-event="whatsapp_click" data-track-label="contact-page-whatsapp">WhatsApp</a>{" "}
            <a className="btn btn-ghost" href={CONTACT.telegramHref} data-track-event="telegram_click" data-track-label="contact-page-telegram">Telegram</a>
          </p>
          <p className="muted">We respond quickly and route you to the right specialist.</p>
          {contact.supportHours && <p>Support hours: {contact.supportHours}</p>}
          {contact.supportAddress && <p>Office: {contact.supportAddress}</p>}
        </article>
        <article className="card-pad">
          <h2>{isCustomPlan ? "Request a Custom Tier" : "Send us a message"}</h2>
          <p className="muted">{sourceCopy[source]}</p>
          <ContactForm
            listingId={fallbackListing?.id ?? ""}
            selectedPlan={selectedPlan}
            source={source}
            inquiryType={isCustomPlan ? "CUSTOM_PLAN" : "CONTACT"}
          />
        </article>
      </div>
    </section>
  );
}
