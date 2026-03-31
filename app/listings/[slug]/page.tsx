import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/marketplace/badge";
import { ListingCard } from "@/components/marketplace/listing-card";
import { Section } from "@/components/site/section";
import { getListingBySlug, getRelatedListings } from "@/lib/marketplace-data";

type ListingDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ListingDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const listing = getListingBySlug(slug);

  if (!listing) {
    return {
      title: "Listing not found"
    };
  }

  return {
    title: listing.title,
    description: `${listing.propertyType} in ${listing.district}, ${listing.city}. ${listing.intent === "rent" ? "Rent" : "Buy"} at $${listing.priceUsd.toLocaleString()}.`
  };
}

export default async function ListingDetailPage({ params }: ListingDetailPageProps) {
  const { slug } = await params;
  const listing = getListingBySlug(slug);

  if (!listing) {
    notFound();
  }

  const related = getRelatedListings(listing);

  return (
    <Section className="py-10">
      <article className="space-y-8">
        <header className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            <img src={listing.coverImageUrl} alt={listing.title} className="h-[380px] w-full rounded-2xl object-cover" />
            <div className="grid grid-cols-2 gap-3">
              {listing.gallery.map((imageUrl) => (
                <img key={imageUrl} src={imageUrl} alt={`${listing.title} gallery`} className="h-40 w-full rounded-xl object-cover" />
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
            <p className="mt-1 text-sm text-slate-600">Send your viewing request directly to the listing owner.</p>
            <form className="mt-4 space-y-3">
              <input aria-label="Your name" placeholder="Your name" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <input
                aria-label="Email"
                type="email"
                placeholder="Email"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <textarea
                aria-label="Message"
                placeholder="I want to schedule a viewing this week"
                rows={4}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <button type="button" className="w-full rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
                Send enquiry
              </button>
            </form>
            <p className="mt-4 text-sm text-slate-700">
              Contact: {listing.ownerName} ({listing.ownerRole})
            </p>
            <p className="text-sm text-slate-700">Phone: {listing.ownerPhone}</p>
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
