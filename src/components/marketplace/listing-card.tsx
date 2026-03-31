import Link from "next/link";
import { routes } from "@/lib/routes";
import type { Listing } from "@/lib/marketplace";

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <article className="card card-body">
      <img src={listing.images[0]} alt={listing.title} className="listing-image" />
      <h3>{listing.title}</h3>
      <p>{listing.city}, {listing.district}</p>
      <p><strong>${listing.price.toLocaleString()}</strong> {listing.type === "rent" ? "/ month" : ""}</p>
      <Link href={`/listings/${listing.slug}`}>View details</Link>
      <small>{listing.bedrooms} bed • {listing.bathrooms} bath • {listing.sizeSqm} sqm</small>
    </article>
  );
}
