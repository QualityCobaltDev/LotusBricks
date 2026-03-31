export const dynamic = "force-dynamic";

import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Section } from "@/components/site/section";

export default async function AccountPage() {
  const user = await requireUser();
  const [savedCount, viewingCount, reportCount] = await Promise.all([
    prisma.savedListing.count({ where: { userId: user.id } }),
    prisma.viewingRequest.count({ where: { userId: user.id } }),
    prisma.listingReport.count({ where: { userId: user.id } })
  ]);

  return (
    <Section className="py-10">
      <h1 className="text-2xl font-bold">My account</h1>
      <p className="text-sm text-neutral-600">Welcome back, {user.profile?.fullName || user.username}.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-4"><p className="text-sm text-neutral-500">Saved properties</p><p className="text-2xl font-bold">{savedCount}</p></div>
        <div className="rounded-xl border bg-white p-4"><p className="text-sm text-neutral-500">Viewing requests</p><p className="text-2xl font-bold">{viewingCount}</p></div>
        <div className="rounded-xl border bg-white p-4"><p className="text-sm text-neutral-500">Reports submitted</p><p className="text-2xl font-bold">{reportCount}</p></div>
      </div>
      <div className="mt-4 flex gap-4"><Link href="/account/saved" className="text-primary-700">Manage saved properties</Link><form action="/api/auth/logout" method="post"><button className="text-secondary-700">Sign out</button></form></div>
    </Section>
  );
}
