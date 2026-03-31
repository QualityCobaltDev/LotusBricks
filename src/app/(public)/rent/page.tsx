import { ListingGrid } from "@/components/marketplace/listing-grid";
import { getListings } from "@/lib/marketplace";

export default function RentPage() {
  return <div className="grid" style={{ gap: "1rem" }}><h1>Rent Properties</h1><ListingGrid listings={getListings("rent")} /></div>;
}
