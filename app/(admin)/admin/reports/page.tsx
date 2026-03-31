export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";

export default async function ReportsPage() {
  const rows = await prisma.listingReport.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  return <div><h1 className="text-2xl font-bold">Reported Listings</h1><div className="mt-4 overflow-x-auto rounded-xl border bg-white"><table className="min-w-full text-sm"><thead className="bg-neutral-50"><tr><th className="p-3 text-left">Listing</th><th className="p-3 text-left">Reason</th><th className="p-3 text-left">Notes</th><th className="p-3 text-left">Status</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id} className="border-t"><td className="p-3">{row.listingSlug}</td><td className="p-3">{row.reason}</td><td className="p-3">{row.notes || "—"}</td><td className="p-3">{row.status}</td></tr>)}</tbody></table></div></div>;
}
