import Link from "next/link";
import { Badge } from "@/components/marketplace/badge";
import type { ListingSummary } from "@/lib/marketplace-data";

type ListingCardProps = {
  listing: ListingSummary;
};

function formatPrice(listing: ListingSummary): string {
  if (listing.intent === "rent") {
    return `$${listing.priceUsd.toLocaleString()} / month`;
  }
  return `$${listing.priceUsd.toLocaleString()}`;
}

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <img src={listing.coverImageUrl} alt={listing.title} className="h-52 w-full object-cover" />
      <div className="space-y-3 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{listing.propertyType}</Badge>
          {listing.isVerified ? <Badge tone="success">Verified</Badge> : null}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{listing.title}</h3>
          <p className="text-sm text-slate-600">
            {listing.district}, {listing.city}
          </p>
        </div>
        <p className="text-xl font-bold text-brand-700">{formatPrice(listing)}</p>
        <p className="text-sm text-slate-700">
          {[listing.bedrooms ? `${listing.bedrooms} bed` : null, listing.bathrooms ? `${listing.bathrooms} bath` : null, listing.floorAreaSqm ? `${listing.floorAreaSqm} sqm` : null]
            .filter(Boolean)
            .join(" • ")}
        </p>
        <Link href={`/listings/${listing.slug}`} className="inline-flex text-sm font-medium text-brand-700 hover:text-brand-500">
          View details →
        </Link>
      </div>
    </article>
  );
}
