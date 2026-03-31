import type { Metadata } from "next";
import { ButtonLink } from "@/components/site/button-link";

const plans = [
  {
    name: "Starter",
    price: "$29",
    description: "For individual sellers testing demand.",
    features: ["1 active listing", "Lead inbox", "Basic analytics"],
    ctaHref: "/request-valuation"
  },
  {
    name: "Growth",
    price: "$79",
    description: "For serious landlords and multi-unit owners.",
    features: ["10 active listings", "Viewing scheduler", "Offer tracking"],
    ctaHref: "/landlords"
  },
  {
    name: "Pro Partner",
    price: "$199",
    description: "For agents and developers who need scale.",
    features: ["Unlimited listings", "Partner CRM", "Priority support"],
    ctaHref: "/developers"
  }
] as const;

export const metadata: Metadata = {
  title: "Pricing",
  description: "Compare seller, landlord, and developer plans on RightBricks."
};

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
      <header className="max-w-2xl space-y-3">
        <h1 className="text-3xl font-bold text-neutral-900 md:text-4xl">Simple, transparent pricing</h1>
        <p className="text-neutral-600">Choose a package built for your property goals. No hidden fees, no lock-in contracts.</p>
      </header>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <article key={plan.name} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-neutral-900">{plan.name}</h2>
            <p className="mt-1 text-3xl font-bold text-primary-700">{plan.price}</p>
            <p className="mt-2 text-sm text-neutral-600">{plan.description}</p>
            <ul className="mt-4 space-y-2 text-sm text-neutral-700">
              {plan.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
            <ButtonLink href={plan.ctaHref} className="mt-5 w-full">
              Choose {plan.name}
            </ButtonLink>
          </article>
        ))}
      </section>
    </div>
  );
}
