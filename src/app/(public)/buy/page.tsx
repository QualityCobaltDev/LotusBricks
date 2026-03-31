import { ListingGrid } from "@/components/marketplace/listing-grid";
import { getListings } from "@/lib/marketplace";

export default function BuyPage() {
  return <div className="grid" style={{ gap: "1rem" }}><h1>Buy Properties</h1><ListingGrid listings={getListings("buy")} /></div>;
}
