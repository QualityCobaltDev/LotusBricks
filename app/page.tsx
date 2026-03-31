import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-20">
      <section className="grid gap-8 md:grid-cols-2 md:items-center">
        <div className="space-y-5">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-700">Cambodia-first property platform</p>
          <h1 className="text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
            Buy, rent, and list property with trust and clarity.
          </h1>
          <p className="text-lg text-slate-600">
            RightBricks combines modern property discovery with professional seller and landlord workflows.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/buy" className="rounded-lg bg-brand-500 px-5 py-3 text-sm font-medium text-white hover:bg-brand-700">
              Start searching
            </Link>
            <Link href="/pricing" className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 hover:border-brand-500 hover:text-brand-700">
              Compare listing plans
            </Link>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">MVP focus</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-600">
            <li>SEO-ready property search and listing detail pages</li>
            <li>Seller, landlord, and admin dashboard foundations</li>
            <li>Lead management, viewings, and offer workflow</li>
            <li>Production deployment baseline for Contabo VPS</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
