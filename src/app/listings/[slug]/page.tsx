import Link from "next/link";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { InquiryForm } from "@/components/ui/inquiry-form";
import { ListingCard } from "@/components/ui/listing-card";

export default async function ListingDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const listing = await db.listing.findUnique({ where: { slug }, include: { media: { orderBy: { sortOrder: "asc" } } } });
  if (!listing || listing.status !== "PUBLISHED") return notFound();

  const similar = await db.listing.findMany({
    where: { status: "PUBLISHED", city: listing.city, id: { not: listing.id } },
    include: { media: { take: 1, orderBy: { sortOrder: "asc" } } },
    take: 3
  });

  const gallery = listing.media.length
    ? listing.media.map((m) => m.url)
    : ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"];

  return (
    <section className="shell section">
      <p><Link href="/listings">← Back to listings</Link></p>
      <div className="detail-head">
        <div>
          <span className="pill">Verified listing</span>
          <h1>{listing.title}</h1>
          <p className="muted">{listing.district}, {listing.city}</p>
        </div>
        <p className="price">${listing.priceUsd.toLocaleString()}</p>
      </div>

      <div className="detail-layout">
        <div>
          <img src={gallery[0]} alt={listing.title} className="detail-hero" />
          <div className="thumb-row">
            {gallery.slice(1, 5).map((url) => <img key={url} src={url} alt="Property media" className="thumb" loading="lazy" />)}
          </div>
          <div className="spec-grid">
            <article><strong>{listing.bedrooms}</strong><span>Bedrooms</span></article>
            <article><strong>{listing.bathrooms}</strong><span>Bathrooms</span></article>
            <article><strong>{listing.areaSqm}</strong><span>Sqm</span></article>
            <article><strong>{listing.featured ? "Featured" : "Standard"}</strong><span>Placement</span></article>
          </div>
          <article className="card-pad">
            <h2>Overview</h2>
            <p>{listing.description}</p>
            <h3>Highlights</h3>
            <ul className="check-list">
              <li>Professionally reviewed listing media and metadata.</li>
              <li>Transparent property context for better decision confidence.</li>
              <li>Fast inquiry routing to trusted property representatives.</li>
            </ul>
          </article>
        </div>
        <aside className="sticky-card">
          <h3>Schedule a viewing</h3>
          <p className="muted">Share your timeline and our advisors will coordinate next steps.</p>
          <InquiryForm listingId={listing.id} compact />
        </aside>
      </div>

      {similar.length > 0 && (
        <div className="section">
          <h2>Similar listings in {listing.city}</h2>
          <div className="listing-grid">
            {similar.map((item) => <ListingCard key={item.id} listing={item} />)}
          </div>
        </div>
      )}
    </section>
  );
}
