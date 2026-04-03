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
    verificationState?: string;
    lastReviewedAt?: Date | string | null;
    pricingUpdatedAt?: Date | string | null;
    mediaVerified?: boolean;
    docsReviewed?: boolean;
    locationConfirmed?: boolean;
    media?: { id?: string; kind?: string; url: string; thumbnail?: string | null; isPrimary?: boolean; sortOrder?: number; sourceType?: string | null }[];
  };
};

export function ListingCard({ listing }: ListingCardProps) {
  const media = normalizeListingMedia(listing.media, listing.title);
  const image = getCardThumbnail(media);
  const hasVideo = hasVideoMedia(media);

  const trustChecks = [listing.mediaVerified, listing.docsReviewed, listing.locationConfirmed].filter(Boolean).length;
  const reviewedLabel = listing.lastReviewedAt
    ? new Date(listing.lastReviewedAt).toISOString().slice(0, 10)
    : null;

  return (
    <article className="listing-card">
      <div className="listing-media-wrap">
        <Image src={image} alt={`${listing.title} in ${listing.district}, ${listing.city}`} loading="lazy" className="listing-media" width={640} height={420} />
        <span className="pill">{listing.verificationState ? listing.verificationState.replaceAll("_", " ").toLowerCase() : "verified"}</span>
        {listing.featured && <span className="pill dark">Featured</span>}
        <div className="media-badges">
          {hasVideo && <span className="pill subtle">Video</span>}
          {media.length > 1 && <span className="pill subtle">{media.length} media</span>}
          {trustChecks > 0 && <span className="pill subtle">{trustChecks}/3 trust checks</span>}
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
        <div className="trust-row">
          {reviewedLabel && <span>Reviewed: {reviewedLabel}</span>}
          {listing.pricingUpdatedAt && <span>Price updated</span>}
        </div>
        {listing.availability && <p className="muted">Status: {listing.availability.replaceAll("_", " ").toLowerCase()}</p>}
        <div className="hero-actions listing-actions">
          <Link href={`/listings/${listing.slug}` as any} className="btn btn-primary" data-cta="listing-view-details" data-track-event="click_browse_listings" data-track-label="listing-get-details">Get Details <span aria-hidden className="btn-arrow">→</span></Link>
          <Link href={`/listings/${listing.slug}` as any} className="btn btn-ghost" data-cta="listing-enquire" data-track-event="contact_form_start" data-track-label="listing-enquire-now">Enquire Now <span aria-hidden className="btn-arrow">→</span></Link>
        </div>
      </div>
    </article>
  );
}
