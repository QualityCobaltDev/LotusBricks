import Link from "next/link";
import { requireAdmin } from "@/server/guards";
import { db } from "@/lib/db";

export default async function AdminPage() {
  await requireAdmin();
  const [users, listings, inquiries, customInquiries] = await Promise.all([
    db.user.count(),
    db.listing.count(),
    db.inquiry.count(),
    db.inquiry.count({ where: { inquiryType: "CUSTOM_PLAN" } })
  ]);

  return (
    <section>
      <h1>Admin dashboard</h1>
      <p>Users: {users} | Listings: {listings} | Inquiries: {inquiries} | Custom tier leads: {customInquiries}</p>
      <p><Link href='/admin/listings'>Manage listings</Link> · <Link href='/admin/users'>Users</Link> · <Link href='/admin/content'>Content</Link> · <Link href='/admin/pricing'>Pricing</Link></p>
    </section>
  );
}
