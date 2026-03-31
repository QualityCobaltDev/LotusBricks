export const dynamic = "force-dynamic";

import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AccountPage() {
  const user = await requireUser();
  const [savedCount, viewingCount, reportCount] = await Promise.all([
    prisma.savedListing.count({ where: { userId: user.id } }),
    prisma.viewingRequest.count({ where: { userId: user.id } }),
    prisma.listingReport.count({ where: { userId: user.id } })
  ]);

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6">
      <h1 className="text-2xl font-bold">My account</h1>
      <p className="text-sm text-neutral-600">Welcome back, {user.profile?.fullName || user.username}.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-4"><p className="text-sm text-neutral-500">Saved properties</p><p className="text-2xl font-bold">{savedCount}</p></div>
        <div className="rounded-xl border bg-white p-4"><p className="text-sm text-neutral-500">Viewing requests</p><p className="text-2xl font-bold">{viewingCount}</p></div>
        <div className="rounded-xl border bg-white p-4"><p className="text-sm text-neutral-500">Reports submitted</p><p className="text-2xl font-bold">{reportCount}</p></div>
      </div>
      <div className="mt-4 flex flex-wrap gap-4">
        <Link href="/account/saved" className="text-primary-700">Manage saved properties</Link>
        <Link href="/account/viewings" className="text-primary-700">Review viewing requests</Link>
        <Link href="/account/profile" className="text-primary-700">Update profile</Link>
      </div>
    </div>
  );
}
