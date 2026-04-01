import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buyer due-diligence checklist",
  description: "A practical due-diligence checklist for evaluating Cambodia property listings.",
  alternates: { canonical: "/resources/buyer-due-diligence-checklist" }
};

export default function BuyerDueDiligenceChecklistPage() {
  return (
    <section className="shell section narrow">
      <h1>Buyer due-diligence checklist</h1>
      <p className="muted">Validate listing media, ownership documentation, pricing comparables, and inquiry readiness before committing.</p>
    </section>
  );
}
