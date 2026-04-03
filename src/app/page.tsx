import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { db, isDatabaseConfigured } from "@/lib/db";
import { ListingCard } from "@/components/ui/listing-card";
import { trustStats, testimonials } from "@/lib/site/content";
import { isPrismaSchemaMismatch, logServerError } from "@/lib/observability";
import { Prisma } from "@prisma/client";
import { getPricingPlans } from "@/lib/pricing-settings";
import { formatUsd } from "@/lib/plans";
import { Reveal } from "@/components/ui/reveal";
import { ParallaxLayer } from "@/components/ui/parallax-layer";
import { getStaggerDelay } from "@/lib/motion";
import { buildContactHref } from "@/lib/routing";

export const metadata: Metadata = buildMetadata({
  title: "List Property & Get Qualified Leads in Cambodia",
  description: "RightBricks helps owners, agencies, and developers list properties, capture qualified enquiries, and close faster with verified visibility.",
  path: "/"
});

const guides = [
  { title: "Phnom Penh investment guide", href: "/resources/phnom-penh-investment-guide", text: "Yield signals, district-by-district trends, and acquisition checkpoints." },
  { title: "Buyer due-diligence checklist", href: "/resources/buyer-due-diligence-checklist", text: "A practical review flow before paying deposits or entering negotiation." },
  { title: "Developer listing playbook", href: "/resources/developer-listing-playbook", text: "How to present verified media and convert qualified inquiries faster." }
];

const outcomes = [
  "Higher visibility across Cambodia's active property audience",
  "Faster lead response with direct enquiry routing",
  "Premium presentation with verified listing standards",
  "Clear pricing with transparent listing packages"
];

