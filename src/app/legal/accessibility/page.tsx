import type { Metadata } from "next";
import Link from "next/link";
import { getContactSettings } from "@/lib/site-settings";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Accessibility Statement",
  description: "RightBricks accessibility commitments for keyboard navigation, readable layouts, and inclusive listing experiences.",
  path: "/legal/accessibility"
});

export default async function AccessibilityPage() {
  const contact = await getContactSettings();
  return (
    <section className="shell section">
      <h1>Accessibility Statement</h1>
      <p>RightBricks is committed to improving keyboard navigation, readable contrast, semantic structure, and accessible forms.</p>
      <p>If you experience barriers, please contact us at <a href={contact.emailHref}>{contact.email}</a> or <a href={contact.phoneHref}>{contact.phoneDisplay}</a>.</p>
      <p className="muted">Related pages: <Link href="/support">Support Center</Link> · <Link href="/legal/privacy">Privacy Policy</Link>.</p>
    </section>
  );
}
