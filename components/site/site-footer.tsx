import Link from "next/link";
import { Section } from "@/components/site/section";

const footerLinks = {
  marketplace: [
    { href: "/buy", label: "Buy" },
    { href: "/rent", label: "Rent" },
    { href: "/sell", label: "Sell" },
    { href: "/pricing", label: "Pricing" }
  ],
  partners: [
    { href: "/landlords", label: "Landlords" },
    { href: "/developers", label: "Developers" },
    { href: "/dashboard", label: "Seller Dashboard" },
    { href: "/admin", label: "Admin" }
  ]
};

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <Section className="py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="text-lg font-semibold text-brand-700">RightBricks</p>
            <p className="mt-3 text-sm text-slate-600">
              Cambodia-first marketplace for trusted property discovery, verified listings, and serious seller workflows.
            </p>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-900">Marketplace</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {footerLinks.marketplace.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-900">For Partners</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {footerLinks.partners.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </footer>
  );
}
