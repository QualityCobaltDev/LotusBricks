import { getContactSettings } from "@/lib/site-settings";

export default async function AccessibilityPage() {
  const contact = await getContactSettings();
  return (
    <section className="shell section">
      <h1>Accessibility Statement</h1>
      <p>RightBricks is committed to improving keyboard navigation, readable contrast, semantic structure, and accessible forms.</p>
      <p>If you experience barriers, please contact us at <a href={contact.emailHref}>{contact.email}</a> or <a href={contact.phoneHref}>{contact.phoneDisplay}</a>.</p>
    </section>
  );
}
