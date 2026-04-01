import type { Metadata } from "next";
import { faqs } from "@/lib/site/content";
import { PLAN_CONFIG, PLAN_ORDER, formatUsd } from "@/lib/plans";
import { CONTACT } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Transparent RightBricks pricing with a one-time $50 signup fee, clear plan limits, and custom tiers for larger portfolios.",
  alternates: { canonical: "/pricing" }
};

export default async function PricingPage() {
  const plans = PLAN_ORDER.map((key) => PLAN_CONFIG[key]);

  return (
    <section className="shell section">
      <div className="section-head narrow">
        <h1>Pricing built for serious property operators</h1>
        <p className="muted">One-time $50 sign-up fee applies to new standard subscriptions. Need more than 10 listings? Our Custom Tier includes tailored onboarding and support.</p>
      </div>

      <div className="pricing-grid">
        {plans.map((plan) => (
          <article key={plan.key} className={`pricing-card ${plan.featured ? "featured" : ""} ${plan.key === "CUSTOM" ? "premium" : ""}`}>
            <div>
              {plan.badge && <p className="eyebrow">{plan.badge}</p>}
              <h3>{plan.name}</h3>
              <p className="muted">Best for: {plan.key === "TIER_1" ? "single asset owners" : plan.key === "TIER_2" ? "active agents" : plan.key === "TIER_3" ? "growing agencies" : "portfolio operators"}</p>
            </div>
            <p className="price">{plan.recurringMonthlyUsd === null ? "Pricing Varies" : `${formatUsd(plan.recurringMonthlyUsd)}`}<small>{plan.recurringMonthlyUsd === null ? "" : " / month"}</small></p>
            {plan.recurringMonthlyUsd !== null ? <p className="muted">+ {formatUsd(plan.oneTimeSignupFeeUsd)} one-time sign-up fee</p> : <p className="muted">Talk to sales for a Custom Tier proposal.</p>}
            <ul>
              <li>{plan.listingLimit === null ? "10+ Listings" : `${plan.listingLimit} Listings`}</li>
              <li>{plan.photosPerListing} Photos per listing</li>
              <li>{plan.videosPerListing} Videos per listing</li>
              {plan.blurb && <li>{plan.blurb}</li>}
            </ul>
            <a href={plan.ctaHref} className={`btn ${plan.contactOnly ? "btn-ghost" : "btn-primary"}`}>{plan.ctaLabel}</a>
          </article>
        ))}
      </div>

      <div className="section two-col">
        <article className="card-pad">
          <h2>FAQ</h2>
          {faqs.map((f) => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}
        </article>
        <article className="card-pad">
          <h2>Custom plan conversion path</h2>
          <p>Share listing volume, target districts, and service requirements. We will provide a scoped Custom Tier proposal.</p>
          <a className="btn btn-primary" href="/contact?plan=custom&tierNeeds=10-plus">Request Custom Tier</a>
          <p className="muted">{CONTACT.standardLine}</p>
        </article>
      </div>
    </section>
  );
}
