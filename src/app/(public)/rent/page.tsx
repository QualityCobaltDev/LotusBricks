import { ListingGrid } from "@/components/marketplace/listing-grid";
import { getListingsByMode } from "@/lib/db";

export default function RentPage() {
  return (
    <section>
      <h1>Rent Properties</h1>
      <p>Find short and long-term rentals in top neighborhoods.</p>
      <ListingGrid listings={getListingsByMode("rent")} ctaLabel="Request viewing" />
    </section>
  );
}
