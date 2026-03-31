import Link from "next/link";
import { ListingGrid } from "@/components/marketplace/listing-grid";
import { Button } from "@/components/ui/button";
import { getFeaturedListings } from "@/lib/marketplace";
import { routes } from "@/lib/routes";

export default function HomePage() {
  const featured = getFeaturedListings();

  return (
    <div className="grid" style={{ gap: "1.5rem" }}>
      <section className="card card-body">
        <h1 style={{ marginTop: 0 }}>Cambodia real estate, rebuilt for trust and speed</h1>
        <p>RightBricks helps buyers, renters, landlords, sellers, and developers close faster with verified listings and responsive support.</p>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link href={routes.buy}><Button>Browse homes</Button></Link>
          <Link href={routes.rent}><Button variant="outline">Find rentals</Button></Link>
          <Link href={routes.pricing}><Button variant="outline">View listing plans</Button></Link>
        </div>
      </section>

      <section>
        <h2>Featured listings</h2>
        <ListingGrid listings={featured} />
      </section>
    </div>
  );
}
