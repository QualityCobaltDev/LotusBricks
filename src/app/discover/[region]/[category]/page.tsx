import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildBreadcrumbJsonLd, buildMetadata } from "@/lib/metadata";
import { buildListingsFilterHref, getCategoryBySlug, getDiscoverPath, getRegionBySlug, SEO_CATEGORIES, SEO_REGIONS } from "@/lib/seo-growth";

type Props = {
  params: Promise<{ region: string; category: string }>;
};

export function generateStaticParams() {
  return SEO_REGIONS.flatMap((region) =>
    SEO_CATEGORIES.map((category) => ({ region: region.slug, category: category.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { region: regionSlug, category: categorySlug } = await params;
  const region = getRegionBySlug(regionSlug);
  const category = getCategoryBySlug(categorySlug);

  if (!region || !category) {
    return buildMetadata({
      title: "Discovery hub not found",
      description: "The requested discovery hub does not exist.",
      path: "/discover",
      noIndex: true
    });
  }

  return buildMetadata({
    title: `${category.name} in ${region.name}`,
    description: `Browse verified ${category.name.toLowerCase()} in ${region.name} and move into full listing results with trust-ready detail pages.`,
    path: getDiscoverPath(region.slug, category.slug)
  });
}

export default async function DiscoverLandingPage({ params }: Props) {
  const { region: regionSlug, category: categorySlug } = await params;
  const region = getRegionBySlug(regionSlug);
  const category = getCategoryBySlug(categorySlug);

  if (!region || !category) {
    notFound();
  }

  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Discover", path: "/discover" },
    { name: region.name, path: "/discover" },
    { name: `${category.name} in ${region.name}`, path: getDiscoverPath(region.slug, category.slug) }
  ]);

  return (
    <section className="shell section">
      <nav aria-label="Breadcrumb"><p><Link href="/">Home</Link> / <Link href="/discover">Discover</Link> / <span>{category.name} in {region.name}</span></p></nav>
      <div className="section-head narrow">
        <h1>{category.name} in {region.name}</h1>
        <p className="muted">Explore a focused pathway into listings for this market segment. Use this hub to move into live filtered inventory.</p>
      </div>
      <article className="card-pad">
        <h2>Browse live inventory</h2>
        <p>Open filtered listings for {category.name.toLowerCase()} in {region.name}.</p>
        <Link className="btn btn-primary" href={buildListingsFilterHref({ regionName: region.name, categoryKey: category.listingCategory })}>View filtered listings</Link>
      </article>
      <article className="card-pad section-card-gap">
        <h2>Explore more discovery paths</h2>
        <ul className="check-list">
          {SEO_CATEGORIES.filter((item) => item.slug !== category.slug).slice(0, 3).map((item) => (
            <li key={item.slug}><Link href={getDiscoverPath(region.slug, item.slug)}>{item.name} in {region.name}</Link></li>
          ))}
          {SEO_REGIONS.filter((item) => item.slug !== region.slug).slice(0, 3).map((item) => (
            <li key={item.slug}><Link href={getDiscoverPath(item.slug, category.slug)}>{category.name} in {item.name}</Link></li>
          ))}
        </ul>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
    </section>
  );
}
