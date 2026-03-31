import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

export type DashboardLink = { label: string; href: Route };

export function DashboardLayout({ title, links, children }: { title: string; links: DashboardLink[]; children: ReactNode }) {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h3>{title}</h3>
        <nav>
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      <section>{children}</section>
    </div>
  );
}
