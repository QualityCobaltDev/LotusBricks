import { getContactSettings } from "@/lib/site-settings";

const sections = [
  {
    title: "Marketplace use",
    body: "You must provide accurate information when submitting enquiries or listings and use the platform only for legitimate property activity."
  },
  {
    title: "Listing standards",
    body: "Sellers, agents, and developers must hold rights to publish listing content, pricing, and media; deceptive or unverifiable listings may be removed."
  },
  {
    title: "Prohibited conduct",
    body: "Fraudulent activity, scraping, credential abuse, spam, and attempts to disrupt platform integrity are strictly prohibited."
  },
  {
    title: "Intellectual property",
    body: "RightBricks branding, software, and site content remain our intellectual property unless otherwise stated."
  },
  {
    title: "Disclaimers and limitation",
    body: "RightBricks provides marketplace and intelligence tooling, but users remain responsible for independent legal, tax, and investment due diligence."
  }
];

export default async function TermsPage() {
  const contact = await getContactSettings();
  return (
    <section className="shell section narrow">
      <h1>Terms of Service</h1>
      <p className="muted">Last updated: April 2, 2026.</p>
      {sections.map((section) => (
        <article key={section.title} className="card-pad" style={{ marginBottom: "0.8rem" }}>
          <h2>{section.title}</h2>
          <p>{section.body}</p>
        </article>
      ))}
      <article className="card-pad">
        <h2>Contact</h2>
        <p>Terms questions: <a href={contact.emailHref}>{contact.email}</a> · <a href={contact.phoneHref}>{contact.phoneDisplay}</a>.</p>
      </article>
    </section>
  );
}
