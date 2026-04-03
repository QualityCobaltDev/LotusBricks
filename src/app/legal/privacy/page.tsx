import type { Metadata } from "next";
import Link from "next/link";
import { getContactSettings } from "@/lib/site-settings";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: "How RightBricks collects, uses, and protects personal data across listing and enquiry workflows.",
  path: "/legal/privacy"
});

const sections = [
  {
    title: "Information we collect",
    body: "We collect account details, enquiry form data, listing submission details, and technical telemetry required to operate and secure RightBricks."
  },
  {
    title: "How we use information",
    body: "Data is used to respond to enquiries, deliver marketplace features, improve listing quality controls, prevent abuse, and maintain service reliability."
  },
  {
    title: "Cookies and analytics",
    body: "Essential cookies are used for security and session management. Non-essential analytics are collected only when you provide consent through our consent banner."
  },
  {
    title: "Sharing and processors",
    body: "We may share data with hosting, email, and infrastructure providers acting on our instructions. We do not sell personal data."
  },
  {
    title: "Retention",
    body: "We retain enquiry and account data only as long as needed for operations, legal obligations, dispute resolution, and fraud prevention."
  },
  {
    title: "Your rights",
    body: "You may request access, correction, or deletion of your personal data, subject to legal and operational requirements."
  }
];

export default async function PrivacyPage() {
  const contact = await getContactSettings();
  return (
    <section className="shell section narrow">
      <h1>Privacy Policy</h1>
      <p className="muted">Last updated: April 2, 2026.</p>
      {sections.map((section) => (
        <article key={section.title} className="card-pad" style={{ marginBottom: "0.8rem" }}>
          <h2>{section.title}</h2>
          <p>{section.body}</p>
        </article>
      ))}
      <article className="card-pad">
        <h2>Contact</h2>
        <p>Privacy requests: <a href={contact.emailHref}>{contact.email}</a> · <a href={contact.phoneHref}>{contact.phoneDisplay}</a>.</p>
        <p className="muted">Related policies: <Link href="/legal/terms">Terms of Service</Link> · <Link href="/legal/accessibility">Accessibility Statement</Link>.</p>
      </article>
    </section>
  );
}
