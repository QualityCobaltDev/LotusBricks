import type { Metadata } from "next";
import { Section } from "@/components/site/section";

export const metadata: Metadata = {
  title: "Request Property Valuation",
  description: "Submit your property details to start a RightBricks listing and valuation workflow."
};

export default function RequestValuationPage() {
  return (
    <Section className="py-12">
      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Request a valuation</h1>
        <p className="mt-2 text-sm text-slate-600">Share basic details and our team will propose pricing and next listing steps.</p>
        <form className="mt-5 grid gap-3 md:grid-cols-2">
          <input placeholder="Full name" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <input placeholder="Phone" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <input placeholder="City" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <input placeholder="Property type" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <textarea placeholder="Property details" rows={4} className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2" />
          <button type="button" className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white md:col-span-2">
            Submit request
          </button>
        </form>
      </div>
    </Section>
  );
}
