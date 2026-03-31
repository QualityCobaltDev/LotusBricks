import type { Metadata } from "next";
import { ButtonLink } from "@/components/site/button-link";
import { Section } from "@/components/site/section";

export const metadata: Metadata = {
  title: "Landlord Tools",
  description: "Scale your Cambodia rental portfolio with listing operations, lead triage, and reporting workflows."
};

export default function LandlordsPage() {
  return (
    <Section className="py-10">
      <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">Landlord growth tools</h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Built for owners managing multiple units who need predictable occupancy and fast, qualified tenant responses.
      </p>
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <ul className="space-y-3 text-sm text-slate-700">
          <li>• Portfolio-level listing publishing with reusable templates.</li>
          <li>• Tenant enquiry triage and lead qualification pipeline.</li>
          <li>• Reporting on unit performance by district and property type.</li>
        </ul>
      </div>
      <div className="mt-6 flex gap-3">
        <ButtonLink href="/pricing">Compare landlord plans</ButtonLink>
        <ButtonLink href="/dashboard" variant="secondary">
          View dashboard
        </ButtonLink>
      </div>
    </Section>
  );
}
