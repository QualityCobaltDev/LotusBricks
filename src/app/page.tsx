import Link from "next/link";
import { db } from "@/lib/db";
import { ListingCard } from "@/components/ui/listing-card";
import { trustStats, testimonials } from "@/lib/site/content";
import { isPrismaSchemaMismatch, logServerError } from "@/lib/observability";
import { Prisma } from "@prisma/client";

export default async function HomePage() {
  let hero: { title: string; body: string } | null = null;
  let featured: Prisma.ListingGetPayload<{ include: { media: true } }>[] = [];

  try {
    [hero, featured] = await Promise.all([
      db.siteContent.findUnique({ where: { key: "homepage.hero" }, select: { title: true, body: true } }),
      db.listing.findMany({
        where: { status: "PUBLISHED" },
        include: { media: { orderBy: { sortOrder: "asc" }, take: 1 } },
        take: 6
      })
    ]);
  } catch (error) {
    logServerError("home-page", error, { schemaMismatch: isPrismaSchemaMismatch(error) });
  }

  return (
    <>
      <section className="hero shell">
        <div>
          <span className="eyebrow">Trusted by buyers, investors, and property partners</span>
          <h1>{hero?.title ?? "Invest in property with greater certainty"}</h1>
          <p>
            {hero?.body ??
              "RightBricks combines verified listings, transparent pricing intelligence, and responsive advisory support so you can act with confidence."}
          </p>
          <div className="hero-actions">
            <Link href="/listings" className="btn btn-primary">Browse verified listings</Link>
            <Link href="/contact" className="btn btn-ghost">Talk to an advisor</Link>
          </div>
          <div className="hero-search">
            <input aria-label="Search locations" placeholder="Search by city, district, or property type" />
            <button className="btn btn-primary">Search</button>
          </div>
        </div>
        <div className="hero-card">
          <img src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80" alt="Premium property exterior" />
          <div className="hero-overlay">
            <strong>Portfolio-grade opportunities</strong>
            <span>Media-rich listings · Verified documentation · Faster inquiries</span>
          </div>
        </div>
      </section>

      <section className="shell stat-grid">
        {trustStats.map((item) => (
          <article key={item.label} className="stat-card">
            <p>{item.value}</p>
            <span>{item.label}</span>
          </article>
        ))}
      </section>

      <section className="shell section">
        <div className="section-head">
          <h2>Featured listings</h2>
          <Link href="/listings">View all listings</Link>
        </div>
        <div className="listing-grid">
          {featured.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

      <section className="shell section two-col">
        <div>
          <h2>Why teams choose RightBricks</h2>
          <ul className="check-list">
            <li>Verification workflow for listing quality and ownership confidence.</li>
            <li>Clear pricing intelligence and rich media that reduce decision risk.</li>
            <li>Dedicated inquiry routing for faster responses and better conversion.</li>
          </ul>
        </div>
        <div className="card-pad">
          <h3>How it works</h3>
          <ol>
            <li>Browse verified opportunities using filters and market context.</li>
            <li>Compare pricing, specifications, and media-rich listing details.</li>
            <li>Connect instantly with our team or listing partner to close faster.</li>
          </ol>
        </div>
      </section>

      <section className="shell section">
        <div className="section-head"><h2>What clients are saying</h2></div>
        <div className="quote-grid">
          {testimonials.map((t) => (
            <blockquote key={t.name} className="card-pad">
              “{t.quote}”
              <footer>{t.name} · {t.role}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="shell cta-band">
        <h2>Ready to find your next high-confidence property move?</h2>
        <p>Start exploring listings or speak to our team for tailored recommendations.</p>
        <div className="hero-actions">
          <Link href="/listings" className="btn btn-primary">Explore listings</Link>
          <Link href="/sign-in" className="btn btn-ghost">Get started</Link>
        </div>
      </section>
    </>
  );
}
