export const dynamic = "force-dynamic";

import { requireUser } from "@/lib/auth";

export default async function AccountProfilePage() {
  const user = await requireUser();

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6">
      <h1 className="text-2xl font-bold">Profile & settings</h1>
      <p className="mt-1 text-sm text-neutral-600">Manage your account identity and contact preferences.</p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
          <p className="text-sm text-neutral-500">Full name</p>
          <p className="font-medium text-neutral-900">{user.profile?.fullName || "Not set"}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
          <p className="text-sm text-neutral-500">Username</p>
          <p className="font-medium text-neutral-900">{user.username}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
          <p className="text-sm text-neutral-500">Email</p>
          <p className="font-medium text-neutral-900">{user.email}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
          <p className="text-sm text-neutral-500">Role</p>
          <p className="font-medium text-neutral-900">{user.role}</p>
        </div>
      </div>
      <p className="mt-4 text-sm text-neutral-600">Profile editing APIs can be added next without changing this account information architecture.</p>
    </div>
  );
}
