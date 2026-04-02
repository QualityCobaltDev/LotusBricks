import type { Metadata } from "next";
import Link from "next/link";
import { buildBreadcrumbJsonLd, buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Market Intelligence Resources",
  description: "Practical property guides, due diligence checklists, and market intelligence for Cambodia.",
  path: "/resources"
});

const resources = [
  {
    href: "/resources/phnom-penh-investment-guide",
    title: "Phnom Penh investment guide",
    summary: "District-level investment signals, rental pressure zones, and underwriting checkpoints."
  },
  {
    href: "/resources/buyer-due-diligence-checklist",
    title: "Buyer due-diligence checklist",
    summary: "A pre-deposit legal, financial, and physical review workflow for safer transactions."
  },
  {
    href: "/resources/developer-listing-playbook",
    title: "Developer listing playbook",
    summary: "How developers can launch trusted listing pages that convert qualified enquiries."
  }
] as const;

export default function ResourcesPage() {
  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Resources", path: "/resources" }
  ]);

  return (
    <section className="shell section">
      <div className="section-head narrow">
        <h1>Market intelligence &amp; resources</h1>
        <p className="muted">Decision-ready guides for buyers, investors, and developers in Cambodia.</p>
      </div>
      <div className="grid">
        {resources.map((resource) => (
          <article key={resource.href} className="card">
            <h2>{resource.title}</h2>
            <p className="muted">{resource.summary}</p>
            <Link href={resource.href as any}>Read guide</Link>
          </article>
        ))}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
    </section>
  );
}
