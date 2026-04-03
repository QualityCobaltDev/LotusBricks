"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/site/theme-toggle";

const navItems = [
  { href: "/listings", label: "Browse Listings" },
  { href: "/pricing", label: "List Property" },
  { href: "/about", label: "Why RightBricks" },
  { href: "/contact", label: "Contact" },
  { href: "/discover", label: "Discover" },
  { href: "/resources", label: "Resources" }
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="shell nav-shell">
        <div className="nav-left">
          <Link href="/" className="brand" aria-label="RightBricks homepage">
            <span className="brand-mark" aria-hidden="true">RB</span>
            <span className="brand-copy">
              <strong>RightBricks</strong>
              <small>Cambodia&apos;s verified property platform</small>
            </span>
          </Link>
        </div>

        <nav className="desktop-nav nav-center" aria-label="Primary">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href as any} className={pathname === item.href ? "active" : ""}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="nav-right">
          <div className="nav-ctas">
            <ThemeToggle />
            <div className="nav-buttons">
              <Link href="/listings" className="btn btn-outline" data-track-event="click_browse_listings" data-track-label="header-browse">View Listings</Link>
              <Link href="/pricing" className="btn btn-primary" data-track-event="choose_tier" data-track-label="header-list-property">List Your Property</Link>
            </div>
          </div>
          <button aria-label={open ? "Close menu" : "Open menu"} className="mobile-toggle" onClick={() => setOpen((v) => !v)} aria-expanded={open}>☰</button>
        </div>
      </div>

      <div className={`mobile-menu-overlay ${open ? "open" : ""}`} onClick={() => setOpen(false)} aria-hidden={!open} />
      <div className={`mobile-panel ${open ? "open" : ""}`} aria-hidden={!open}>
        {navItems.map((item, index) => (
          <Link
            key={item.href}
            href={item.href as any}
            onClick={() => setOpen(false)}
            style={{ transitionDelay: `${120 + index * 60}ms` }}
          >
            {item.label}
          </Link>
        ))}
        <div style={{ transitionDelay: "320ms" }}>
          <ThemeToggle />
        </div>
        <Link className="btn btn-primary" href="/pricing" onClick={() => setOpen(false)} style={{ transitionDelay: "360ms" }} data-track-event="choose_tier" data-track-label="mobile-list-property">List Your Property</Link>
      </div>
    </header>
  );
}
