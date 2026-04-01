import { db } from "@/lib/db";
import { ContactForm } from "@/components/ui/contact-form";

type ContactPageProps = {
  searchParams: Promise<{ plan?: string; tierNeeds?: string }>;
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = await searchParams;
  const fallbackListing = await db.listing.findFirst({ where: { status: "PUBLISHED" }, select: { id: true } });
  const isCustomPlan = params.plan === "custom" || params.tierNeeds === "10-plus";

  return (
    <section className="shell section">
      <div className="section-head narrow">
        <h1>Contact RightBricks</h1>
        <p className="muted">Need more than 10 listings? Contact us for a tailored Custom Tier. Standard tiers include up to 10 photos and 2 videos per listing.</p>
      </div>

      <div className="two-col">
        <article className="card-pad">
          <h2>{isCustomPlan ? "Speak to sales" : "Talk to a specialist"}</h2>
          <p className="muted">Response time: usually under 2 hours on business days.</p>
          <p>Email: support@rightbricks.com</p>
          <p>Phone: +1 (415) 555-0199</p>
          <p>Office: 301 Market Street, San Francisco, CA</p>
        </article>
        <article className="card-pad">
          <h2>{isCustomPlan ? "Request a Custom Tier" : "Send us a message"}</h2>
          <ContactForm
            listingId={fallbackListing?.id ?? ""}
            selectedPlan={(params.plan ?? "").toUpperCase()}
            inquiryType={isCustomPlan ? "CUSTOM_PLAN" : "GENERAL"}
          />
        </article>
      </div>
    </section>
  );
}
