export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";

export default async function UsersPage() {
  const rows = await prisma.user.findMany({ orderBy: { createdAt: "desc" }, include: { profile: true, _count: { select: { savedListings: true } } } });
  return <div><h1 className="text-2xl font-bold">Users</h1><div className="mt-4 overflow-x-auto rounded-xl border bg-white"><table className="min-w-full text-sm"><thead className="bg-neutral-50"><tr><th className="p-3 text-left">Name</th><th className="p-3 text-left">Email</th><th className="p-3 text-left">Role</th><th className="p-3 text-left">Saved</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id} className="border-t"><td className="p-3">{row.profile?.fullName || row.username}</td><td className="p-3">{row.email}</td><td className="p-3">{row.role}</td><td className="p-3">{row._count.savedListings}</td></tr>)}</tbody></table></div></div>;
}
