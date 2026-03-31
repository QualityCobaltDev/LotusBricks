import Link from "next/link";
import { ButtonLink } from "@/components/site/button-link";
import { siteConfig } from "@/lib/site-config";

export function PublicNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto max-w-7xl px-4 py-3 md:px-6" aria-label="Primary">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="text-lg font-semibold text-brand-700">
            {siteConfig.name}
          </Link>

          <ul className="hidden items-center gap-6 md:flex">
            {siteConfig.nav.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-slate-700 hover:text-brand-700">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-2 md:flex">
            <a href={`tel:${siteConfig.contactPhoneHref}`} className="text-sm text-slate-700 hover:text-brand-700">{siteConfig.contactPhoneDisplay}</a>
            <Link href="/auth/login" className="text-sm text-slate-700 hover:text-brand-700">
              Sign in
            </Link>
            <ButtonLink href="/request-valuation">List your property</ButtonLink>
          </div>
        </div>

        <details className="mt-3 md:hidden">
          <summary className="cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800">
            Menu
          </summary>
          <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <ul className="space-y-3">
              {siteConfig.nav.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="block text-sm text-slate-700 hover:text-brand-700">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-col gap-2">
              <a href={`mailto:${siteConfig.contactEmail}`} className="text-sm text-slate-700 hover:text-brand-700">{siteConfig.contactEmail}</a>
              <Link href="/auth/login" className="text-sm text-slate-700 hover:text-brand-700">
                Sign in
              </Link>
              <ButtonLink href="/request-valuation">List your property</ButtonLink>
            </div>
          </div>
        </details>
      </nav>
    </header>
  );
}
