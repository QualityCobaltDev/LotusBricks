import Link from "next/link";
import { ListingGrid } from "@/components/marketplace/listing-grid";
import { Button } from "@/components/ui/button";
import { getListingsByMode } from "@/lib/db";
import { routes } from "@/lib/routes";

export default function HomePage() {
  const featured = getListingsByMode("buy");

  return (
    <div className="grid" style={{ gap: "1.5rem" }}>
      <section className="card card-body">
        <h1 style={{ marginTop: 0 }}>Find your next property with confidence</h1>
        <p>Browse, rent, sell, and manage listings from a clean production-grade platform architecture.</p>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Link href={routes.buy}><Button>Browse homes</Button></Link>
          <Link href={routes.pricing}><Button variant="outline">View pricing</Button></Link>
        </div>
      </section>
      <section>
        <h2>Featured listings</h2>
        <ListingGrid listings={featured} />
      </section>
    </div>
  );
}
