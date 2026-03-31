export const dynamic = "force-dynamic";

import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getListingBySlug } from "@/lib/marketplace-data";
import { SaveButton } from "@/components/marketplace/save-button";

export default async function SavedPage() {
  const user = await requireUser();
  const rows = await prisma.savedListing.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } });
  const listings = rows.map((row) => getListingBySlug(row.listingSlug)).filter(Boolean);

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6">
      <h1 className="text-2xl font-bold">Saved properties</h1>
      {!listings.length ? <p className="mt-4 text-neutral-600">No saved properties yet.</p> : <div className="mt-4 space-y-3">{listings.map((listing) => listing ? <div key={listing.slug} className="flex items-center justify-between rounded border bg-white p-4"><div><Link href={`/listings/${listing.slug}`} className="font-semibold text-primary-700">{listing.title}</Link><p className="text-sm text-neutral-600">{listing.city} · ${listing.priceUsd.toLocaleString()}</p></div><SaveButton listingSlug={listing.slug} initialSaved /></div> : null)}</div>}
    </div>
  );
}
