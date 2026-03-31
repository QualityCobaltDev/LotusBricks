import { ListingCard } from "@/components/marketplace/listing-card";
import type { Listing } from "@/lib/marketplace";

export function ListingGrid({ listings }: { listings: Listing[] }) {
  if (!listings.length) return <p className="card card-body">No listings found for this filter yet.</p>;

  return (
    <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))" }}>
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
