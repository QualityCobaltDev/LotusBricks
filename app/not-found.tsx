import Link from "next/link";
import { Section } from "@/components/site/section";

export default function NotFound() {
  return (
    <Section className="py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-primary-700">404</p>
      <h1 className="mt-3 text-3xl font-bold text-neutral-900">Page not found</h1>
      <p className="mt-3 text-neutral-600">The page you were looking for does not exist or may have moved.</p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/" className="rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700">
          Go home
        </Link>
        <Link href="/buy" className="rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-800 hover:border-primary-600 hover:text-primary-700">
          Browse listings
        </Link>
      </div>
    </Section>
  );
}
