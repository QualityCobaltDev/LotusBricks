import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";
import { Section } from "@/components/site/section";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = { title: "Contact RightBricks", description: "Contact RightBricks support, sales, and partnership team." };

export default function ContactPage() {
  return (
    <Section className="py-12">
      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold">Contact RightBricks</h1>
          <p className="mt-2 text-sm text-neutral-600">For support, standard plan onboarding, and Custom Tier inquiries for more than 10 listings.</p>
          <div className="mt-4"><ContactForm /></div>
        </div>
        <aside className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm text-sm text-neutral-700">
          <p><strong>Phone:</strong> <a href={`tel:${siteConfig.contactPhoneHref}`}>{siteConfig.contactPhoneDisplay}</a></p>
          <p><strong>Email:</strong> <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a></p>
          <p className="mt-3">Need more than 10 listings? Ask for the Custom Tier and our sales team will tailor pricing to your portfolio.</p>
        </aside>
      </div>
    </Section>
  );
}
