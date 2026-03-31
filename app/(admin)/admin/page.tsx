export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";

export default async function AdminHomePage() {
  const [users, listings, saved, requests, reports] = await Promise.all([
    prisma.user.count(), prisma.managedListing.count(), prisma.savedListing.count(), prisma.viewingRequest.count(), prisma.listingReport.count()
  ]);
  const cards = [
    ["Total users", users],
    ["Managed listings", listings],
    ["Saved properties", saved],
    ["Viewing requests", requests],
    ["Listing reports", reports]
  ];

  return <div><h1 className="text-2xl font-bold text-neutral-900">Admin Control Center</h1><p className="mt-2 text-neutral-600">Operational overview of customer and marketplace activity.</p><div className="mt-5 grid gap-4 md:grid-cols-3">{cards.map(([label, val]) => <div key={String(label)} className="rounded-xl border border-neutral-200 bg-white p-4"><p className="text-sm text-neutral-500">{label}</p><p className="text-2xl font-bold">{val}</p></div>)}</div></div>;
}
