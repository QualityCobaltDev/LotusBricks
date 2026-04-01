import { getContactSettings } from "@/lib/site-settings";

export default async function TermsPage() {
  const contact = await getContactSettings();
  return (
    <section className="shell section">
      <h1>Terms of Service</h1>
      <p>By using RightBricks, you agree to provide accurate data in lead forms and listing submissions.</p>
      <p>Questions: <a href={contact.emailHref}>{contact.email}</a> · <a href={contact.phoneHref}>{contact.phoneDisplay}</a>.</p>
    </section>
  );
}
