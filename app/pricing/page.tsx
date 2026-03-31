import type { Metadata } from "next";
import { ButtonLink } from "@/components/site/button-link";
import { customTierContactSummary, formatRecurring, formatUsd, publicPlans } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Compare RightBricks plans with transparent monthly pricing, listing caps, and signup fee details."
};

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
      <header className="max-w-3xl space-y-3">
        <h1 className="text-3xl font-bold text-neutral-900 md:text-4xl">Simple, transparent pricing</h1>
        <p className="text-neutral-600">Every standard tier includes up to 10 photos and 2 videos per listing. One-time {formatUsd(50)} sign-up fee applies to all new standard subscriptions.</p>
      </header>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {publicPlans.map((plan) => (
          <article key={plan.key} className={`rounded-2xl border bg-white p-6 shadow-sm ${plan.featured ? "border-primary-400 ring-2 ring-primary-100" : "border-neutral-200"}`}>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-neutral-900">{plan.name}</h2>
              {plan.badge ? <span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-700">{plan.badge}</span> : null}
            </div>
            <p className="mt-2 text-3xl font-bold text-primary-700">{formatRecurring(plan)}</p>
            {plan.isContactOnly ? <p className="mt-1 text-sm font-medium text-neutral-700">More than 10 listings</p> : <p className="mt-1 text-sm text-neutral-600">+ {formatUsd(plan.oneTimeSignupFeeUsd)} one-time sign-up fee</p>}
            <p className="mt-3 text-sm text-neutral-600">{plan.notes}</p>
            <ul className="mt-4 space-y-2 text-sm text-neutral-700">
              <li>• {plan.listingLimit ? `${plan.listingLimit} listing${plan.listingLimit > 1 ? "s" : ""}` : "10+ listings"}</li>
              <li>• {plan.photosPerListing} photos per listing</li>
              <li>• {plan.videosPerListing} videos per listing</li>
              {!plan.isContactOnly ? <li>• Self-serve onboarding</li> : <li>• Sales-assisted onboarding</li>}
            </ul>
            <ButtonLink href={plan.ctaHref} className="mt-5 w-full">
              {plan.ctaLabel}
            </ButtonLink>
          </article>
        ))}
      </section>

      <section className="mt-10 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold text-neutral-900">Plan comparison</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-50 text-left">
              <tr>
                <th className="px-3 py-2">Feature</th>
                <th className="px-3 py-2">Tier 1</th>
                <th className="px-3 py-2">Tier 2</th>
                <th className="px-3 py-2">Tier 3</th>
                <th className="px-3 py-2">Custom Tier</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t"><td className="px-3 py-2">Recurring fee</td><td className="px-3 py-2">{formatRecurring(publicPlans[0])}</td><td className="px-3 py-2">{formatRecurring(publicPlans[1])}</td><td className="px-3 py-2">{formatRecurring(publicPlans[2])}</td><td className="px-3 py-2">Pricing Varies</td></tr>
              <tr className="border-t"><td className="px-3 py-2">One-time sign-up fee</td><td className="px-3 py-2">{formatUsd(50)}</td><td className="px-3 py-2">{formatUsd(50)}</td><td className="px-3 py-2">{formatUsd(50)}</td><td className="px-3 py-2">N/A</td></tr>
              <tr className="border-t"><td className="px-3 py-2">Listing cap</td><td className="px-3 py-2">1</td><td className="px-3 py-2">3</td><td className="px-3 py-2">10</td><td className="px-3 py-2">10+ (contact sales)</td></tr>
              <tr className="border-t"><td className="px-3 py-2">Photos per listing</td><td className="px-3 py-2">10</td><td className="px-3 py-2">10</td><td className="px-3 py-2">10</td><td className="px-3 py-2">10</td></tr>
              <tr className="border-t"><td className="px-3 py-2">Videos per listing</td><td className="px-3 py-2">2</td><td className="px-3 py-2">2</td><td className="px-3 py-2">2</td><td className="px-3 py-2">2</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-neutral-600">{customTierContactSummary}</p>
      </section>
    </div>
  );
}
