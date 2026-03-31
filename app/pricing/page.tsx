const plans = [
  {
    name: "Starter",
    price: "$29",
    description: "For individual sellers testing demand.",
    features: ["1 active listing", "Lead inbox", "Basic analytics"]
  },
  {
    name: "Growth",
    price: "$79",
    description: "For serious landlords and multi-unit owners.",
    features: ["10 active listings", "Viewing scheduler", "Offer tracking"]
  },
  {
    name: "Pro Partner",
    price: "$199",
    description: "For agents and developers who need scale.",
    features: ["Unlimited listings", "Partner CRM", "Priority support"]
  }
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
      <header className="max-w-2xl space-y-3">
        <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">Simple, transparent pricing</h1>
        <p className="text-slate-600">Choose a package built for your property goals. No hidden fees, no lock-in contracts.</p>
      </header>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <article key={plan.name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">{plan.name}</h2>
            <p className="mt-1 text-3xl font-bold text-brand-700">{plan.price}</p>
            <p className="mt-2 text-sm text-slate-600">{plan.description}</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              {plan.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
            <button className="mt-5 w-full rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
              Choose {plan.name}
            </button>
          </article>
        ))}
      </section>
    </div>
  );
}
