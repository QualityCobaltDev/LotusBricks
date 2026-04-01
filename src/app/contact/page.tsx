import { db } from "@/lib/db";
import { ContactForm } from "@/components/ui/contact-form";
import { logServerError } from "@/lib/observability";
import { getContactSettings } from "@/lib/site-settings";

type ContactPageProps = {
  searchParams: Promise<{ plan?: string; tierNeeds?: string }>;
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = await searchParams;
  const contact = await getContactSettings();
  let fallbackListing: { id: string } | null = null;

  try {
    fallbackListing = await db.listing.findFirst({ where: { status: "PUBLISHED" }, select: { id: true } });
  } catch (error) {
    logServerError("contact-page", error);
  }

  const isCustomPlan = params.plan === "custom" || params.tierNeeds === "10-plus";

  return (
    <section className="shell section">
      <div className="section-head narrow">
        <h1>Contact RightBricks Cambodia</h1>
        <p className="muted">Need more than 10 listings? Contact us for a tailored Custom Tier. Standard tiers include up to 10 photos and 2 videos per listing.</p>
      </div>

      <div className="two-col">
        <article className="card-pad">
          <h2>{isCustomPlan ? "Speak to sales" : "Talk to a specialist"}</h2>
          <p className="muted">Response time: usually under 2 hours on business days.</p>
          <p>Email: <a href={contact.emailHref}>{contact.email}</a></p>
          <p>Phone: <a href={contact.phoneHref}>{contact.phoneDisplay}</a></p>
          {contact.supportHours && <p>Support hours: {contact.supportHours}</p>}
          {contact.supportAddress && <p>Office: {contact.supportAddress}</p>}
        </article>
        <article className="card-pad">
          <h2>{isCustomPlan ? "Request a Custom Tier" : "Send us a message"}</h2>
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
