import Link from "next/link";
import { routes } from "@/lib/routes";

export default function SellPage() {
  return (
    <section className="card card-body">
      <h1>Sell with RightBricks</h1>
      <p>Get valuation support, premium exposure, and qualified buyer inquiries.</p>
      <ul>
        <li>Dedicated onboarding specialist</li>
        <li>Professional media guidelines</li>
        <li>Admin-managed publish workflow</li>
      </ul>
      <div style={{ display: "flex", gap: "0.75rem" }}>
        <Link href={`${routes.contact}?inquiry=valuation`}>Request valuation</Link>
        <Link href={routes.pricing}>See pricing</Link>
      </div>
    </section>
  );
}
