import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { db, isDatabaseConfigured } from "@/lib/db";
import { ListingCard } from "@/components/ui/listing-card";
import { trustStats, testimonials } from "@/lib/site/content";
import { isPrismaSchemaMismatch, logServerError } from "@/lib/observability";
import { Prisma } from "@prisma/client";
import { getPricingPlans } from "@/lib/pricing-settings";
import { formatUsd } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Home",
  description: "RightBricks is Cambodia's verified property marketplace for buyers, investors, agencies, and developers.",
  alternates: { canonical: "/" }
};

const guides = [
  { title: "Phnom Penh investment guide", href: "/support", text: "Yield signals, district-by-district trends, and acquisition checkpoints." },
  { title: "Buyer due-diligence checklist", href: "/support", text: "A practical review flow before paying deposits or entering negotiation." },
  { title: "Developer listing playbook", href: "/pricing", text: "How to present verified media and convert qualified inquiries faster." }
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
        include: { media: { orderBy: { sortOrder: "asc" }, take: 1 } },
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
        <div>
          <span className="eyebrow">Verified property intelligence for Cambodia</span>
          <h1>{hero?.title ?? "Invest, buy, and lease with higher confidence"}</h1>
          <p>
            {hero?.body ??
              "RightBricks pairs verified listing data, documentation-first workflows, and responsive advisory support to help you move faster with less risk."}
          </p>
          <div className="hero-actions">
            <Link href="/listings" className="btn btn-primary" data-cta="home-primary">Browse verified listings</Link>
            <Link href="/contact" className="btn btn-ghost" data-cta="home-secondary">Book advisory call</Link>
          </div>
        </div>
        <div className="hero-card">
          <Image src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80" alt="Premium property exterior" fill priority sizes="(max-width: 960px) 100vw, 50vw" />
          <div className="hero-overlay">
            <strong>Verified listings. Real momentum.</strong>
            <span>Clear facts, trust signals, and direct inquiry pathways.</span>
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
        <div className="listing-grid">{featured.map((listing) => <ListingCard key={listing.id} listing={listing} />)}</div>
      </section>

      <section className="shell section two-col">
        <div className="card-pad"><h2>How RightBricks works</h2><ol><li>Browse verified listings with structured filters.</li><li>Review pricing context, media, and facts in one page.</li><li>Inquire instantly and get a human response within hours.</li></ol></div>
        <div className="card-pad"><h2>Why teams choose us</h2><ul className="check-list"><li>Verification-first listing standards.</li><li>Investor-aware insights, not generic listing copy.</li><li>Fast, accountable support via email, phone, WhatsApp, and Telegram.</li></ul></div>
      </section>

      <section className="shell section">
        <div className="section-head"><h2>Market intelligence & resources</h2></div>
        <div className="grid">{guides.map((g) => <article className="card" key={g.title}><h3>{g.title}</h3><p className="muted">{g.text}</p><Link href={g.href as any}>Read more</Link></article>)}</div>
      </section>


      <section className="shell section">
        <div className="section-head">
          <h2>Standardized pricing tiers</h2>
          <Link href="/pricing">View full pricing</Link>
        </div>
        <div className="pricing-grid">
          {pricingPreview.map((plan) => (
            <article key={plan.key} className="pricing-card">
              <h3>{plan.name}</h3>
              {plan.contactOnly ? <p className="muted">Contact Us for Pricing</p> : <p className="muted">{`${formatUsd(plan.recurringMonthlyUsd ?? 0)} + ${formatUsd(plan.oneTimeSignupFeeUsd)} Sign-Up Fee`}</p>}
              <a href={plan.ctaHref} className="btn btn-ghost">{plan.contactOnly ? "Contact Us" : plan.ctaLabel}</a>
            </article>
          ))}
        </div>
      </section>

      <section className="shell section">
        <div className="section-head"><h2>Trusted by active market participants</h2></div>
        <div className="quote-grid">
          {testimonials.map((t) => (
            <blockquote key={t.name} className="card-pad">“{t.quote}”<footer>{t.name} · {t.role}</footer></blockquote>
          ))}
        </div>
      </section>

      <section className="shell cta-band">
        <h2>Ready for your next property move?</h2>
        <p>Explore verified inventory, save high-fit opportunities, and reach advisors without delay.</p>
        <div className="hero-actions">
          <Link href="/listings" className="btn btn-primary">Explore listings</Link>
          <Link href="/contact" className="btn btn-ghost">Speak to RightBricks</Link>
        </div>
      </section>
    </>
  );
}
