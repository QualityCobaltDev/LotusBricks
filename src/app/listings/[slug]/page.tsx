import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { db, isDatabaseConfigured } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { InquiryForm } from "@/components/ui/inquiry-form";
import { ListingCard } from "@/components/ui/listing-card";
import { logServerError } from "@/lib/observability";
import { Prisma } from "@prisma/client";
import { getPrimaryMedia, normalizeListingMedia, hasVideoMedia, MEDIA_FALLBACK_IMAGE, getYouTubeEmbedUrl } from "@/lib/listing-media";
import { getSession } from "@/lib/auth";
import { normalizeListingSlug } from "@/lib/listing-slug";
import { resolveListingSlug } from "@/lib/listing-routing";
import { getVerificationReadiness } from "@/lib/listing-validation";
import { buildBreadcrumbJsonLd, buildPageTitle } from "@/lib/metadata";
import { getCanonicalSiteUrl } from "@/lib/env";

const asStringArray = (value: Prisma.JsonValue | null | undefined) =>
  Array.isArray(value) ? value.map((item) => String(item)) : [];

type Props = { params: Promise<{ slug: string }> };
export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isDatabaseConfigured()) {
    return { title: "Listing" };
  }

  const { slug: rawSlug } = await params;
  const slug = normalizeListingSlug(rawSlug);
  if (!slug) return { title: "Listing not found" };
  let listing: { title: string; city: string; seoTitle: string | null; seoDescription: string | null; summary: string; openGraphImage: string | null; slug: string } | null = null;

  try {
    const resolved = await resolveListingSlug(slug);
    if (!resolved) return { title: "Listing not found" };
    listing = await db.listing.findUnique({ where: { slug: resolved.slug } });
  } catch (error) {
    logServerError("listing-metadata", error, { slug });
  }

  if (!listing) return { title: "Listing not found" };

  const metadataTitle = buildPageTitle(listing.seoTitle ?? `${listing.title} ${listing.city ? `in ${listing.city}` : ""}`.trim());
  const metadataDescription = listing.seoDescription ?? listing.summary;

  return {
    title: metadataTitle,
    description: metadataDescription,
    alternates: { canonical: `/listings/${listing.slug}` },
    openGraph: {
      title: metadataTitle,
      description: metadataDescription,
      url: `${getCanonicalSiteUrl()}/listings/${listing.slug}`,
      type: "website",
      images: listing.openGraphImage ? [listing.openGraphImage] : undefined
    },
    twitter: {
      card: "summary_large_image",
      title: metadataTitle,
      description: metadataDescription,
      images: listing.openGraphImage ? [listing.openGraphImage] : undefined
    }
  };
}

