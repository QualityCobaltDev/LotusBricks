import Link from "next/link";
import { Section } from "@/components/site/section";

export default function NotFound() {
  return (
    <Section className="py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-brand-700">404</p>
      <h1 className="mt-3 text-3xl font-bold text-slate-900">Page not found</h1>
      <p className="mt-3 text-slate-600">The page you were looking for does not exist or may have moved.</p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/" className="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700">
          Go home
        </Link>
        <Link href="/buy" className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 hover:border-brand-500 hover:text-brand-700">
          Browse listings
        </Link>
      </div>
    </Section>
  );
}
