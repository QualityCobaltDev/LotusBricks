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

export function SiteHeader({ dashboardHref }: { dashboardHref: string }) {
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
          <Link href="/login/customer" className="btn btn-ghost">Customer Login</Link>
          <Link href="/login/admin" className="btn btn-ghost">Admin Login</Link>
          <Link href="/listings" className="btn btn-ghost">Browse</Link>
          <Link href={dashboardHref as any} className="btn btn-primary">Dashboard</Link>
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
          <Link href="/login/customer" onClick={() => setOpen(false)}>Customer Login</Link>
          <Link href="/login/admin" onClick={() => setOpen(false)}>Admin Login</Link>
          <Link href={dashboardHref as any} onClick={() => setOpen(false)}>Dashboard</Link>
        </div>
      )}
    </header>
  );
}
