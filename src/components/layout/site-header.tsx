import Link from "next/link";
import { routes } from "@/lib/routes";

const navLinks = [
  ["Buy", routes.buy],
  ["Rent", routes.rent],
  ["Sell", routes.sell],
  ["Landlords", routes.landlords],
  ["Developers", routes.developers],
  ["Pricing", routes.pricing],
  ["About", routes.about],
  ["Contact", routes.contact]
] as const;

export function SiteHeader() {
  return (
    <header className="topnav">
      <div className="container topnav-inner">
        <Link href={routes.home}><strong>RightBricks</strong></Link>
        <nav className="topnav-links">
          {navLinks.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
          <Link href={routes.login}>Login</Link>
        </nav>
      </div>
    </header>
  );
}
