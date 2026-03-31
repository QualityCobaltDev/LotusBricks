import { notFound } from "next/navigation";
import { getListingBySlug, getListings } from "@/lib/marketplace";
import { ListingGrid } from "@/components/marketplace/listing-grid";

export default async function ListingDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const listing = getListingBySlug(slug);
  if (!listing) notFound();

  const related = getListings(listing.type).filter((item) => item.slug !== listing.slug).slice(0, 3);

  return (
    <div className="grid" style={{ gap: "1rem" }}>
      <h1>{listing.title}</h1>
      <img src={listing.images[0]} alt={listing.title} className="listing-image" />
      <p>{listing.description}</p>
      <p><strong>${listing.price.toLocaleString()}</strong> {listing.type === "rent" ? "/ month" : ""}</p>
      <p>{listing.address}, {listing.district}, {listing.city}</p>
      <p>{listing.bedrooms} bedrooms • {listing.bathrooms} bathrooms • {listing.sizeSqm} sqm</p>
      <h2>Related listings</h2>
      <ListingGrid listings={related} />
    </div>
  );
}
