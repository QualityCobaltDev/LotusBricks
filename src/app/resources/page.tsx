import type { Metadata } from "next";
import Link from "next/link";
import { buildBreadcrumbJsonLd, buildMetadata } from "@/lib/metadata";
import { RESOURCE_ARTICLES } from "@/lib/resources";

export const metadata: Metadata = buildMetadata({
  title: "Market Intelligence Resources",
  description: "Practical property guides, due diligence checklists, and market intelligence for Cambodia.",
  path: "/resources"
});

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
        {RESOURCE_ARTICLES.map((resource) => (
          <article key={resource.slug} className="card">
            <h2>{resource.title}</h2>
            <p className="muted">{resource.summary}</p>
            <Link href={`/resources/${resource.slug}` as any}>Read guide</Link>
          </article>
        ))}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
    </section>
  );
}
