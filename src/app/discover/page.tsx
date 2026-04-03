import type { Metadata } from "next";
import Link from "next/link";
import { buildBreadcrumbJsonLd, buildMetadata } from "@/lib/metadata";
import { getDiscoverPath, SEO_CATEGORIES, SEO_REGIONS } from "@/lib/seo-growth";

export const metadata: Metadata = buildMetadata({
  title: "Property Discovery Hubs in Cambodia",
  description: "Explore regional and property-type discovery hubs to quickly navigate verified RightBricks listings.",
  path: "/discover"
});

export default function DiscoverIndexPage() {
  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Discover", path: "/discover" }
  ]);

  return (
    <section className="shell section">
      <nav aria-label="Breadcrumb"><p><Link href="/">Home</Link> / <span>Discover</span></p></nav>
      <div className="section-head narrow">
        <h1>Discover properties by location and property type</h1>
        <p className="muted">This hub structure supports fast browsing today and scalable SEO growth as RightBricks expands regional inventory.</p>
      </div>
      <div className="grid">
        {SEO_REGIONS.map((region) => (
          <article className="card-pad" key={region.slug}>
            <h2>{region.name}</h2>
            <ul>
              {SEO_CATEGORIES.slice(0, 4).map((category) => (
                <li key={category.slug}>
                  <Link href={getDiscoverPath(region.slug, category.slug)}>{category.name} in {region.name}</Link>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
    </section>
  );
}
