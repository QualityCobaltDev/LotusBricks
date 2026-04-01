import { faqs } from "@/lib/site/content";
import { PLAN_CONFIG, PLAN_ORDER, formatUsd } from "@/lib/plans";

export default async function PricingPage() {
  const plans = PLAN_ORDER.map((key) => PLAN_CONFIG[key]);

  return (
    <section className="shell section">
      <div className="section-head narrow">
        <h1>Transparent pricing for every portfolio stage</h1>
        <p className="muted">One-time $50 sign-up fee applies to all new standard subscriptions. Every plan includes up to 10 photos and 2 videos per listing.</p>
      </div>

      <div className="pricing-grid">
        {plans.map((plan) => (
          <article key={plan.key} className={`pricing-card ${plan.featured ? "featured" : ""} ${plan.key === "CUSTOM" ? "premium" : ""}`}>
            <div>
              {plan.badge && <p className="eyebrow">{plan.badge}</p>}
              <h3>{plan.name}</h3>
            </div>
            <p className="price">
              {plan.recurringMonthlyUsd === null ? "Pricing Varies" : `${formatUsd(plan.recurringMonthlyUsd)}`}<small>{plan.recurringMonthlyUsd === null ? "" : " / month"}</small>
            </p>
            {plan.recurringMonthlyUsd !== null && <p className="muted">+ {formatUsd(plan.oneTimeSignupFeeUsd)} one-time sign-up fee</p>}
            {plan.recurringMonthlyUsd === null && <p className="muted">Need more than 10 listings? Contact us for a tailored Custom Tier.</p>}
            <ul>
              <li>{plan.listingLimit === null ? "10+ Listings" : `${plan.listingLimit} ${plan.listingLimit === 1 ? "Listing" : "Listings"}`}</li>
              <li>{plan.photosPerListing} Photos per listing</li>
              <li>{plan.videosPerListing} Videos per listing</li>
              {plan.blurb && <li>{plan.blurb}</li>}
            </ul>
            <a href={plan.ctaHref} className={`btn ${plan.contactOnly ? "btn-ghost" : "btn-primary"}`}>{plan.ctaLabel}</a>
          </article>
        ))}
      </div>

      <div className="section">
        <h2>Plan comparison</h2>
        <div className="card-pad">
          <table className="comparison-table">
            <thead>
              <tr><th>Plan</th><th>Recurring</th><th>Sign-up fee</th><th>Listings</th><th>Photos/listing</th><th>Videos/listing</th></tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr key={`row-${plan.key}`}>
                  <td>{plan.name}</td>
                  <td>{plan.recurringMonthlyUsd === null ? "Pricing Varies" : `${formatUsd(plan.recurringMonthlyUsd)}/mo`}</td>
                  <td>{plan.recurringMonthlyUsd === null ? "N/A" : formatUsd(plan.oneTimeSignupFeeUsd)}</td>
                  <td>{plan.listingLimit === null ? "10+ (Contact Sales)" : plan.listingLimit}</td>
                  <td>{plan.photosPerListing}</td>
                  <td>{plan.videosPerListing}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="section two-col">
        <article className="card-pad">
          <h2>Billing clarity before checkout</h2>
          <p>All new standard subscriptions show two separate charges before payment:</p>
          <ul className="check-list">
            <li>Recurring monthly subscription fee (plan-based)</li>
            <li>One-time $50 sign-up fee (charged once, not on renewals)</li>
          </ul>
        </article>
        <article className="card-pad">
          <h2>Frequently asked questions</h2>
          {faqs.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </article>
      </div>
    </section>
  );
}
