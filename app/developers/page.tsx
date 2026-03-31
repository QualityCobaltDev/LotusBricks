import type { Metadata } from "next";
import { ButtonLink } from "@/components/site/button-link";
import { Section } from "@/components/site/section";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Developer Marketing",
  description: "Market new residential projects with trusted inventory pages and qualified demand capture."
};

export default function DevelopersPage() {
  return (
    <Section className="py-10">
      <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">Developer launch channel</h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Present projects with structured unit inventory, quality branding, and lead capture tuned for off-plan and completed units.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="text-lg font-semibold text-slate-900">Project visibility</h2>
          <p className="mt-2 text-sm text-slate-700">Feature your project with branded pages and curated listing placements.</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="text-lg font-semibold text-slate-900">Demand qualification</h2>
          <p className="mt-2 text-sm text-slate-700">Capture and segment buyer leads by budget, unit type, and timeline.</p>
        </article>
      </div>
      <div className="mt-6 flex gap-3">
        <ButtonLink href="/pricing">See developer packages</ButtonLink>
        <ButtonLink href="/sell" variant="secondary">
          List inventory
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
