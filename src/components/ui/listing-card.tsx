"use client";

import Link from "next/link";
import Image from "next/image";
import { getCardThumbnail, hasVideoMedia, normalizeListingMedia } from "@/lib/listing-media";

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
    media?: { id?: string; kind?: string; url: string; thumbnail?: string | null; isPrimary?: boolean; sortOrder?: number; sourceType?: string | null }[];
  };
};

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80";

function isLikelyMediaUrl(url?: string | null) {
  if (!url) return false;
  return url.startsWith("/") || /^https?:\/\//i.test(url);
}

export function ListingCard({ listing }: ListingCardProps) {
  const media = normalizeListingMedia(listing.media, listing.title);
  const image = getCardThumbnail(media);
  const hasVideo = hasVideoMedia(media);

  return (
    <article className="listing-card">
      <div className="listing-media-wrap">
        <Image src={image} alt={`${listing.title} in ${listing.district}, ${listing.city}`} loading="lazy" className="listing-media" width={640} height={420} />
        <span className="pill">Verified</span>
        {listing.featured && <span className="pill dark">Featured</span>}
        <div className="media-badges">
          {hasVideo && <span className="pill subtle">Video</span>}
          {media.length > 1 && <span className="pill subtle">{media.length} media</span>}
        </div>
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
          <Link href={`/listings/${listing.slug}` as any} className="btn btn-ghost" data-cta="listing-enquire">Enquire</Link>
        </div>
      </div>
    </article>
  );
}
