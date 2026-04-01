import { getContactSettings } from "@/lib/site-settings";

export default async function PrivacyPage() {
  const contact = await getContactSettings();
  return (
    <section className="shell section">
      <h1>Privacy Policy</h1>
      <p>RightBricks processes enquiry and listing data to provide trusted property marketplace services in Cambodia.</p>
      <p>Contact our privacy team at <a href={contact.emailHref}>{contact.email}</a> or <a href={contact.phoneHref}>{contact.phoneDisplay}</a>.</p>
    </section>
  );
}
