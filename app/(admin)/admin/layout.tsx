import Link from "next/link";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/leads", label: "Lead Management" },
  { href: "/admin/email-logs", label: "Email Logs" },
  { href: "/admin/settings", label: "Contact & Email Settings" }
] as const;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-[calc(100vh-64px)] grid-cols-1 md:grid-cols-[280px_1fr]">
      <aside className="border-r border-primary-800 bg-primary-900 p-4 text-white">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-primary-200">Admin Ops</h2>
        <ul className="mt-4 space-y-2">{links.map((link) => <li key={link.href}><Link href={link.href} className="block rounded-md px-3 py-2 text-sm text-primary-100 hover:bg-primary-800">{link.label}</Link></li>)}</ul>
      </aside>
      <section className="p-6">{children}</section>
    </div>
  );
}
