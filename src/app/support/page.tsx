import { getContactSettings } from "@/lib/site-settings";

export default async function SupportPage() {
  const contact = await getContactSettings();
  return (
    <section className="shell section">
      <div className="section-head">
        <h1>Support Center</h1>
        <p className="muted">Need listing help, valuation guidance, or account assistance? Our team is ready to help.</p>
      </div>
      <article className="card-pad">
        <p>Email: <a href={contact.emailHref}>{contact.email}</a></p>
        <p>Phone: <a href={contact.phoneHref}>{contact.phoneDisplay}</a></p>
        <p>Our team will contact you shortly via phone or email after any enquiry submission.</p>
      </article>
    </section>
  );
}
