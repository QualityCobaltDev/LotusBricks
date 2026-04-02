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

export const metadata: Metadata = buildMetadata({
  title: "Verified Property Marketplace Cambodia",
  description: "RightBricks helps buyers, investors, and developers discover verified listings with trusted advisory support.",
  path: "/"
});

const guides = [
  { title: "Phnom Penh investment guide", href: "/resources/phnom-penh-investment-guide", text: "Yield signals, district-by-district trends, and acquisition checkpoints." },
  { title: "Buyer due-diligence checklist", href: "/resources/buyer-due-diligence-checklist", text: "A practical review flow before paying deposits or entering negotiation." },
  { title: "Developer listing playbook", href: "/resources/developer-listing-playbook", text: "How to present verified media and convert qualified inquiries faster." }
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
        <Reveal>
          <span className="eyebrow">Verified property intelligence for Cambodia</span>
          <h1>{hero?.title ?? "Invest, buy, and lease with higher confidence"}</h1>
          <p>
            {hero?.body ??
              "RightBricks pairs verified listing data, documentation-first workflows, and responsive advisory support to help you move faster with less risk."}
          </p>
          <div className="hero-actions">
            <Link href="/listings" className="btn btn-primary" data-cta="home-primary" data-track-event="click_browse_listings" data-track-label="home-primary">Browse verified listings</Link>
            <Link href="/contact" className="btn btn-outline" data-cta="home-secondary">Book advisory call</Link>
          </div>
        </Reveal>
        <Reveal delay={100} className="hero-visual-wrap">
          <div className="hero-card">
            <Image src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80" alt="Premium property exterior" fill priority sizes="(max-width: 960px) 100vw, 50vw" />
            <div className="hero-overlay">
              <strong>Verified listings. Real momentum.</strong>
              <span>Clear facts, trust signals, and direct inquiry pathways.</span>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="shell stat-grid">
        {trustStats.map((item, index) => (
          <Reveal key={item.label} delay={index * 80}>
            <article className="stat-card">
              <p>{item.value}</p>
              <span>{item.label}</span>
            </article>
          </Reveal>
        ))}
      </section>

      <section className="shell section">
        <div className="section-head">
          <h2>Featured listings</h2>
          <Link href="/listings">View all listings</Link>
        </div>
        <div className="listing-grid">{featured.map((listing, index) => <Reveal key={listing.id} delay={index * 90}><ListingCard listing={listing} /></Reveal>)}</div>
      </section>

      <section className="shell section two-col">
        <Reveal><div className="card-pad"><h2>How RightBricks works</h2><ol><li>Browse verified listings with structured filters.</li><li>Review pricing context, media, and facts in one page.</li><li>Inquire instantly and get a human response within hours.</li></ol></div></Reveal>
        <Reveal delay={100}><div className="card-pad"><h2>Why teams choose us</h2><ul className="check-list"><li>Verification-first listing standards.</li><li>Investor-aware insights, not generic listing copy.</li><li>Fast, accountable support via email, phone, WhatsApp, and Telegram.</li></ul></div></Reveal>
      </section>

      <section className="shell section">
        <div className="section-head"><h2>Market intelligence & resources</h2></div>
        <div className="grid">{guides.map((g, index) => <Reveal key={g.title} delay={index * 80}><article className="card"><h3>{g.title}</h3><p className="muted">{g.text}</p><Link href={g.href as any}>Read more</Link></article></Reveal>)}</div>
      </section>

      <section className="shell section">
        <div className="section-head">
          <h2>Standardized pricing tiers</h2>
          <Link href="/pricing">View full pricing</Link>
        </div>
        <div className="pricing-grid">
          {pricingPreview.map((plan, index) => (
            <Reveal key={plan.key} delay={index * 90}>
              <article className="pricing-card">
                <h3>{plan.name}</h3>
                {plan.contactOnly ? <p className="muted">Contact Us for Pricing</p> : <p className="muted">{`${formatUsd(plan.recurringMonthlyUsd ?? 0)} + ${formatUsd(plan.oneTimeSignupFeeUsd)} Sign-Up Fee`}</p>}
                <a href={plan.ctaHref} className="btn btn-outline">{plan.contactOnly ? "Contact Us" : plan.ctaLabel}</a>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="shell section">
        <div className="section-head"><h2>Trusted by active market participants</h2></div>
        <div className="quote-grid">
          {testimonials.map((t, index) => (
            <Reveal key={t.name} delay={index * 90}><blockquote className="card-pad">“{t.quote}”<footer>{t.name} · {t.role}</footer></blockquote></Reveal>
          ))}
        </div>
      </section>

      <Reveal className="shell cta-band">
        <h2>Ready for your next property move?</h2>
        <p>Explore verified inventory, save high-fit opportunities, and reach advisors without delay.</p>
        <div className="hero-actions">
          <Link href="/listings" className="btn btn-primary" data-track-event="click_browse_listings" data-track-label="home-footer-cta">Explore listings</Link>
          <Link href="/contact" className="btn btn-outline">Speak to RightBricks</Link>
        </div>
      </Reveal>
    </>
  );
}
