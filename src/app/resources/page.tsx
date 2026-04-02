import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Resources",
  description: "Market intelligence and practical resources for Cambodia property buyers, investors, and developers.",
  alternates: { canonical: "/resources" }
};

export default function ResourcesPage() {
  return (
    <section className="shell section narrow">
      <h1>Market intelligence &amp; resources</h1>
      <p className="muted">Guides and checklists aligned with RightBricks verification-first workflows.</p>
      <ul>
        <li><Link href="/resources/phnom-penh-investment-guide">Phnom Penh investment guide</Link></li>
        <li><Link href="/resources/buyer-due-diligence-checklist">Buyer due-diligence checklist</Link></li>
        <li><Link href="/resources/developer-listing-playbook">Developer listing playbook</Link></li>
      </ul>
    </section>
  );
}
