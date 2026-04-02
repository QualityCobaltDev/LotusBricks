import Image from "next/image";
import type { Metadata } from "next";
import { db, isDatabaseConfigured } from "@/lib/db";
import { ListingCard } from "@/components/ui/listing-card";
import { trustStats, testimonials } from "@/lib/site/content";
import { isPrismaSchemaMismatch, logServerError } from "@/lib/observability";
import { Prisma } from "@prisma/client";
import { getPricingPlans } from "@/lib/pricing-settings";
import { formatUsd } from "@/lib/plans";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return {
    title: t("heroTitle"),
    description: t("heroBody"),
    alternates: { canonical: "/" }
  };
}

export default async function HomePage() {
  const t = await getTranslations("home");
  const tGuides = await getTranslations("guides");
  const tStats = await getTranslations("stats");

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

  const guides = [
    { title: tGuides("phnomPenhGuide"), href: "/resources/phnom-penh-investment-guide", text: tGuides("phnomPenhGuideText") },
    { title: tGuides("buyerChecklist"), href: "/resources/buyer-due-diligence-checklist", text: tGuides("buyerChecklistText") },
    { title: tGuides("developerPlaybook"), href: "/resources/developer-listing-playbook", text: tGuides("developerPlaybookText") }
  ];

  const statLabels = [tStats("verifiedListings"), tStats("monthlyInquiries"), tStats("metroRegions"), tStats("avgResponseTime")];

  return (
    <>
      <section className="hero shell">
        <div>
          <span className="eyebrow">{t("eyebrow")}</span>
          <h1>{hero?.title ?? t("heroTitle")}</h1>
          <p>{hero?.body ?? t("heroBody")}</p>
          <div className="hero-actions">
            <Link href="/listings" className="btn btn-primary" data-cta="home-primary" data-track-event="click_browse_listings" data-track-label="home-primary">{t("browseListings")}</Link>
            <Link href="/contact" className="btn btn-ghost" data-cta="home-secondary">{t("bookAdvisoryCall")}</Link>
          </div>
        </div>
        <div className="hero-card">
          <Image src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80" alt={t("heroImageAlt")} fill priority sizes="(max-width: 960px) 100vw, 50vw" />
          <div className="hero-overlay">
            <strong>{t("heroOverlayTitle")}</strong>
            <span>{t("heroOverlaySubtitle")}</span>
          </div>
        </div>
      </section>

      <section className="shell stat-grid">
        {trustStats.map((item, i) => (
          <article key={item.label} className="stat-card">
            <p>{item.value}</p>
            <span>{statLabels[i]}</span>
          </article>
        ))}
      </section>

      <section className="shell section">
        <div className="section-head">
          <h2>{t("featuredListings")}</h2>
          <Link href="/listings">{t("viewAllListings")}</Link>
        </div>
        <div className="listing-grid">{featured.map((listing) => <ListingCard key={listing.id} listing={listing} />)}</div>
      </section>

      <section className="shell section two-col">
        <div className="card-pad">
          <h2>{t("howItWorks")}</h2>
          <ol>
            <li>{t("howStep1")}</li>
            <li>{t("howStep2")}</li>
            <li>{t("howStep3")}</li>
          </ol>
        </div>
        <div className="card-pad">
          <h2>{t("whyChooseUs")}</h2>
          <ul className="check-list">
            <li>{t("whyReason1")}</li>
            <li>{t("whyReason2")}</li>
            <li>{t("whyReason3")}</li>
          </ul>
        </div>
      </section>

      <section className="shell section">
        <div className="section-head"><h2>{t("marketIntelligence")}</h2></div>
        <div className="grid">{guides.map((g) => <article className="card" key={g.title}><h3>{g.title}</h3><p className="muted">{g.text}</p><Link href={g.href as any}>{t("readMore")}</Link></article>)}</div>
      </section>

      <section className="shell section">
        <div className="section-head">
          <h2>{t("standardizedPricing")}</h2>
          <Link href="/pricing">{t("viewFullPricing")}</Link>
        </div>
        <div className="pricing-grid">
          {pricingPreview.map((plan) => (
            <article key={plan.key} className="pricing-card">
              <h3>{plan.name}</h3>
              {plan.contactOnly ? <p className="muted">{t("contactUsForPricing")}</p> : <p className="muted">{t("signupFee", { monthly: formatUsd(plan.recurringMonthlyUsd ?? 0), signup: formatUsd(plan.oneTimeSignupFeeUsd) })}</p>}
              <a href={plan.ctaHref} className="btn btn-ghost">{plan.contactOnly ? t("contactUs") : plan.ctaLabel}</a>
            </article>
          ))}
        </div>
      </section>

      <section className="shell section">
        <div className="section-head"><h2>{t("trustedBy")}</h2></div>
        <div className="quote-grid">
          {testimonials.map((item) => (
            <blockquote key={item.name} className="card-pad">&ldquo;{item.quote}&rdquo;<footer>{item.name} · {item.role}</footer></blockquote>
          ))}
        </div>
      </section>

      <section className="shell cta-band">
        <h2>{t("readyForNextMove")}</h2>
        <p>{t("readyBody")}</p>
        <div className="hero-actions">
          <Link href="/listings" className="btn btn-primary" data-track-event="click_browse_listings" data-track-label="home-footer-cta">{t("exploreListings")}</Link>
          <Link href="/contact" className="btn btn-ghost">{t("speakToRightBricks")}</Link>
        </div>
      </section>
    </>
  );
}
