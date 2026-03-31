import type { Listing } from "@/lib/db";
import { ListingCard } from "@/components/marketplace/listing-card";

export function ListingGrid({ listings, ctaLabel }: { listings: Listing[]; ctaLabel?: string }) {
  return (
    <div className="grid cards">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} ctaLabel={ctaLabel} />
      ))}
    </div>
  );
}
