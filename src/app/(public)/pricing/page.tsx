import Link from "next/link";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

const tiers = [
  { name: "Tier 1", listings: "1 listing", monthly: "$99" },
  { name: "Tier 2", listings: "3 listings", monthly: "$249" },
  { name: "Tier 3", listings: "10 listings", monthly: "$699" },
  { name: "Custom", listings: "Unlimited", monthly: "Contact us" }
];

export default function PricingPage() {
  return (
    <section>
      <h1>Pricing</h1>
      <p>Every plan includes a one-time $50 signup fee and 10 photos + 2 videos per listing.</p>
      <div className="grid cards">
        {tiers.map((tier) => (
          <Card key={tier.name}>
            <CardBody>
              <h3>{tier.name}</h3>
              <p>{tier.listings}</p>
              <p><strong>{tier.monthly}</strong> / month</p>
              <Link href={`${routes.contact}?plan=${encodeURIComponent(tier.name)}&inquiry=pricing`}>
                <Button>{tier.name === "Custom" ? "Contact sales" : "Choose plan"}</Button>
              </Link>
            </CardBody>
          </Card>
        ))}
      </div>
    </section>
  );
}
