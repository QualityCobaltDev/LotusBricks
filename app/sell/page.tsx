import type { Metadata } from "next";
import { ButtonLink } from "@/components/site/button-link";
import { Section } from "@/components/site/section";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Sell Property with RightBricks",
  description: "List and sell Cambodia property with verified listing workflows and lead qualification tools."
};

export default function SellPage() {
  return (
    <Section className="py-10">
      <h1 className="text-3xl font-bold text-neutral-900 md:text-4xl">Sell with confidence</h1>
      <p className="mt-3 max-w-2xl text-neutral-600">
        Publish serious listings, track enquiries, and move from interest to signed offer without losing control of your pipeline.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          "Verified listing setup and moderation review",
          "Lead inbox with response tracking",
          "Offer-ready workflow for buyer negotiations"
        ].map((item) => (
          <div key={item} className="rounded-xl border border-neutral-200 bg-white p-4 text-sm text-neutral-700">
            {item}
          </div>
        ))}
      </div>
      <div className="mt-6 flex gap-3">
        <ButtonLink href="/request-valuation">Start a valuation request</ButtonLink>
        <ButtonLink href="/pricing" variant="secondary">
          See seller plans
        </ButtonLink>
      </div>
          <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-neutral-900">FAQs</h2>
        <ul className="mt-3 space-y-2 text-sm text-neutral-700">
          <li>• How quickly can RightBricks launch my listings? Usually within 24-48 hours after verification.</li>
          <li>• How do leads work? Leads are captured, tracked, and surfaced in admin workflows with statuses.</li>
          <li>• Need direct support? <a href={`tel:${siteConfig.contactPhoneHref}`} className="text-primary-700">{siteConfig.contactPhoneDisplay}</a> or <a href={`mailto:${siteConfig.contactEmail}`} className="text-primary-700">{siteConfig.contactEmail}</a></li>
        </ul>
      </div>
    </Section>
  );
}
