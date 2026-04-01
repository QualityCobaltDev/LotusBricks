import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { InquiryForm } from "@/components/ui/inquiry-form";
import { ListingCard } from "@/components/ui/listing-card";
import { logServerError } from "@/lib/observability";
import { Prisma } from "@prisma/client";
import { getContactSettings } from "@/lib/site-settings";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const listing = await db.listing.findUnique({ where: { slug } });
  if (!listing) return { title: "Listing not found" };

  return {
    title: `${listing.title} | ${listing.city}`,
    description: listing.summary,
    alternates: { canonical: `/listings/${slug}` }
  };
}

export default async function ListingDetail({ params }: Props) {
  const { slug } = await params;

  const contact = await getContactSettings();
  let listing: Prisma.ListingGetPayload<{ include: { media: true } }> | null = null;
  let similar: Prisma.ListingGetPayload<{ include: { media: true } }>[] = [];

  try {
    listing = await db.listing.findUnique({ where: { slug }, include: { media: { orderBy: { sortOrder: "asc" } } } });

    if (listing) {
      similar = await db.listing.findMany({
        where: { status: "PUBLISHED", city: listing.city, id: { not: listing.id } },
        include: { media: true },
        take: 3
      });
    }
  } catch (error) {
    logServerError("listing-detail", error, { slug });
  }

  if (!listing || listing.status !== "PUBLISHED") return notFound();

  const gallery = listing.media.length
    ? listing.media.map((m) => m.url)
    : ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"];

  const ld = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: listing.title,
    description: listing.summary,
    offers: { "@type": "Offer", price: listing.priceUsd, priceCurrency: "USD", availability: "https://schema.org/InStock" }
  };

  return (
    <section className="shell section">
      <nav aria-label="Breadcrumb"><p><Link href="/">Home</Link> / <Link href="/listings">Listings</Link> / <span>{listing.title}</span></p></nav>
      <div className="detail-head">
        <div>
          <span className="pill">Verified listing</span>
          <h1>{listing.title}</h1>
          <p className="muted">{listing.district}, {listing.city}, Cambodia</p>
        </div>
        <p className="price">${listing.priceUsd.toLocaleString()}</p>
      </div>

      <div className="detail-layout">
        <div>
          <Image src={gallery[0]} alt={listing.title} className="detail-hero" width={1200} height={720} priority />
          <div className="thumb-row">
            {gallery.slice(1, 5).map((url) => <Image key={url} src={url} alt={`${listing.title} media`} className="thumb" loading="lazy" width={240} height={140} />)}
          </div>
          <div className="spec-grid">
            <article><strong>{listing.bedrooms}</strong><span>Bedrooms</span></article>
            <article><strong>{listing.bathrooms}</strong><span>Bathrooms</span></article>
            <article><strong>{listing.areaSqm}</strong><span>Internal sqm</span></article>
            <article><strong>{listing.featured ? "Featured" : "Standard"}</strong><span>Status</span></article>
          </div>
          <article className="card-pad">
            <h2>Overview</h2>
            <p>{listing.description}</p>
            <h3>Verification & documentation</h3>
            <ul className="check-list">
              <li>Ownership and listing source reviewed.</li>
              <li>Media checked for recency and consistency.</li>
              <li>Documentation package available upon inquiry.</li>
            </ul>
          </article>
        </div>
        <aside className="sticky-card">
          <h3>Inquire about this property</h3>
          <p className="muted">Need details, viewing times, or investment projections? We respond within hours.</p>
          <p className="muted"><a href={contact.phoneHref}>{contact.phoneDisplay}</a> · <a href={contact.emailHref}>{contact.email}</a></p>
          <InquiryForm listingId={listing.id} compact />
        </aside>
      </div>

      {similar.length > 0 && (
        <div className="section">
          <h2>Related listings in {listing.city}</h2>
          <div className="listing-grid">
            {similar.map((item) => <ListingCard key={item.id} listing={item} />)}
          </div>
        </div>
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </section>
  );
}
