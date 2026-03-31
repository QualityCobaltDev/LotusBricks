import type { Metadata } from "next";
import { ValuationForm } from "@/components/forms/valuation-form";
import { Section } from "@/components/site/section";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Request Property Valuation",
  description: "Submit your property details to start a RightBricks listing and valuation workflow."
};

export default function RequestValuationPage() {
  return (
    <Section className="py-12">
      <div className="mx-auto max-w-2xl rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-neutral-900">Request a valuation</h1>
        <p className="mt-2 text-sm text-neutral-600">Share property details and our team will send a pricing recommendation and listing plan.</p>
        <ValuationForm />
        <p className="mt-4 text-xs text-neutral-500">Need immediate support? <a href={`tel:${siteConfig.contactPhoneHref}`}>{siteConfig.contactPhoneDisplay}</a> or <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>.</p>
      </div>
    </Section>
  );
}
