import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/marketplace/badge";
import type { ListingSummary } from "@/lib/marketplace-data";

type ListingCardProps = { listing: ListingSummary };

function formatPrice(listing: ListingSummary): string {
  return listing.intent === "rent" ? `$${listing.priceUsd.toLocaleString()} / month` : `$${listing.priceUsd.toLocaleString()}`;
}

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative h-52 w-full">
        <Image src={listing.coverImageUrl} alt={listing.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
      </div>
      <div className="space-y-3 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{listing.propertyType}</Badge>
          {listing.isVerified ? <Badge tone="success">Verified</Badge> : null}
          {listing.isFeatured ? <Badge tone="brand">Featured</Badge> : null}
          {listing.isNew ? <Badge tone="default">New</Badge> : null}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{listing.title}</h3>
          <p className="text-sm text-slate-600">{listing.neighborhood}, {listing.district}, {listing.city}</p>
        </div>
        <p className="text-xl font-bold text-brand-700">{formatPrice(listing)}</p>
        <p className="text-sm text-slate-700">{[listing.bedrooms ? `${listing.bedrooms} bed` : null, listing.bathrooms ? `${listing.bathrooms} bath` : null, listing.floorAreaSqm ? `${listing.floorAreaSqm} sqm` : null].filter(Boolean).join(" • ")}</p>
        <p className="line-clamp-2 text-sm text-slate-600">{listing.description}</p>
        <div className="flex items-center justify-between">
          <Link href={`/listings/${listing.slug}`} className="inline-flex text-sm font-medium text-brand-700 hover:text-brand-500">View details →</Link>
          <button type="button" className="text-xs font-medium text-slate-500 hover:text-brand-700">Save</button>
        </div>
      </div>
    </article>
  );
}
