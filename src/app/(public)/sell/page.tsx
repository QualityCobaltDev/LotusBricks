import Link from "next/link";
import { ListingGrid } from "@/components/marketplace/listing-grid";
import { Button } from "@/components/ui/button";
import { getListingsByMode } from "@/lib/db";
import { routes } from "@/lib/routes";

export default function SellPage() {
  return (
    <section className="grid" style={{ gap: "1rem" }}>
      <h1>Sell With LotusBricks</h1>
      <p>Launch your listing with premium media support and admin workflows.</p>
      <Link href={`${routes.contact}?inquiry=sell`}><Button>Start selling</Button></Link>
      <ListingGrid listings={getListingsByMode("sell")} ctaLabel="Contact advisor" />
    </section>
  );
}
