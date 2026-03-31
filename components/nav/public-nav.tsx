import Link from "next/link";

const links = [
  { href: "/buy", label: "Buy" },
  { href: "/rent", label: "Rent" },
  { href: "/sell", label: "Sell" },
  { href: "/landlords", label: "Landlords" },
  { href: "/developers", label: "Developers" },
  { href: "/pricing", label: "Pricing" }
];

export function PublicNav() {
  return (
    <header className="border-b border-slate-200 bg-white">
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

        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="text-sm text-slate-700 hover:text-brand-700">
            Sign in
          </Link>
          <Link
            href="/request-valuation"
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            List your property
          </Link>
        </div>
      </nav>
    </header>
  );
}
