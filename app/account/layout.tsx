export const dynamic = "force-dynamic";

import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { SignOutButton } from "@/components/auth/sign-out-button";

const links = [
  { href: "/account", label: "Overview" },
  { href: "/account/saved", label: "Saved properties" },
  { href: "/account/viewings", label: "Scheduled viewings" },
  { href: "/account/reports", label: "Reported listings" },
  { href: "/account/profile", label: "Profile & settings" }
] as const;

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-[260px_1fr] md:px-6">
      <aside className="rounded-2xl border border-neutral-200 bg-white p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">My account</h2>
        <p className="mt-1 text-sm text-neutral-700">{user.profile?.fullName || user.username}</p>
        <ul className="mt-4 space-y-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="block rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <SignOutButton className="mt-4 rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50" />
      </aside>
      <section>{children}</section>
    </div>
  );
}
