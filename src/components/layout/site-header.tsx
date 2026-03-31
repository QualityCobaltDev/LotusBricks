import Link from "next/link";
import { routes } from "@/lib/routes";

const navLinks = [
  ["Buy", routes.buy],
  ["Rent", routes.rent],
  ["Sell", routes.sell],
  ["Developers", routes.developers],
  ["Pricing", routes.pricing],
  ["Contact", routes.contact]
] as const;

export function SiteHeader() {
  return (
    <header className="topnav">
      <div className="container topnav-inner">
        <Link href={routes.home}>
          <strong>LotusBricks</strong>
        </Link>
        <nav className="topnav-links">
          {navLinks.map(([label, href]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
          <Link href={routes.login}>Login</Link>
          <Link href={routes.account}>Account</Link>
          <Link href={routes.admin}>Admin</Link>
        </nav>
      </div>
    </header>
  );
}
