"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/listings", label: "Listings" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

export function SiteHeader({
  dashboardHref,
  contactPhoneHref,
  contactPhoneDisplay
}: {
  dashboardHref: string;
  contactPhoneHref: string;
  contactPhoneDisplay: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="shell nav-shell">
        <Link href="/" className="brand" aria-label="RightBricks homepage">
          <span className="brand-mark">RB</span>
          <span>
            RightBricks
            <small>Verified property intelligence</small>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href as any} className={pathname === item.href ? "active" : ""}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="nav-ctas">
          <a href={contactPhoneHref} className="contact-pill" aria-label="Call RightBricks">
            {contactPhoneDisplay}
          </a>
          <Link href="/listings" className="btn btn-ghost">Browse</Link>
          <Link href={dashboardHref as any} className="btn btn-primary">
            {dashboardHref === "/sign-in" ? "Sign In" : "Dashboard"}
          </Link>
          <button aria-label="Open menu" className="mobile-toggle" onClick={() => setOpen((v) => !v)} aria-expanded={open}>☰</button>
        </div>
      </div>

      {open && (
        <div className="mobile-panel">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href as any} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          <a href={contactPhoneHref}>{contactPhoneDisplay}</a>
          <Link href={dashboardHref as any} onClick={() => setOpen(false)}>
            {dashboardHref === "/sign-in" ? "Sign In" : "Dashboard"}
          </Link>
        </div>
      )}
    </header>
  );
}
