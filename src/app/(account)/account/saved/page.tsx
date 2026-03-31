import { ListingGrid } from "@/components/marketplace/listing-grid";
import { getListingsByMode } from "@/lib/db";

export default function SavedPage() {
  return (
    <section>
      <h1>Saved properties</h1>
      <ListingGrid listings={[...getListingsByMode("buy"), ...getListingsByMode("rent")]} ctaLabel="Resume inquiry" />
    </section>
  );
}
