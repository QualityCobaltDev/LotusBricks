import type { Metadata } from "next";
import Link from "next/link";
import { ListingCard } from "@/components/marketplace/listing-card";
import { ButtonLink } from "@/components/site/button-link";
import { Section } from "@/components/site/section";
import { MARKET_STATS, getFeaturedListings } from "@/lib/marketplace-data";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Cambodia Property Marketplace",
  description: "Search verified Cambodia listings to buy or rent and connect directly with trusted owners and agents.",
  alternates: { canonical: "/" }
};

const quickPaths = [
  { href: "/buy", title: "Buy", description: "Find homes, condos, and investment properties with verified listing data." },
  { href: "/rent", title: "Rent", description: "Browse apartments and villas with transparent pricing and response times." },
  { href: "/sell", title: "Sell", description: "Launch your listing, qualify leads, and track offers in one workflow." },
  { href: "/landlords", title: "Landlords", description: "Manage occupancy and tenant pipelines across your portfolio." },
  { href: "/developers", title: "Developers", description: "Showcase projects with branded pages and campaign-ready lead capture." }
] as const;

export default function HomePage() {
  const featuredListings = getFeaturedListings();

  return (
    <div className="pb-6">
      <Section className="py-14 md:py-20">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr] md:items-center">
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary-700">Cambodia-first property marketplace</p>
            <h1 className="text-4xl font-bold leading-tight text-neutral-900 md:text-5xl">Find verified properties in Cambodia with complete clarity.</h1>
            <p className="text-lg text-neutral-600">RightBricks helps buyers, renters, owners, landlords, and developers move faster with trusted listings, responsive support, and structured workflows.</p>
            <form action="/buy" className="grid gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm md:grid-cols-4">
              <input name="q" className="rounded-lg border border-neutral-300 px-3 py-2 text-sm md:col-span-2" placeholder="Search by city, district, or neighborhood" />
              <select name="propertyType" className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"><option value="any">Any type</option><option>Condo</option><option>Villa</option><option>Apartment</option></select>
              <button className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white">Search now</button>
            </form>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/buy">Browse listings</ButtonLink>
              <ButtonLink href="/request-valuation" variant="secondary">Request valuation</ButtonLink>
            </div>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-neutral-900">Why RightBricks</h2>
            <dl className="mt-5 grid gap-4 sm:grid-cols-3">
              <div><dt className="text-xs uppercase tracking-wide text-neutral-500">Verified listings</dt><dd className="mt-1 text-2xl font-bold text-primary-700">{MARKET_STATS.verifiedListings.toLocaleString()}+</dd></div>
              <div><dt className="text-xs uppercase tracking-wide text-neutral-500">Avg response</dt><dd className="mt-1 text-2xl font-bold text-primary-700">{MARKET_STATS.averageResponseHours}h</dd></div>
              <div><dt className="text-xs uppercase tracking-wide text-neutral-500">Districts</dt><dd className="mt-1 text-2xl font-bold text-primary-700">{MARKET_STATS.managedDistricts}</dd></div>
            </dl>
            <p className="mt-4 text-sm text-neutral-600">Need immediate help? <a href={`tel:${siteConfig.contactPhoneHref}`} className="font-medium text-primary-700">{siteConfig.contactPhoneDisplay}</a></p>
          </div>
        </div>
      </Section>

      <Section className="py-8">
        <h2 className="text-2xl font-semibold text-neutral-900">Choose your path</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-5">{quickPaths.map((path) => <article key={path.href} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"><h3 className="text-lg font-semibold text-neutral-900">{path.title}</h3><p className="mt-2 text-sm text-neutral-600">{path.description}</p><ButtonLink href={path.href} className="mt-4">Explore</ButtonLink></article>)}</div>
      </Section>

      <Section className="py-8">
        <div className="flex items-end justify-between gap-4"><h2 className="text-2xl font-semibold text-neutral-900">Featured verified listings</h2><ButtonLink href="/buy" variant="secondary">View all for sale</ButtonLink></div>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">{featuredListings.map((listing) => <ListingCard key={listing.id} listing={listing} />)}</div>
      </Section>

      <Section className="py-8">
        <div className="grid gap-4 rounded-2xl border border-neutral-200 bg-white p-6 md:grid-cols-3">
          <div><h3 className="font-semibold text-neutral-900">Verification standards</h3><p className="mt-2 text-sm text-neutral-600">We validate ownership source, media quality, and listing completeness before publishing.</p></div>
          <div><h3 className="font-semibold text-neutral-900">Neighborhood guidance</h3><p className="mt-2 text-sm text-neutral-600">Browse district-level market insights for Phnom Penh, Siem Reap, and growth corridors.</p></div>
          <div><h3 className="font-semibold text-neutral-900">Market updates</h3><p className="mt-2 text-sm text-neutral-600">Subscribe for pricing trends and new launch alerts. <Link className="text-primary-700" href="/contact">Join updates</Link>.</p></div>
        </div>
      </Section>
    </div>
  );
}
