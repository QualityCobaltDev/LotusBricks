import Link from "next/link";

const links = ["Listings", "Leads", "Viewings", "Offers", "Documents", "Billing", "Support"];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-[calc(100vh-64px)] grid-cols-1 md:grid-cols-[260px_1fr]">
      <aside className="border-r border-neutral-200 bg-white p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Seller Dashboard</h2>
        <ul className="mt-4 space-y-2">
          {links.map((link) => (
            <li key={link}>
              <Link href="#" className="block rounded-md px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100">
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
