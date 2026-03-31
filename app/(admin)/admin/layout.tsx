export const dynamic = "force-dynamic";

import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { SignOutButton } from "@/components/auth/sign-out-button";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/listings", label: "Listings" },
  { href: "/admin/viewing-requests", label: "Viewing Requests" },
  { href: "/admin/reports", label: "Reported Listings" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/settings", label: "Settings" }
] as const;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  return (
    <div className="grid min-h-[calc(100vh-64px)] grid-cols-1 md:grid-cols-[280px_1fr]">
      <aside className="border-r border-primary-800 bg-primary-900 p-4 text-white">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-primary-200">Admin Dashboard</h2>
        <p className="mt-1 text-xs text-primary-300">Signed in as {user.username}</p>
        <ul className="mt-4 space-y-2">{links.map((link) => <li key={link.href}><Link href={link.href} className="block rounded-md px-3 py-2 text-sm text-primary-100 hover:bg-primary-800">{link.label}</Link></li>)}</ul>
        <SignOutButton className="mt-6 rounded bg-primary-700 px-3 py-2 text-sm" />
      </aside>
      <section className="p-6">{children}</section>
    </div>
  );
}
