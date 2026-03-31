import Link from "next/link";
import { routes } from "@/lib/routes";

const plans = [
  { name: "Tier 1", listings: 1, price: 150 },
  { name: "Tier 2", listings: 3, price: 225 },
  { name: "Tier 3", listings: 10, price: 450 }
];

export default function PricingPage() {
  return (
    <div className="grid" style={{ gap: "1rem" }}>
      <h1>Listing Pricing</h1>
      <p>All plans include a mandatory one-time account setup fee of <strong>$50</strong>.</p>
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))" }}>
        {plans.map((plan) => (
          <article key={plan.name} className="card card-body">
            <h2>{plan.name}</h2>
            <p><strong>${plan.price}</strong> / month</p>
            <p>{plan.listings} active listing{plan.listings > 1 ? "s" : ""}</p>
            <small>Each listing includes up to 10 photos and 2 videos.</small>
            <Link href={`${routes.contact}?plan=${encodeURIComponent(plan.name)}`}>Start this plan</Link>
          </article>
        ))}
        <article className="card card-body">
          <h2>Custom Tier</h2>
          <p>More than 10 listings with variable pricing and enterprise support.</p>
          <Link href={`${routes.contact}?inquiry=custom-tier`}>Contact sales</Link>
        </article>
      </div>
    </div>
  );
}
