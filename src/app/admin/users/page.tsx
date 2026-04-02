import { requireAdmin } from "@/server/guards";
import { db } from "@/lib/db";

export default async function AdminUsers() {
  await requireAdmin();
  const [users, byRole] = await Promise.all([
    db.user.findMany({ orderBy: { createdAt: "desc" }, include: { listings: true, inquiries: true, favorites: true } }),
    db.user.groupBy({ by: ["role"], _count: true })
  ]);

  return (
    <section className="section">
      <div className="section-head">
        <h2>Users, Accounts & Access</h2>
        <p className="muted">Monitor customer/admin activity, associated resources, and account health.</p>
      </div>
      <div className="three-col">
        {byRole.map((role) => <article key={role.role} className="stat-card"><p>{role._count}</p><span>{role.role}</span></article>)}
      </div>
      <div className="card-pad admin-table-wrap">
        <table className="comparison-table">
          <thead><tr><th>User</th><th>Role</th><th>Status</th><th>Listings</th><th>Saved properties</th><th>Linked leads</th><th>Tier</th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td><strong>{u.fullName}</strong><br />{u.email}<br /><small>{u.phone ?? "No phone"}</small></td>
                <td>{u.role}</td>
                <td>{u.isActive ? "Active" : "Disabled"}</td>
                <td>{u.listings.length}</td>
                <td>{u.favorites.length}</td>
                <td>{u.inquiries.length}</td>
                <td>{u.planTier}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
