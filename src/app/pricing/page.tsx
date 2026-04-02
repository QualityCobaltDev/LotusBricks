import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { faqs } from "@/lib/site/content";
import { formatUsd } from "@/lib/plans";
import { getPricingPlans } from "@/lib/pricing-settings";

export const metadata: Metadata = buildMetadata({
  title: "Pricing Plans",
  description: "Compare listing plans and select the right RightBricks tier for your portfolio.",
  path: "/pricing"
});

export default async function PricingPage() {
  const plans = await getPricingPlans();

  return (
    <section className="shell section">
      <div className="section-head narrow">
        <h1>Clear, professional pricing</h1>
        <p className="muted">Compare tier pricing, separate sign-up fees, and upfront totals before you choose.</p>
      </div>

      <div className="pricing-grid">
        {plans.map((plan) => (
          <article key={plan.key} className={`pricing-card ${plan.featured ? "featured" : ""} ${plan.key === "CUSTOM" ? "premium" : ""}`}>
            <div>
              {plan.badge && <p className="eyebrow">{plan.badge}</p>}
              <h3>{plan.name}</h3>
              {plan.blurb && <p className="muted">{plan.blurb}</p>}
            </div>
            {plan.contactOnly ? (
              <>
                <p className="price">Custom Plan</p>
                <p className="muted">Contact Us for Pricing</p>
              </>
            ) : (
              <>
                <p className="price">{formatUsd(plan.recurringMonthlyUsd ?? 0)} <small>/ month</small></p>
                <p className="muted">{`${formatUsd(plan.recurringMonthlyUsd ?? 0)} + ${formatUsd(plan.oneTimeSignupFeeUsd)} Sign-Up Fee`}</p>
                <p><strong>Total upfront: {formatUsd((plan.recurringMonthlyUsd ?? 0) + plan.oneTimeSignupFeeUsd)}</strong></p>
              </>
            )}
            <ul>
              <li>{plan.listingLimit === null ? "10+ Listings" : `${plan.listingLimit} Listings`}</li>
              <li>{plan.photosPerListing} Photos per listing</li>
              <li>{plan.videosPerListing} Videos per listing</li>
            </ul>
            <a href={plan.ctaHref} className={`btn ${plan.contactOnly ? "btn-ghost" : "btn-primary"}`} data-track-event="choose_tier" data-track-label={plan.key}>{plan.contactOnly ? "Contact Us" : plan.ctaLabel}</a>
          </article>
        ))}
      </div>

      <div className="section two-col">
        <article className="card-pad">
          <h2>FAQ</h2>
          {faqs.map((f) => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}
        </article>
        <article className="card-pad">
          <h2>Custom tier conversion path</h2>
          <p>Tier 4 is contact-first by design. Share your requirements and we&apos;ll scope a custom proposal.</p>
          <a className="btn btn-primary" href="/contact?plan=custom&tierNeeds=10-plus">Contact Us</a>
        </article>
      </div>
    </section>
  );
}
