import Link from "next/link";
import { requireAdmin } from "@/server/guards";
import { db } from "@/lib/db";
import { InquiryStatusForm } from "@/components/admin/inquiry-status-form";

export default async function Inquiries() {
  await requireAdmin();
  const rows = await db.inquiry.findMany({ orderBy: { createdAt: "desc" }, take: 100, include: { listing: { select: { title: true, slug: true } } } });

  return (
    <section className="shell section">
      <h1>Lead management</h1>
      <p className="muted">Track, qualify, assign, and progress every inbound lead with full visibility.</p>
      <div className="admin-table-wrap">
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Lead</th>
              <th>Type</th>
              <th>Source</th>
              <th>Urgent</th>
              <th>Status workflow</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>
                  <strong>{r.fullName}</strong><br />
                  {r.email} {r.phone ? `· ${r.phone}` : ""}<br />
                  <small>{new Date(r.createdAt).toISOString().replace("T", " ").slice(0, 19)} UTC</small>
                </td>
                <td>{r.inquiryType}</td>
                <td>
                  {r.listing ? <Link href={`/listings/${r.listing.slug}`}>{r.listing.title}</Link> : "General"}
                  <br /><small>{r.sourcePage ?? "n/a"}</small>
                </td>
                <td>{r.isUrgent ? "Yes" : "No"}</td>
                <td><InquiryStatusForm id={r.id} currentStatus={r.status} notes={r.notes} assignedTo={r.assignedTo} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
