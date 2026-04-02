"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";

type ListingMedia = {
  url: string;
  kind?: string | null;
  thumbnail?: string | null;
};

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
    media?: ListingMedia[];
  };
};

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80";

function isLikelyMediaUrl(url?: string | null) {
  if (!url) return false;
  return url.startsWith("/") || /^https?:\/\//i.test(url);
}

function getCardImage(media: ListingMedia[] | undefined) {
  const image = media?.find((item) => item.kind?.toLowerCase() === "image" && isLikelyMediaUrl(item.url));
  if (image?.url) return image.url;

  const poster = media?.find((item) => item.kind?.toLowerCase() === "video" && isLikelyMediaUrl(item.thumbnail))?.thumbnail;
  if (poster) return poster;

  const firstValid = media?.find((item) => isLikelyMediaUrl(item.url))?.url;
  return firstValid ?? FALLBACK_IMAGE;
}

function ListingThumbnail({ title, district, city, imageUrl }: { title: string; district: string; city: string; imageUrl: string }) {
  const [imageFailed, setImageFailed] = useState(false);
  const hasImage = !imageFailed && isLikelyMediaUrl(imageUrl);

  if (!hasImage) {
    return (
      <div className="listing-media-fallback" aria-label="Listing media placeholder" role="img">
        <span className="listing-media-fallback-mark">RightBricks</span>
        <strong>Verified listing media</strong>
        <span>{district}, {city}</span>
      </div>
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={`${title} in ${district}, ${city}`}
      loading="lazy"
      className="listing-media"
      fill
      sizes="(max-width: 720px) 100vw, (max-width: 1200px) 50vw, 33vw"
      onError={() => setImageFailed(true)}
    />
  );
}

export function ListingCard({ listing }: ListingCardProps) {
  const media = listing.media ?? [];
  const image = useMemo(() => getCardImage(media), [media]);
  const hasVideo = media.some((item) => item.kind?.toLowerCase() === "video");
  const mediaCount = media.length;

  return (
    <article className="listing-card">
      <div className="listing-media-wrap">
        <ListingThumbnail title={listing.title} district={listing.district} city={listing.city} imageUrl={image} />
        <div className="listing-badge-row">
          <span className="pill">Verified</span>
          <div className="listing-badge-cluster">
            {hasVideo && <span className="pill dark video-pill">Video</span>}
            {listing.featured && <span className="pill dark">Featured</span>}
          </div>
        </div>
        {mediaCount > 1 && <span className="media-count-pill">{mediaCount} media</span>}
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
