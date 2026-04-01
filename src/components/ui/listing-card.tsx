import Link from "next/link";

type ListingCardProps = {
  listing: {
    slug: string;
    title: string;
    city: string;
    district: string;
    priceUsd: number;
    bedrooms: number;
    bathrooms: number;
    areaSqm: number;
    featured: boolean;
    media?: { url: string }[];
  };
};

export function ListingCard({ listing }: ListingCardProps) {
  const image = listing.media?.[0]?.url ?? "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80";

  return (
    <article className="listing-card">
      <div className="listing-media-wrap">
        <img src={image} alt={listing.title} loading="lazy" className="listing-media" />
        <span className="pill">Verified</span>
        {listing.featured && <span className="pill dark">Featured</span>}
      </div>
      <div className="listing-content">
        <p className="price">${listing.priceUsd.toLocaleString()}</p>
        <h3>{listing.title}</h3>
        <p className="muted">{listing.district}, {listing.city}</p>
        <div className="meta-row">
          <span>{listing.bedrooms} bed</span>
          <span>{listing.bathrooms} bath</span>
          <span>{listing.areaSqm} sqm</span>
        </div>
        <Link href={`/listings/${listing.slug}` as any} className="btn btn-primary">View details</Link>
      </div>
    </article>
  );
}
