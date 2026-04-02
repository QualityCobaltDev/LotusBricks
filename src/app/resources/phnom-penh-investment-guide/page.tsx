import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Phnom Penh investment guide",
  description: "District-level signals and checkpoints for property investment decisions in Phnom Penh.",
  alternates: { canonical: "/resources/phnom-penh-investment-guide" }
};

export default function PhnomPenhInvestmentGuidePage() {
  return (
    <section className="shell section narrow">
      <h1>Phnom Penh investment guide</h1>
      <p className="muted">Use district-level context, verification standards, and documentation checks to make faster, lower-risk decisions.</p>
    </section>
  );
}
