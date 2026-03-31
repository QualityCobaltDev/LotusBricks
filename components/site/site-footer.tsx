import Link from "next/link";
import { Section } from "@/components/site/section";
import { siteConfig } from "@/lib/site-config";

const footerLinks = {
  marketplace: [
    { href: "/buy", label: "Buy" },
    { href: "/rent", label: "Rent" },
    { href: "/sell", label: "Sell" },
    { href: "/pricing", label: "Pricing" },
    { href: "/contact?plan=custom&inquiry=more-than-10-listings", label: "Custom Tier" },
    { href: "/contact", label: "Contact" }
  ],
  support: [
    { href: "/help", label: "Help Center" },
    { href: "/about", label: "About" },
    { href: "/legal/privacy", label: "Privacy Policy" },
    { href: "/legal/terms", label: "Terms" }
  ]
} as const;

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-neutral-200 bg-white">
      <Section className="py-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <p className="text-lg font-semibold text-primary-700">{siteConfig.name}</p>
            <p className="mt-3 text-sm text-neutral-600">
              Cambodia-first marketplace for trusted property discovery, verified listings, and serious seller workflows.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-900">Marketplace</h2>
            <ul className="mt-3 space-y-2 text-sm text-neutral-600">
              {footerLinks.marketplace.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary-700">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-900">Support</h2>
            <ul className="mt-3 space-y-2 text-sm text-neutral-600">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary-700">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-900">Contact</h2>
            <ul className="mt-3 space-y-2 text-sm text-neutral-600">
              <li><a href={`tel:${siteConfig.contactPhoneHref}`} className="hover:text-primary-700">{siteConfig.contactPhoneDisplay}</a></li>
              <li><a href={`mailto:${siteConfig.contactEmail}`} className="hover:text-primary-700">{siteConfig.contactEmail}</a></li>
              <li>Support: Mon-Sat, 8:00 AM - 8:00 PM</li>
            </ul>
          </div>
        </div>
      </Section>
    </footer>
  );
}
