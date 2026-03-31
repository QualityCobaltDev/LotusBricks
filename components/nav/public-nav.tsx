import Link from "next/link";
import { ButtonLink } from "@/components/site/button-link";

const links = [
  { href: "/buy", label: "Buy" },
  { href: "/rent", label: "Rent" },
  { href: "/sell", label: "Sell" },
  { href: "/landlords", label: "Landlords" },
  { href: "/developers", label: "Developers" },
  { href: "/pricing", label: "Pricing" }
] as const;

export function PublicNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="text-lg font-semibold text-brand-700">
          RightBricks
        </Link>

        <ul className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-sm text-slate-700 hover:text-brand-700">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link href="/auth/login" className="text-sm text-slate-700 hover:text-brand-700">
            Sign in
          </Link>
          <ButtonLink href="/request-valuation" className="hidden sm:inline-flex">
            List your property
          </ButtonLink>
        </div>
      </nav>
    </header>
  );
}
