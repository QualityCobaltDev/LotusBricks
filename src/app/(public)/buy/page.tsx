import { ListingGrid } from "@/components/marketplace/listing-grid";
import { getListingsByMode } from "@/lib/db";

export default function BuyPage() {
  return (
    <section>
      <h1>Buy Properties</h1>
      <p>Explore market-ready homes with transparent pricing and guided support.</p>
      <ListingGrid listings={getListingsByMode("buy")} ctaLabel="Book tour" />
    </section>
  );
}
