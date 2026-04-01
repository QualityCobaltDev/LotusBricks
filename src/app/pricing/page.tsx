import Link from "next/link";
import { db } from "@/lib/db";
import { faqs } from "@/lib/site/content";

export default async function PricingPage() {
  const plans = await db.pricingPlan.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } });

  return (
    <section className="shell section">
      <div className="section-head narrow">
        <h1>Pricing built for individual buyers and growing teams</h1>
        <p className="muted">Simple plans with transparent billing, verified listing workflows, and support that scales with your deal flow.</p>
      </div>

      <div className="pricing-grid">
        {plans.map((plan, idx) => (
          <article key={plan.id} className={`pricing-card ${idx === 1 ? "featured" : ""}`}>
            <h3>{plan.name}</h3>
            <p className="price">{plan.priceLabel}<small> / {plan.cadence}</small></p>
            <ul>
              {(plan.features as string[]).map((feature) => <li key={feature}>{feature}</li>)}
            </ul>
            <Link href="/contact" className="btn btn-primary">{plan.ctaLabel}</Link>
          </article>
        ))}
        <article className="pricing-card">
          <h3>Enterprise</h3>
          <p className="price">Custom</p>
          <ul>
            <li>Multi-market deployment</li>
            <li>Dedicated success manager</li>
            <li>Custom SLA and reporting</li>
          </ul>
          <Link href="/contact" className="btn btn-ghost">Talk to sales</Link>
        </article>
      </div>

      <div className="section two-col">
        <article className="card-pad">
          <h2>Plan comparison highlights</h2>
          <p>All plans include verified listing badges, secure account access, and inquiry routing with audit trails.</p>
          <p>Higher tiers unlock featured placement, advanced reporting, and portfolio workflows for partner teams.</p>
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
