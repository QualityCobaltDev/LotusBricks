import type { Metadata } from "next";
import { ButtonLink } from "@/components/site/button-link";
import { Section } from "@/components/site/section";
import { siteConfig } from "@/lib/site-config";

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
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-900">FAQs</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          <li>• How quickly can RightBricks launch my listings? Usually within 24-48 hours after verification.</li>
          <li>• How do leads work? Leads are captured, tracked, and surfaced in admin workflows with statuses.</li>
          <li>• Need direct support? <a href={`tel:${siteConfig.contactPhoneHref}`} className="text-brand-700">{siteConfig.contactPhoneDisplay}</a> or <a href={`mailto:${siteConfig.contactEmail}`} className="text-brand-700">{siteConfig.contactEmail}</a></li>
        </ul>
      </div>
    </Section>
  );
}
