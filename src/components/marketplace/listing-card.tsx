import Link from "next/link";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Listing } from "@/lib/db";
import { currency } from "@/lib/utils";

export function ListingCard({ listing, ctaLabel = "View details" }: { listing: Listing; ctaLabel?: string }) {
  return (
    <Card>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${listing.image}?auto=format&fit=crop&w=600&q=80`} alt={listing.title} style={{ width: "100%", height: 180, objectFit: "cover" }} />
      <CardBody>
        <h3 style={{ marginTop: 0 }}>{listing.title}</h3>
        <p style={{ margin: "0.3rem 0", color: "#475467" }}>{listing.location}</p>
        <p style={{ margin: "0.3rem 0 1rem" }}>{listing.price > 0 ? currency(listing.price) : "Custom quote"}</p>
        <Link href="/contact">
          <Button>{ctaLabel}</Button>
        </Link>
      </CardBody>
    </Card>
  );
}
