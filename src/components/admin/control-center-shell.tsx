"use client";

import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { AdminLogoutButton } from "@/components/admin/admin-logout-button";

const NAV = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Listings", href: "/admin/listings" },
  { label: "Leads", href: "/admin/inquiries" },
  { label: "Users", href: "/admin/users" },
  { label: "Website CMS", href: "/admin/content" },
  { label: "Pricing & Plans", href: "/admin/pricing" },
  { label: "Messaging & SMTP", href: "/admin/settings" },
  { label: "Analytics", href: "/admin/analytics" },
  { label: "System Logs", href: "/admin/system" }
];

export function ControlCenterShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const links = useMemo(() => NAV.filter((item) => item.label.toLowerCase().includes(query.toLowerCase())), [query]);

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div>
          <p className="admin-kicker">RightBricks</p>
          <h2>Control Center</h2>
          <p className="muted">Operations, CRM, CMS, and growth systems in one admin workspace.</p>
        </div>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Find module" aria-label="Find admin module" />
        <nav className="admin-nav-links">
          {links.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <a key={item.href} href={item.href} className={active ? "active" : ""}>{item.label}</a>
            );
          })}
        </nav>
      </aside>
      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="muted">Internal Admin Operating System</p>
            <h1>RightBricks Admin Control Center</h1>
          </div>
          <div className="admin-topbar-actions">
            <a className="btn btn-ghost" href="/">Open Website</a>
            <a className="btn btn-primary" href="/admin/listings">Listing Operations</a>
            <AdminLogoutButton />
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
