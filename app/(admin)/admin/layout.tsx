import Link from "next/link";

const links = ["Users", "Listings Moderation", "Leads", "Areas", "Content", "Audit Logs", "Settings"];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-[calc(100vh-64px)] grid-cols-1 md:grid-cols-[280px_1fr]">
      <aside className="border-r border-slate-200 bg-slate-900 p-4 text-white">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Admin Ops</h2>
        <ul className="mt-4 space-y-2">
          {links.map((link) => (
            <li key={link}>
              <Link href="#" className="block rounded-md px-3 py-2 text-sm text-slate-200 hover:bg-slate-800">
                {link}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
      <section className="p-6">{children}</section>
    </div>
  );
}
