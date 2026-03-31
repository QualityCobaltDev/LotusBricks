import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/marketplace/badge";
import { ListingCard } from "@/components/marketplace/listing-card";
import { LeadForm } from "@/components/forms/lead-form";
import { Section } from "@/components/site/section";
import { getAllListings, getListingBySlug, getRelatedListings } from "@/lib/marketplace-data";
import { siteConfig } from "@/lib/site-config";

type ListingDetailPageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() { return getAllListings().map((listing) => ({ slug: listing.slug })); }

export async function generateMetadata({ params }: ListingDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const listing = getListingBySlug(slug);
  if (!listing) return { title: "Listing not found" };
  const title = `${listing.title} in ${listing.city}`;
  const description = `${listing.propertyType} in ${listing.district}, ${listing.city}. ${listing.intent === "rent" ? "Rent" : "Buy"} at $${listing.priceUsd.toLocaleString()}.`;
  return { title, description, alternates: { canonical: `/listings/${listing.slug}` }, openGraph: { title, description, url: `/listings/${listing.slug}`, images: [{ url: listing.coverImageUrl }] } };
}

export default async function ListingDetailPage({ params }: ListingDetailPageProps) {
  const { slug } = await params;
  const listing = getListingBySlug(slug);
  if (!listing) notFound();
  const related = getRelatedListings(listing);

  return (
    <Section className="py-10">
      <article className="space-y-8">
        <header className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            <div className="relative h-[380px] w-full overflow-hidden rounded-2xl"><Image src={listing.coverImageUrl} alt={listing.title} fill className="object-cover" priority /></div>
            <div className="grid grid-cols-2 gap-3">{listing.gallery.map((imageUrl) => <div key={imageUrl} className="relative h-40 overflow-hidden rounded-xl"><Image src={imageUrl} alt={`${listing.title} gallery`} fill className="object-cover" /></div>)}</div>
            {listing.videoTourUrl ? <iframe title="Video tour" className="h-72 w-full rounded-2xl border border-slate-200" src={listing.videoTourUrl} /> : null}
          </div>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap gap-2"><Badge>{listing.propertyType}</Badge>{listing.isVerified ? <Badge tone="success">Verified</Badge> : null}{listing.isFeatured ? <Badge tone="brand">Featured</Badge> : null}</div>
            <h1 className="mt-3 text-2xl font-bold text-slate-900">{listing.title}</h1>
            <p className="mt-1 text-slate-600">{listing.addressLine}, {listing.district}, {listing.city}</p>
            <p className="mt-4 text-3xl font-bold text-brand-700">${listing.priceUsd.toLocaleString()} {listing.intent === "rent" ? <span className="text-lg">/ month</span> : null}</p>
            <p className="mt-2 text-sm text-slate-600">Owner/agent: {listing.ownerName} ({listing.ownerRole})</p>
            <LeadForm listingSlug={listing.slug} listingTitle={listing.title} />
            <p className="mt-2 text-xs text-slate-500">Immediate support: <a href={`tel:${siteConfig.contactPhoneHref}`}>{siteConfig.contactPhoneDisplay}</a> · <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a></p>
          </aside>
        </header>

        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-5">
            <div><h2 className="text-xl font-semibold text-slate-900">About this property</h2><p className="mt-2 text-slate-700">{listing.description}</p></div>
            <div><h2 className="text-xl font-semibold text-slate-900">Property facts</h2><ul className="mt-2 grid grid-cols-2 gap-2 text-sm text-slate-700 md:grid-cols-4"><li className="rounded-lg bg-white p-3">Beds: {listing.bedrooms ?? "N/A"}</li><li className="rounded-lg bg-white p-3">Baths: {listing.bathrooms ?? "N/A"}</li><li className="rounded-lg bg-white p-3">Floor: {listing.floorAreaSqm ?? "N/A"} sqm</li><li className="rounded-lg bg-white p-3">Land: {listing.landAreaSqm ?? "N/A"} sqm</li></ul></div>
            <div><h2 className="text-xl font-semibold text-slate-900">Amenities</h2><ul className="mt-2 flex flex-wrap gap-2">{listing.amenities.map((a) => <li key={a} className="rounded-full bg-slate-100 px-3 py-1 text-sm">{a}</li>)}</ul></div>
            <div><h2 className="text-xl font-semibold text-slate-900">Neighborhood overview</h2><p className="mt-2 text-slate-700">Located in {listing.neighborhood}, with access to retail, schools, and transport hubs across {listing.district}.</p></div>
          </div>
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-lg font-semibold text-slate-900">Actions</h2><div className="mt-3 space-y-2 text-sm"><Link href="/contact" className="block text-brand-700">Schedule viewing</Link><button className="block">Save listing</button><button className="block">Share listing</button><button className="block text-rose-700">Report listing</button></div></aside>
        </section>

        <section><h2 className="text-xl font-semibold text-slate-900">Similar listings</h2><div className="mt-3 grid gap-4 md:grid-cols-3">{related.map((relatedListing) => <ListingCard key={relatedListing.id} listing={relatedListing} />)}</div></section>
      </article>
    </Section>
  );
}
