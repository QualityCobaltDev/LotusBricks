import Link from "next/link";
import Image from "next/image";

type ListingCardProps = {
  listing: {
    slug: string;
    title: string;
    summary: string;
    city: string;
    district: string;
    priceUsd: number;
    priceSuffix?: string | null;
    bedrooms: number;
    bathrooms: number;
    areaSqm: number;
    category?: string;
    furnishing?: string | null;
    availability?: string;
    featured: boolean;
    media?: { url: string }[];
  };
};

export function ListingCard({ listing }: ListingCardProps) {
  const image = listing.media?.[0]?.url ?? "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80";

  return (
    <article className="listing-card">
      <div className="listing-media-wrap">
        <Image src={image} alt={`${listing.title} in ${listing.district}, ${listing.city}`} loading="lazy" className="listing-media" width={640} height={420} />
        <span className="pill">Verified</span>
        {listing.featured && <span className="pill dark">Featured</span>}
      </div>
      <div className="listing-content">
        <p className="price">${listing.priceUsd.toLocaleString()}{listing.priceSuffix ?? ""}</p>
        <h3>{listing.title}</h3>
        <p className="muted">{listing.district}, {listing.city}</p>
        <p className="muted">{listing.summary}</p>
        <div className="meta-row">
          <span>{listing.bedrooms} bed</span>
          <span>{listing.bathrooms} bath</span>
          <span>{listing.areaSqm} sqm</span>
          {listing.category && <span>{listing.category.toLowerCase()}</span>}
        </div>
        {listing.availability && <p className="muted">Status: {listing.availability.replaceAll("_", " ").toLowerCase()}</p>}
        <div className="hero-actions">
          <Link href={`/listings/${listing.slug}` as any} className="btn btn-primary" data-cta="listing-view-details">View details</Link>
          <button className="btn btn-ghost" type="button" aria-label={`Save ${listing.title}`} data-cta="listing-save">Save</button>
        </div>
      </div>
    </article>
  );
}