export default async function HomePage() {
  let hero: { title: string; body: string } | null = null;
  let featured: Prisma.ListingGetPayload<{ include: { media: true } }>[] = [];
  const pricingPreview = await getPricingPlans();

  if (isDatabaseConfigured()) {
    try {
      [hero, featured] = await Promise.all([
      db.siteContent.findUnique({ where: { key: "homepage.hero" }, select: { title: true, body: true } }),
      db.listing.findMany({
        where: { status: "PUBLISHED" },
        include: { media: { orderBy: { sortOrder: "asc" }, take: 8 } },
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
        take: 6
      })
    ]);
    } catch (error) {
      logServerError("home-page", error, { schemaMismatch: isPrismaSchemaMismatch(error) });
    }
  }

  return (
    <>
      <section className="hero shell">
        <ParallaxLayer className="hero-backdrop" speed={0.04}>
          <div className="hero-backdrop-orb" />
        </ParallaxLayer>
        <Reveal>
          <span className="eyebrow">Cambodia&apos;s trusted property listing platform</span>
          <h1>{hero?.title ?? "List your property, attract qualified leads, and close faster"}</h1>
          <p>
            {hero?.body ??
              "RightBricks helps property owners, agencies, and developers showcase verified listings with high-trust presentation, direct enquiries, and sales-focused support."}
          </p>
          <div className="hero-actions">
            <Link href="/pricing" className="btn btn-primary" data-track-event="homepage_cta_click" data-track-label="home-list-property">List Your Property</Link>
            <Link href="/listings" className="btn btn-outline" data-track-event="click_browse_listings" data-track-label="home-browse">Browse Listings</Link>
            <a href={buildContactHref({ source: "homepage" })} className="btn btn-ghost" data-track-event="homepage_cta_click" data-track-label="home-contact">Contact Us</a>
          </div>
          <ul className="trust-inline">
            <li>Direct owner/agent enquiries</li>
            <li>Fast response from RightBricks team</li>
            <li>No-obligation consultation</li>
          </ul>
        </Reveal>
        <Reveal delay={140} className="hero-visual-wrap" y={24}>
          <ParallaxLayer speed={0.06}>
            <div className="hero-card">
              <Image src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80" alt="Premium property exterior" fill priority sizes="(max-width: 960px) 100vw, 50vw" />
              <div className="hero-overlay">
                <strong>Premium exposure for serious sellers and landlords</strong>
                <span>Verified listings, structured media, and clear enquiry flow.</span>
              </div>
            </div>
          </ParallaxLayer>
        </Reveal>
      </section>

      <section className="shell stat-grid">
        {trustStats.map((item, index) => (
          <Reveal key={item.label} delay={getStaggerDelay(index)}>
            <article className="stat-card">
              <p>{item.value}</p>
              <span>{item.label}</span>
            </article>
          </Reveal>
        ))}
      </section>

      <section className="shell section two-col">
        <Reveal>
          <div className="card-pad">
            <h2>Why list with RightBricks</h2>
            <ul className="check-list">
              {outcomes.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <Link href="/pricing" className="btn btn-primary" data-track-event="homepage_cta_click" data-track-label="why-list-cta">Get Started</Link>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="card-pad">
            <h2>How it works</h2>
            <ol>
              <li>Choose your listing tier and share your property details.</li>
              <li>RightBricks verifies your listing and publishes with premium structure.</li>
              <li>Receive enquiries and schedule viewings through a clear contact path.</li>
            </ol>
            <a href={buildContactHref({ source: "homepage" })} className="btn btn-outline" data-track-event="homepage_cta_click" data-track-label="how-it-works-cta">Talk to Sales</a>
          </div>
        </Reveal>
      </section>

      <section className="shell section">
        <div className="section-head">
          <h2>Featured listings</h2>
          <Link href="/listings" data-track-event="click_browse_listings" data-track-label="featured-view-all">View all listings</Link>
        </div>
        <div className="listing-grid">{featured.map((listing, index) => <Reveal key={listing.id} delay={getStaggerDelay(index)}><ListingCard listing={listing} /></Reveal>)}</div>
      </section>

      <section className="shell section">
        <div className="section-head">
          <h2>Listing plans built for growth</h2>
          <Link href="/pricing">Compare all tiers</Link>
        </div>
        <div className="pricing-grid">
          {pricingPreview.map((plan, index) => (
            <Reveal key={plan.key} delay={getStaggerDelay(index)}>
              <article className="pricing-card">
                <h3>{plan.name}</h3>
                {plan.contactOnly ? <p className="muted">Custom pricing for multi-project portfolios</p> : <p className="muted">{`${formatUsd(plan.recurringMonthlyUsd ?? 0)} + ${formatUsd(plan.oneTimeSignupFeeUsd)} sign-up`}</p>}
                <p className="muted">{plan.contactOnly ? "Best for enterprise portfolios and high-volume inventory." : `Includes ${plan.listingLimit} active listing${plan.listingLimit === 1 ? "" : "s"}, ${plan.photosPerListing} photos, and ${plan.videosPerListing} videos per listing.`}</p>
                <a href={buildContactHref({ plan: plan.key, source: "homepage" })} className="btn btn-outline" data-track-event="pricing_tier_click" data-track-label={`home-${plan.key.toLowerCase()}`}>{plan.contactOnly ? "Contact Us" : "Choose Plan"}</a>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="shell section">
        <div className="section-head"><h2>Market intelligence & resources</h2></div>
        <div className="grid">{guides.map((g, index) => <Reveal key={g.title} delay={getStaggerDelay(index)}><article className="card"><h3>{g.title}</h3><p className="muted">{g.text}</p><Link href={g.href as any}>Read more</Link></article></Reveal>)}</div>
      </section>

      <section className="shell section">
        <div className="section-head"><h2>Trusted by active market participants</h2></div>
        <div className="quote-grid">
          {testimonials.map((t, index) => (
            <Reveal key={t.name} delay={getStaggerDelay(index)}><blockquote className="card-pad">“{t.quote}”<footer>{t.name} · {t.role}</footer></blockquote></Reveal>
          ))}
        </div>
      </section>

      <Reveal className="shell cta-band">
        <h2>Start converting more leads with RightBricks</h2>
        <p>Choose a plan, launch your listing, and let verified visibility drive serious enquiries.</p>
        <div className="hero-actions">
          <Link href="/pricing" className="btn btn-primary" data-track-event="homepage_cta_click" data-track-label="home-footer-list">List Your Property</Link>
          <a href={buildContactHref({ source: "homepage" })} className="btn btn-outline" data-track-event="homepage_cta_click" data-track-label="home-footer-contact">Contact Us</a>
        </div>
      </Reveal>
    </>
  );
}
