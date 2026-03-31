export const dynamic = "force-dynamic";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AccountViewingsPage() {
  const user = await requireUser();
  const rows = await prisma.viewingRequest.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 100 });

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6">
      <h1 className="text-2xl font-bold">Scheduled viewings</h1>
      <p className="mt-1 text-sm text-neutral-600">Track your requested property tours and their current status.</p>
      {!rows.length ? (
        <p className="mt-4 text-sm text-neutral-600">No viewing requests yet. Submit a request from any listing page.</p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-xl border border-neutral-200">
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-50">
              <tr>
                <th className="p-3 text-left">Listing</th>
                <th className="p-3 text-left">Preferred date</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-neutral-200">
                  <td className="p-3">{row.listingSlug}</td>
                  <td className="p-3">{new Date(row.preferredDate).toLocaleString()}</td>
                  <td className="p-3">{row.status}</td>
                  <td className="p-3">{new Date(row.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
