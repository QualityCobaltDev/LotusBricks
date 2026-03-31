import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/marketplace/badge";
import { ListingCard } from "@/components/marketplace/listing-card";
import { ButtonLink } from "@/components/site/button-link";
import { Section } from "@/components/site/section";
import { getAllListings, getListingBySlug, getRelatedListings } from "@/lib/marketplace-data";
import { siteConfig } from "@/lib/site-config";

type ListingDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllListings().map((listing) => ({ slug: listing.slug }));
}

export async function generateMetadata({ params }: ListingDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const listing = getListingBySlug(slug);

  if (!listing) {
    return { title: "Listing not found" };
  }

  const title = `${listing.title} in ${listing.city}`;
  const description = `${listing.propertyType} in ${listing.district}, ${listing.city}. ${listing.intent === "rent" ? "Rent" : "Buy"} at $${listing.priceUsd.toLocaleString()}.`;
  const canonical = `/listings/${listing.slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      images: [{ url: listing.coverImageUrl }]
    }
  };
}

export default async function ListingDetailPage({ params }: ListingDetailPageProps) {
  const { slug } = await params;
  const listing = getListingBySlug(slug);

  if (!listing) notFound();

  const related = getRelatedListings(listing);
  const contactPhoneHref = listing.ownerPhone.replace(/\s+/g, "");
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: listing.title,
    description: listing.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: listing.city,
      addressRegion: listing.district,
      streetAddress: listing.addressLine,
      addressCountry: "KH"
    },
    image: [listing.coverImageUrl, ...listing.gallery],
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: listing.priceUsd,
      availability: "https://schema.org/InStock",
      url: `${siteConfig.domain}/listings/${listing.slug}`
    }
  };

  return (
    <Section className="py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <article className="space-y-8">
        <header className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            <div className="relative h-[380px] w-full overflow-hidden rounded-2xl">
              <Image src={listing.coverImageUrl} alt={listing.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 66vw" priority />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {listing.gallery.map((imageUrl) => (
                <div key={imageUrl} className="relative h-40 w-full overflow-hidden rounded-xl">
                  <Image src={imageUrl} alt={`${listing.title} gallery`} fill className="object-cover" sizes="(max-width: 1024px) 50vw, 33vw" />
                </div>
              ))}
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap gap-2">
              <Badge>{listing.propertyType}</Badge>
              {listing.isVerified ? <Badge tone="success">Verified</Badge> : null}
            </div>
            <h1 className="mt-3 text-2xl font-bold text-slate-900">{listing.title}</h1>
            <p className="mt-1 text-slate-600">
              {listing.addressLine}, {listing.district}, {listing.city}
            </p>
            <p className="mt-4 text-3xl font-bold text-brand-700">
              ${listing.priceUsd.toLocaleString()}
              {listing.intent === "rent" ? " / month" : ""}
            </p>
            <dl className="mt-4 space-y-2 text-sm text-slate-700">
              <div className="flex justify-between">
                <dt>Bedrooms</dt>
                <dd>{listing.bedrooms ?? "N/A"}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Bathrooms</dt>
                <dd>{listing.bathrooms ?? "N/A"}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Floor area</dt>
                <dd>{listing.floorAreaSqm ? `${listing.floorAreaSqm} sqm` : "N/A"}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Land area</dt>
                <dd>{listing.landAreaSqm ? `${listing.landAreaSqm} sqm` : "N/A"}</dd>
              </div>
            </dl>
          </aside>
        </header>

        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">About this property</h2>
              <p className="mt-2 text-slate-700">{listing.description}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Property facts</h2>
              <ul className="mt-2 grid grid-cols-2 gap-2 text-sm text-slate-700 md:grid-cols-4">
                <li className="rounded-lg bg-white p-3">Intent: {listing.intent}</li>
                <li className="rounded-lg bg-white p-3">Type: {listing.propertyType}</li>
                <li className="rounded-lg bg-white p-3">District: {listing.district}</li>
                <li className="rounded-lg bg-white p-3">City: {listing.city}</li>
              </ul>
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Enquire now</h2>
            <p className="mt-1 text-sm text-slate-600">This lead form is still MVP-stage, so use the direct owner contact actions below for live traffic.</p>
            <div className="mt-4 space-y-3">
              <ButtonLink href={`tel:${contactPhoneHref}`}>Call owner</ButtonLink>
              <ButtonLink href={`mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(`Property enquiry: ${listing.title}`)}`} variant="secondary">
                Email RightBricks
              </ButtonLink>
            </div>
            <p className="mt-4 text-sm text-slate-700">
              Contact: {listing.ownerName} ({listing.ownerRole})
            </p>
            <p className="text-sm text-slate-700">Phone: {listing.ownerPhone}</p>
            <Link href="/request-valuation" className="mt-4 inline-flex text-sm font-medium text-brand-700 hover:text-brand-500">
              Want to list a similar property? →
            </Link>
          </aside>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">Related listings</h2>
          <div className="mt-3 grid gap-4 md:grid-cols-3">
            {related.map((relatedListing) => (
              <ListingCard key={relatedListing.id} listing={relatedListing} />
            ))}
          </div>
        </section>
      </article>
    </Section>
  );
}
