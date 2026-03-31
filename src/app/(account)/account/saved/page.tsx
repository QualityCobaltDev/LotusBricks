import { ListingGrid } from "@/components/marketplace/listing-grid";
import { getListings } from "@/lib/marketplace";

export default function SavedPage() {
  return (
    <section>
      <h1>Saved properties</h1>
      <ListingGrid listings={[...getListings("buy"), ...getListings("rent")]} />
    </section>
  );
}
