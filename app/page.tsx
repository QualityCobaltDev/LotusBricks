import type { Metadata } from "next";
import { ListingCard } from "@/components/marketplace/listing-card";
import { ButtonLink } from "@/components/site/button-link";
import { Section } from "@/components/site/section";
import { MARKET_STATS, getFeaturedListings } from "@/lib/marketplace-data";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Cambodia Property Marketplace",
  description: "Search verified Cambodia listings to buy or rent and connect directly with trusted owners and agents.",
  alternates: {
    canonical: "/"
  }
};

const quickPaths = [
  { href: "/buy", title: "Buy", description: "Find homes, condos, and investment properties with verified listing data." },
  { href: "/rent", title: "Rent", description: "Browse apartments and villas with transparent pricing and response times." },
  { href: "/sell", title: "List Property", description: "Launch your listing, qualify leads, and track offers in one workflow." }
] as const;

export default function HomePage() {
  const featuredListings = getFeaturedListings();

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.domain,
    email: siteConfig.contactEmail,
    telephone: siteConfig.contactPhoneDisplay,
    description: siteConfig.description
  };

  return (
    <div className="pb-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />

      <Section className="py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-700">Cambodia-first property marketplace</p>
            <h1 className="text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
              Buy or rent with verified listings, not guesswork.
            </h1>
            <p className="text-lg text-slate-600">
              RightBricks helps serious buyers, renters, and owners close faster with clear listing quality standards and structured lead workflows.
            </p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/buy">Search properties</ButtonLink>
              <ButtonLink href="/pricing" variant="secondary">
                Compare plans
              </ButtonLink>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Trust signals built into the platform</h2>
            <dl className="mt-5 grid gap-4 sm:grid-cols-3">
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">Verified listings</dt>
                <dd className="mt-1 text-2xl font-bold text-brand-700">{MARKET_STATS.verifiedListings.toLocaleString()}+</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">Avg owner response</dt>
                <dd className="mt-1 text-2xl font-bold text-brand-700">{MARKET_STATS.averageResponseHours}h</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">Active districts</dt>
                <dd className="mt-1 text-2xl font-bold text-brand-700">{MARKET_STATS.managedDistricts}</dd>
              </div>
            </dl>
          </div>
        </div>
      </Section>

      <Section className="py-8">
        <h2 className="text-2xl font-semibold text-slate-900">Choose your path</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {quickPaths.map((path) => (
            <article key={path.href} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">{path.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{path.description}</p>
              <ButtonLink href={path.href} className="mt-4">
                Explore {path.title}
              </ButtonLink>
            </article>
          ))}
        </div>
      </Section>

      <Section className="py-8">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold text-slate-900">Featured listings</h2>
          <ButtonLink href="/buy" variant="secondary">
            View all for sale
          </ButtonLink>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {featuredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </Section>
    </div>
  );
}