export default async function ListingDetail({
  params,
  searchParams
}: Props & { searchParams?: Promise<{ preview?: string }> }) {
  const { slug } = await params;
  const normalizedSlug = normalizeListingSlug(slug);
  if (!normalizedSlug) return notFound();
  const resolved = await resolveListingSlug(normalizedSlug);
  if (!resolved) return notFound();
  if (resolved.redirectFromLegacy) redirect(`/listings/${resolved.slug}`);
  const previewParams = searchParams ? await searchParams : undefined;

  let listing: Prisma.ListingGetPayload<{ include: { media: true } }> | null = null;
  let similar: Prisma.ListingGetPayload<{ include: { media: true } }>[] = [];

  try {
    listing = await db.listing.findUnique({ where: { slug: resolved.slug }, include: { media: { orderBy: { sortOrder: "asc" } } } });

    if (listing) {
      const seededSimilar = asStringArray(listing.similarListings);
      const mapped = await db.listing.findMany({
        where: {
          status: "PUBLISHED",
          slug: { in: seededSimilar },
          id: { not: listing.id }
        },
        include: { media: true },
        take: 3
      });

      if (mapped.length >= 3) {
        similar = mapped;
      } else {
        similar = await db.listing.findMany({
          where: {
            status: "PUBLISHED",
            id: { not: listing.id },
            listingType: listing.listingType,
            OR: [{ category: listing.category }, { district: listing.district }]
          },
          include: { media: true },
          take: 3
        });
      }
    }
  } catch (error) {
    logServerError("listing-detail", error, { slug });
  }

  if (!listing) return notFound();
  if (listing.status !== "PUBLISHED") {
    const session = await getSession();
    const previewAllowed = previewParams?.preview === "1" && session?.role === "ADMIN";
    if (!previewAllowed) return notFound();
  }

  const normalizedMedia = normalizeListingMedia(listing.media, listing.title);
  const videos = normalizedMedia.filter((m) => m.type === "video");
  const primary = getPrimaryMedia(normalizedMedia);
  const readiness = getVerificationReadiness({ ...listing, mediaCount: normalizedMedia.length });

  const keySellingPoints = asStringArray(listing.keySellingPoints);
  const idealFor = asStringArray(listing.idealFor);
  const neighborhoodBenefits = asStringArray(listing.neighborhoodBenefits);
  const investmentHighlights = asStringArray(listing.investmentHighlights);
  const features = asStringArray(listing.features);
  const indoorFeatures = asStringArray(listing.indoorFeatures);
  const outdoorFeatures = asStringArray(listing.outdoorFeatures);
  const securityFeatures = asStringArray(listing.securityFeatures);
  const lifestyleFeatures = asStringArray(listing.lifestyleFeatures);
  const badges = asStringArray(listing.badges);

  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Listings", path: "/listings" },
    { name: listing.title, path: `/listings/${listing.slug}` }
  ]);

  const canonicalUrl = `${getCanonicalSiteUrl()}/listings/${listing.slug}`;

  const ld: Record<string, unknown> =
    listing.structuredData && typeof listing.structuredData === "object" && !Array.isArray(listing.structuredData)
      ? listing.structuredData as Record<string, unknown>
      : {
          "@context": "https://schema.org",
          "@type": "RealEstateListing",
          name: listing.title,
          description: listing.summary,
          offers: { "@type": "Offer", price: listing.priceUsd, priceCurrency: listing.currency || "USD" }
        };

  return (
    <section className="shell section">
      <nav aria-label="Breadcrumb"><p><Link href="/">Home</Link> / <Link href="/listings">Listings</Link> / <span>{listing.title}</span></p></nav>
      <div className="detail-head">
        <div>
          <div className="hero-actions" style={{ marginBottom: ".4rem" }}>
            {badges.map((badge) => <span className="pill" key={badge} style={{ position: "static" }}>{badge}</span>)}
          </div>
          <h1>{listing.title}</h1>
          <p className="muted">{[listing.streetAddress, listing.district, listing.city, listing.country].filter(Boolean).join(", ")}</p>
          <p>{listing.heroDescription ?? listing.summary}</p>
          <div className="trust-row">
            <span>Verification: {listing.verificationState.replaceAll("_", " ").toLowerCase()}</span>
            <span>Readiness: {readiness.score}%</span>
            <span>Last reviewed: {listing.lastReviewedAt ? listing.lastReviewedAt.toISOString().slice(0, 10) : "Pending"}</span>
          </div>
        </div>
        <p className="price">${listing.priceUsd.toLocaleString()} {listing.priceFrequency !== "TOTAL" ? `/${listing.priceFrequency.toLowerCase()}` : ""}</p>
        {hasVideoMedia(normalizedMedia) && <p className="muted">Includes video tour</p>}
      </div>

      <div className="detail-layout">
        <div>
          <Image src={primary?.posterUrl ?? primary?.url ?? MEDIA_FALLBACK_IMAGE} alt={primary?.altText ?? listing.title} className="detail-hero" width={1200} height={720} priority />
          <div className="hero-actions detail-cta-row">
            <a className="btn btn-primary" href="#listing-enquiry" data-track-event="listing_enquiry_start" data-track-label="detail-enquire-now">Enquire Now</a>
            <a className="btn btn-ghost" href="#listing-enquiry" data-track-event="listing_enquiry_start" data-track-label="detail-get-details">Get Details</a>
            <a className="btn btn-ghost" href="tel:+85511389625" data-track-event="call_click" data-track-label="detail-schedule-viewing">Schedule Viewing</a>
            <a className="btn btn-ghost" href="https://wa.me/85511389625" data-track-event="whatsapp_click" data-track-label="detail-whatsapp">WhatsApp</a>
          </div>
          <div className="thumb-row">
            {normalizedMedia.slice(1, 5).map((m) => m.type === "image" ? (<Image key={m.id ?? m.url} src={m.url} alt={m.altText} className="thumb" loading="lazy" width={240} height={140} />) : (<div key={m.id ?? m.url} className="thumb video-thumb">▶ Video</div>))}
          </div>
          <div className="spec-grid">
            <article><strong>{listing.bedrooms}</strong><span>Bedrooms</span></article>
            <article><strong>{listing.bathrooms}</strong><span>Bathrooms</span></article>
            <article><strong>{listing.areaSqm}</strong><span>Floor sqm</span></article>
            <article><strong>{listing.landAreaSqm ?? "N/A"}</strong><span>Land sqm</span></article>
          </div>

          <article className="card-pad">
            <h2>Overview</h2>
            <p>{listing.description}</p>
            <p>{listing.fullDescription}</p>
          </article>

          <article className="card-pad section">
            <h2>Property details</h2>
            <ul className="check-list">
              <li>Listing type: {listing.listingType.toLowerCase()}</li>
              <li>Category: {listing.category.toLowerCase()}</li>
              <li>Furnishing: {listing.furnishing.replaceAll("_", " ").toLowerCase()}</li>
              {listing.titleType && <li>Title type: {listing.titleType}</li>}
              {listing.orientation && <li>Orientation: {listing.orientation}</li>}
              {listing.propertyCondition && <li>Condition: {listing.propertyCondition}</li>}
              {typeof listing.parkingSpaces === "number" && <li>Parking: {listing.parkingSpaces}</li>}
              {listing.viewingAvailability && <li>Viewing: {listing.viewingAvailability}</li>}
            </ul>
          </article>

          <article className="card-pad section">
            <h2>Features & amenities</h2>
            <div className="two-col">
              <div><h3>Core features</h3><ul className="check-list">{features.map((x) => <li key={x}>{x}</li>)}</ul></div>
              <div><h3>Indoor features</h3><ul className="check-list">{indoorFeatures.map((x) => <li key={x}>{x}</li>)}</ul></div>
              <div><h3>Outdoor features</h3><ul className="check-list">{outdoorFeatures.map((x) => <li key={x}>{x}</li>)}</ul></div>
              <div><h3>Security features</h3><ul className="check-list">{securityFeatures.map((x) => <li key={x}>{x}</li>)}</ul></div>
            </div>
            {lifestyleFeatures.length > 0 && <><h3>Lifestyle highlights</h3><ul className="check-list">{lifestyleFeatures.map((x) => <li key={x}>{x}</li>)}</ul></>}
          </article>

          <article className="card-pad section">
            <h2>Gallery</h2>
            <div className="thumb-row" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
              {normalizedMedia.length ? normalizedMedia.map((m) => m.type === "image" ? (<Image key={m.id ?? m.url} src={m.url} alt={m.altText} className="thumb" width={280} height={180} />) : (<div key={m.id ?? m.url} className="thumb video-thumb">▶ Video Tour</div>)) : <div className="media-fallback-panel">Curated media is being prepared for this listing.</div>}
            </div>
          </article>

          <article className="card-pad section">
            <h2>Video tours</h2>
            <div className="two-col">
              {videos.length ? videos.map((v) => {
                const embedUrl = getYouTubeEmbedUrl(v.url);
                if (!embedUrl) return null;
                return (
                  <div key={v.id ?? v.url}>
                    <iframe
                      src={embedUrl}
                      title={v.title ?? `${listing.title} video tour`}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                      style={{ width: "100%", borderRadius: "12px", aspectRatio: "16 / 9", border: 0 }}
                    />
                    <p><strong>{v.title ?? "Property tour"}</strong><br />{v.description ?? "Curated walkthrough"}</p>
                  </div>
                );
              }) : <p className="muted">This listing currently has no video media.</p>}
            </div>
          </article>

          {(listing.neighborhoodSummary || neighborhoodBenefits.length > 0) && <article className="card-pad section">
            <h2>Neighborhood / location highlights</h2>
            {listing.neighborhoodSummary && <p>{listing.neighborhoodSummary}</p>}
            {neighborhoodBenefits.length > 0 && <ul className="check-list">{neighborhoodBenefits.map((x) => <li key={x}>{x}</li>)}</ul>}
          </article>}

          <article className="card-pad section">
            <h2>Investment or lifestyle suitability</h2>
            <h3>Ideal for</h3>
            <ul className="check-list">{idealFor.map((x) => <li key={x}>{x}</li>)}</ul>
            <h3>Key selling points</h3>
            <ul className="check-list">{keySellingPoints.map((x) => <li key={x}>{x}</li>)}</ul>
            <h3>Investment highlights</h3>
            <ul className="check-list">{investmentHighlights.map((x) => <li key={x}>{x}</li>)}</ul>
          </article>


          <article className="card-pad section verification-module">
            <h2>Verification summary</h2>
            <p className="muted">Verification state: <strong>{listing.verificationState.replaceAll("_", " ").toLowerCase()}</strong> · Readiness score: <strong>{readiness.score}%</strong></p>
            <ul className="check-list">
              <li>Media verified: {listing.mediaVerified ? "Yes" : "No"}</li>
              <li>Ownership/documentation reviewed: {listing.docsReviewed ? "Yes" : "No"}</li>
              <li>Location confirmed: {listing.locationConfirmed ? "Yes" : "No"}</li>
              <li>Pricing last updated: {listing.pricingUpdatedAt ? listing.pricingUpdatedAt.toISOString().slice(0, 10) : "Not provided"}</li>
              <li>Last reviewed date: {listing.lastReviewedAt ? listing.lastReviewedAt.toISOString().slice(0, 10) : "Not provided"}</li>
            </ul>
            <p className="muted">How to read this: verification checks are completed by RightBricks operations before a listing is prioritized in search and outreach.</p>
          </article>

          <article className="card-pad section">
            <h2>Payment / rental terms</h2>
            <ul className="check-list">
              {listing.depositTerms && <li>Deposit terms: {listing.depositTerms}</li>}
              {listing.paymentTerms && <li>Payment terms: {listing.paymentTerms}</li>}
              {listing.serviceFees && <li>Service fees: {listing.serviceFees}</li>}
              {listing.annualManagementFee && <li>Annual management fee: {listing.annualManagementFee}</li>}
              <li>Negotiable: {listing.negotiable ? "Yes" : "No"}</li>
            </ul>
          </article>
        </div>

        <aside id="listing-enquiry" className="sticky-card">
          <h3>Speak with a property specialist</h3>
          <p className="muted">{listing.agentName} · {listing.agentRole}</p>
          <p className="muted">Phone: <a href="tel:+85511389625">(+855) 011 389 625</a></p>
          <p className="muted">Email: <a href="mailto:contact@rightbricks.online">contact@rightbricks.online</a></p>
          <p className="muted">Direct contact. No obligation. Fast response during business hours.</p>
          <div className="sticky-quick-actions">
            <a className="btn btn-accent" href="tel:+85511389625" style={{ width: "100%", marginBottom: ".75rem" }} data-track-event="call_click" data-track-label="aside-call">Schedule a viewing</a>
            <a className="btn btn-outline" href="mailto:contact@rightbricks.online" style={{ width: "100%", marginBottom: ".75rem" }} data-track-event="email_click" data-track-label="detail-email">Get details by email</a>
          </div>
          <h3>Contact / enquiry form</h3>
          <InquiryForm listingId={listing.id} compact initialMessage={`Hello RightBricks, I am interested in ${listing.title}. Please share more details and viewing availability.`} />
        </aside>
      </div>

      {similar.length > 0 && (
        <div className="section">
          <h2>Similar listings</h2>
          <div className="listing-grid">
            {similar.map((item) => <ListingCard key={item.id} listing={item} />)}
          </div>
        </div>
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ ...ld, url: canonicalUrl }) }} />
    </section>
  );
}
