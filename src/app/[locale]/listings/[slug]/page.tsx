import Image from "next/image";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { InquiryForm } from "@/components/ui/inquiry-form";
import { ListingCard } from "@/components/ui/listing-card";
import { logServerError } from "@/lib/observability";
import { Prisma } from "@prisma/client";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

const asStringArray = (value: Prisma.JsonValue | null | undefined) =>
  Array.isArray(value) ? value.map((item) => String(item)) : [];

type Props = { params: Promise<{ slug: string; locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const listing = await db.listing.findUnique({ where: { slug } });
  const t = await getTranslations("listingDetail");
  if (!listing) return { title: t("notFound") };

  return {
    title: listing.seoTitle ?? `${listing.title} | ${listing.city}`,
    description: listing.seoDescription ?? listing.summary,
    alternates: { canonical: `/listings/${slug}` },
    openGraph: {
      title: listing.seoTitle ?? listing.title,
      description: listing.seoDescription ?? listing.summary,
      images: listing.openGraphImage ? [listing.openGraphImage] : undefined
    }
  };
}

export default async function ListingDetail({ params }: Props) {
  const { slug } = await params;
  const t = await getTranslations("listingDetail");

  let listing: Prisma.ListingGetPayload<{ include: { media: true } }> | null = null;
  let similar: Prisma.ListingGetPayload<{ include: { media: true } }>[] = [];

  try {
    listing = await db.listing.findUnique({ where: { slug }, include: { media: { orderBy: { sortOrder: "asc" } } } });

    if (listing) {
      const seededSimilar = asStringArray(listing.similarListings);
      const mapped = await db.listing.findMany({
        where: { status: "PUBLISHED", slug: { in: seededSimilar }, id: { not: listing.id } },
        include: { media: true },
        take: 3
      });

      if (mapped.length >= 3) {
        similar = mapped;
      } else {
        similar = await db.listing.findMany({
          where: { status: "PUBLISHED", id: { not: listing.id }, listingType: listing.listingType, OR: [{ category: listing.category }, { district: listing.district }] },
          include: { media: true },
          take: 3
        });
      }
    }
  } catch (error) {
    logServerError("listing-detail", error, { slug });
  }

  if (!listing || listing.status !== "PUBLISHED") return notFound();

  const gallery = listing.media.filter((m) => m.kind === "image");
  const videos = listing.media.filter((m) => m.kind === "video");

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

  const ld = listing.structuredData ?? {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: listing.title,
    description: listing.summary,
    offers: { "@type": "Offer", price: listing.priceUsd, priceCurrency: listing.currency || "USD" }
  };

  return (
    <section className="shell section">
      <nav aria-label="Breadcrumb"><p><Link href="/">{t("home")}</Link> / <Link href="/listings">{t("listings")}</Link> / <span>{listing.title}</span></p></nav>
      <div className="detail-head">
        <div>
          <div className="hero-actions" style={{ marginBottom: ".4rem" }}>
            {badges.map((badge) => <span className="pill" key={badge} style={{ position: "static" }}>{badge}</span>)}
          </div>
          <h1>{listing.title}</h1>
          <p className="muted">{listing.streetAddress ?? listing.district}, {listing.district}, {listing.city}, {listing.country}</p>
          <p>{listing.heroDescription ?? listing.summary}</p>
        </div>
        <p className="price">${listing.priceUsd.toLocaleString()}{listing.priceSuffix ?? ""}</p>
      </div>

      <div className="detail-layout">
        <div>
          <Image src={gallery[0]?.url ?? "/media/fallbacks/property-placeholder.jpg"} alt={gallery[0]?.alt ?? listing.title} className="detail-hero" width={1200} height={720} priority />
          <div className="hero-actions">
            <button className="btn btn-primary" type="button">{t("enquireNow")}</button>
            <a className="btn btn-ghost" href="https://wa.me/85511389625">{t("whatsapp")}</a>
            <a className="btn btn-ghost" href="https://t.me/">{t("telegram")}</a>
            <a className="btn btn-ghost" href="tel:+85511389625">{t("callNow")}</a>
          </div>
          <div className="thumb-row">
            {gallery.slice(1, 5).map((m) => <Image key={m.id} src={m.url} alt={m.alt ?? `${listing.title} gallery`} className="thumb" loading="lazy" width={240} height={140} />)}
          </div>
          <div className="spec-grid">
            <article><strong>{listing.bedrooms || t("na")}</strong><span>{t("bedrooms")}</span></article>
            <article><strong>{listing.bathrooms || t("na")}</strong><span>{t("bathrooms")}</span></article>
            <article><strong>{listing.areaSqm}</strong><span>{t("floorSqm")}</span></article>
            <article><strong>{listing.landAreaSqm ?? t("na")}</strong><span>{t("landSqm")}</span></article>
          </div>

          <article className="card-pad">
            <h2>{t("overview")}</h2>
            <p>{listing.description}</p>
            <p>{listing.fullDescription}</p>
          </article>

          <article className="card-pad section">
            <h2>{t("propertyDetails")}</h2>
            <ul className="check-list">
              <li>{t("listingType", { value: listing.listingType.toLowerCase() })}</li>
              <li>{t("category", { value: listing.category.toLowerCase() })}</li>
              <li>{t("furnishing", { value: listing.furnishing.replaceAll("_", " ").toLowerCase() })}</li>
              <li>{t("titleType", { value: listing.titleType ?? t("onRequest") })}</li>
              <li>{t("orientation", { value: listing.orientation ?? t("onRequest") })}</li>
              <li>{t("condition", { value: listing.propertyCondition ?? t("onRequest") })}</li>
              <li>{t("parking", { value: listing.parkingSpaces ?? 0 })}</li>
              <li>{t("viewing", { value: listing.viewingAvailability ?? t("byAppointment") })}</li>
            </ul>
          </article>

          <article className="card-pad section">
            <h2>{t("featuresAmenities")}</h2>
            <div className="two-col">
              <div><h3>{t("coreFeatures")}</h3><ul className="check-list">{features.map((x) => <li key={x}>{x}</li>)}</ul></div>
              <div><h3>{t("indoorFeatures")}</h3><ul className="check-list">{indoorFeatures.map((x) => <li key={x}>{x}</li>)}</ul></div>
              <div><h3>{t("outdoorFeatures")}</h3><ul className="check-list">{outdoorFeatures.map((x) => <li key={x}>{x}</li>)}</ul></div>
              <div><h3>{t("securityFeatures")}</h3><ul className="check-list">{securityFeatures.map((x) => <li key={x}>{x}</li>)}</ul></div>
            </div>
            {lifestyleFeatures.length > 0 && <><h3>{t("lifestyleHighlights")}</h3><ul className="check-list">{lifestyleFeatures.map((x) => <li key={x}>{x}</li>)}</ul></>}
          </article>

          <article className="card-pad section">
            <h2>{t("gallery")}</h2>
            <div className="thumb-row" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
              {gallery.map((m) => <Image key={m.id} src={m.url} alt={m.alt ?? `${listing.title} image`} className="thumb" width={280} height={180} />)}
            </div>
          </article>

          <article className="card-pad section">
            <h2>{t("videoTours")}</h2>
            <div className="two-col">
              {videos.map((v) => (
                <div key={v.id}>
                  <video controls preload="metadata" poster={v.thumbnail ?? undefined} style={{ width: "100%", borderRadius: "12px" }}>
                    <source src={v.url} type="video/mp4" />
                  </video>
                  <p><strong>{v.title}</strong><br />{v.description}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="card-pad section">
            <h2>{t("neighborhoodHighlights")}</h2>
            <p>{listing.neighborhoodSummary}</p>
            <ul className="check-list">{neighborhoodBenefits.map((x) => <li key={x}>{x}</li>)}</ul>
          </article>

          <article className="card-pad section">
            <h2>{t("investmentSuitability")}</h2>
            <h3>{t("idealFor")}</h3>
            <ul className="check-list">{idealFor.map((x) => <li key={x}>{x}</li>)}</ul>
            <h3>{t("keySellingPoints")}</h3>
            <ul className="check-list">{keySellingPoints.map((x) => <li key={x}>{x}</li>)}</ul>
            <h3>{t("investmentHighlights")}</h3>
            <ul className="check-list">{investmentHighlights.map((x) => <li key={x}>{x}</li>)}</ul>
          </article>

          <article className="card-pad section">
            <h2>{t("paymentTerms")}</h2>
            <ul className="check-list">
              <li>{t("depositTerms", { value: listing.depositTerms ?? t("onRequest") })}</li>
              <li>{t("paymentTermsLabel", { value: listing.paymentTerms ?? t("onRequest") })}</li>
              <li>{t("serviceFees", { value: listing.serviceFees ?? t("onRequest") })}</li>
              <li>{t("annualManagementFee", { value: listing.annualManagementFee ?? t("onRequest") })}</li>
              <li>{t("negotiable", { value: listing.negotiable ? t("yes") : t("no") })}</li>
            </ul>
          </article>
        </div>

        <aside className="sticky-card">
          <h3>{t("enquiryCard")}</h3>
          <p className="muted">{listing.agentName} · {listing.agentRole}</p>
          <p className="muted">{t("phone")}: <a href="tel:+85511389625">(+855) 011 389 625</a></p>
          <p className="muted">{t("email")}: <a href="mailto:contact@rightbricks.online">contact@rightbricks.online</a></p>
          <p className="muted">{t("whatsappAvailable")}</p>
          <a className="btn btn-accent" href="tel:+85511389625" style={{ width: "100%", marginBottom: ".75rem" }}>{t("scheduleViewing")}</a>
          <h3>{t("contactEnquiryForm")}</h3>
          <InquiryForm listingId={listing.id} compact initialMessage={`Hello RightBricks, I am interested in ${listing.title}. Please share more details and viewing availability.`} />
        </aside>
      </div>

      {similar.length > 0 && (
        <div className="section">
          <h2>{t("similarListings")}</h2>
          <div className="listing-grid">
            {similar.map((item) => <ListingCard key={item.id} listing={item} />)}
          </div>
        </div>
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </section>
  );
}
