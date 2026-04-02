"use client";

import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./language-switcher";

export function SiteHeader({ dashboardHref }: { dashboardHref: string }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navItems = [
    { href: "/listings" as const, label: t("listings") },
    { href: "/pricing" as const, label: t("pricing") },
    { href: "/about" as const, label: t("about") },
    { href: "/contact" as const, label: t("contact") }
  ];

  return (
    <header className="site-header">
      <div className="shell nav-shell">
        <Link href="/" className="brand" aria-label="RightBricks homepage">
          <span className="brand-mark">RB</span>
          <span>
            RightBricks
            <small>{useTranslations("common")("tagline")}</small>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={pathname === item.href ? "active" : ""}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="nav-ctas">
          <LanguageSwitcher />
          <Link href="/login/customer" className="btn btn-ghost">{t("customerLogin")}</Link>
          <Link href="/login/admin" className="btn btn-ghost">{t("adminLogin")}</Link>
          <Link href="/listings" className="btn btn-ghost">{t("browse")}</Link>
          <Link href={dashboardHref as any} className="btn btn-primary">{t("dashboard")}</Link>
          <button aria-label={t("openMenu")} className="mobile-toggle" onClick={() => setOpen((v) => !v)} aria-expanded={open}>☰</button>
        </div>
      </div>

      {open && (
        <div className="mobile-panel">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          <Link href="/login/customer" onClick={() => setOpen(false)}>{t("customerLogin")}</Link>
          <Link href="/login/admin" onClick={() => setOpen(false)}>{t("adminLogin")}</Link>
          <Link href={dashboardHref as any} onClick={() => setOpen(false)}>{t("dashboard")}</Link>
          <LanguageSwitcher />
        </div>
      )}
    </header>
  );
}
