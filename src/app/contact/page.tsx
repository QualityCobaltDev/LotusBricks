import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { db, isDatabaseConfigured } from "@/lib/db";
import { ContactForm } from "@/components/ui/contact-form";
import { logServerError } from "@/lib/observability";
import { getContactSettings } from "@/lib/site-settings";
import { CONTACT } from "@/lib/contact";
import { normalizeContactPlan } from "@/lib/routing";

export const metadata: Metadata = buildMetadata({
  title: "Contact RightBricks",
  description: "Contact RightBricks sales and support team via email, phone, WhatsApp, or Telegram.",
  path: "/contact"
});

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
        <h1>Contact RightBricks sales & advisory team</h1>
        <p className="muted">{CONTACT.availabilityLine} {CONTACT.responseTime} No obligation and direct support.</p>
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
          <p className="muted">We respond quickly and route you to the right specialist.</p>
          {contact.supportHours && <p>Support hours: {contact.supportHours}</p>}
          {contact.supportAddress && <p>Office: {contact.supportAddress}</p>}
        </article>
        <article className="card-pad">
          <h2>{isCustomPlan ? "Request a Custom Tier" : "Send us a message"}</h2>
          <p className="muted">What happens next: we review your goals, confirm fit, and share next-step options within a few hours.</p>
          <ContactForm
            listingId={fallbackListing?.id ?? ""}
            selectedPlan={normalizeContactPlan(params.plan ?? "")}
            inquiryType={isCustomPlan ? "CUSTOM_PLAN" : "CONTACT"}
          />
        </article>
      </div>
    </section>
  );
}
