import { db } from "@/lib/db";
import { ContactForm } from "@/components/ui/contact-form";

export default async function ContactPage() {
  const fallbackListing = await db.listing.findFirst({ where: { status: "PUBLISHED" }, select: { id: true } });

  return (
    <section className="shell section">
      <div className="section-head narrow">
        <h1>Contact RightBricks</h1>
        <p className="muted">Tell us what you are looking for and we will match you with verified opportunities and next-step guidance.</p>
      </div>

      <div className="two-col">
        <article className="card-pad">
          <h2>Talk to a specialist</h2>
          <p className="muted">Response time: usually under 2 hours on business days.</p>
          <p>Email: support@rightbricks.com</p>
          <p>Phone: +1 (415) 555-0199</p>
          <p>Office: 301 Market Street, San Francisco, CA</p>
        </article>
        <article className="card-pad">
          <h2>Send us a message</h2>
          <ContactForm listingId={fallbackListing?.id ?? ""} />
        </article>
      </div>
    </section>
  );
}
