import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { faqs } from "@/lib/site/content";
import { formatUsd } from "@/lib/plans";
import { getPricingPlans } from "@/lib/pricing-settings";
import { Reveal } from "@/components/ui/reveal";
import { getStaggerDelay } from "@/lib/motion";
import { normalizePublicHref } from "@/lib/routing";

export const metadata: Metadata = buildMetadata({
  title: "Pricing Plans",
  description: "Compare RightBricks listing tiers and choose the best plan to generate qualified enquiries.",
  path: "/pricing"
});

const tierGuidance: Record<string, string> = {
  TIER_1: "For individual owners testing one premium listing.",
  TIER_2: "For agencies and landlords managing multiple active units.",
  TIER_3: "For broker teams and developers scaling lead generation.",
  CUSTOM: "For enterprise portfolios that need custom workflow and support."
};

const supportByTier: Record<string, string> = {
  TIER_1: "Standard listing support and direct enquiry routing.",
  TIER_2: "Priority publishing and guided listing optimization support.",
  TIER_3: "Higher exposure positioning and account-level guidance.",
  CUSTOM: "Dedicated consultation, rollout support, and custom scope."
};

export default async function PricingPage() {
  const plans = await getPricingPlans();

  return (
    <section className="shell section">
      <Reveal>
        <div className="section-head narrow">
          <h1>Simple listing tiers. Clear value. Faster conversions.</h1>
          <p className="muted">All standard plans include a one-time sign-up fee of {formatUsd(50)} and transparent monthly pricing.</p>
        </div>
      </Reveal>

      <div className="pricing-grid">
        {plans.map((plan, index) => (
          <Reveal key={plan.key} delay={getStaggerDelay(index)}>
            <article className={`pricing-card ${plan.key === "CUSTOM" ? "premium" : ""}`}>
              <div>
                <h3>{plan.name}</h3>
                <p className="muted"><strong>Who this is for:</strong> {tierGuidance[plan.key]}</p>
                {plan.blurb && <p className="muted">{plan.blurb}</p>}
              </div>
              {plan.contactOnly ? (
                <>
                  <p className="price">Custom Pricing</p>
                  <p className="muted">Tell us your listing volume and coverage goals.</p>
                </>
              ) : (
                <>
                  <p className="price">{formatUsd(plan.recurringMonthlyUsd ?? 0)} <small>/ month</small></p>
                  <p className="muted">{`${formatUsd(plan.recurringMonthlyUsd ?? 0)} monthly + ${formatUsd(plan.oneTimeSignupFeeUsd)} sign-up fee`}</p>
                  <p><strong>First payment: {formatUsd((plan.recurringMonthlyUsd ?? 0) + plan.oneTimeSignupFeeUsd)}</strong></p>
                </>
              )}

              <ul>
                <li><strong>Listings:</strong> {plan.listingLimit === null ? "10+ active listings" : `${plan.listingLimit} active listing${plan.listingLimit === 1 ? "" : "s"}`}</li>
                <li><strong>Media:</strong> {plan.photosPerListing} photos + {plan.videosPerListing} videos per listing</li>
                <li><strong>Exposure:</strong> Verified listing presentation designed for high-intent buyers</li>
                <li><strong>Support:</strong> {supportByTier[plan.key]}</li>
              </ul>

              <a href={normalizePublicHref(plan.ctaHref)} className={`btn ${plan.contactOnly ? "btn-ghost" : "btn-primary"}`} data-track-event="choose_tier" data-track-label={plan.key}>{plan.contactOnly ? "Request Custom Proposal" : "Get Started"}</a>
              <small className="muted">No hidden charges. You always know what you pay and what you get.</small>
            </article>
          </Reveal>
        ))}
      </div>

      <div className="section two-col">
        <Reveal>
          <article className="card-pad">
            <h2>FAQ</h2>
            {faqs.map((f) => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}
          </article>
        </Reveal>
        <Reveal delay={120}>
          <article className="card-pad">
            <h2>Need help choosing the right tier?</h2>
            <p>Tell us your listing goals and we&apos;ll recommend the best starting plan in one short consultation.</p>
            <a className="btn btn-primary" href="/contact" data-track-event="contact_form_start" data-track-label="pricing-help">Contact Us</a>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
