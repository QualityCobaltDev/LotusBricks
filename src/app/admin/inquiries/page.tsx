import { requireAdmin } from "@/server/guards";
import { db } from "@/lib/db";
import { LeadsControlBoard } from "@/components/admin/leads-control-board";

export default async function Inquiries() {
  await requireAdmin();
  const rows = await db.inquiry.findMany({ orderBy: { createdAt: "desc" }, take: 150, include: { listing: { select: { title: true, slug: true } } } });

  return (
    <section className="section">
      <div className="section-head">
        <h2>Lead Management & Assignment Board</h2>
        <p className="muted">Run qualification, assignment, and pipeline progression from a single lead workspace.</p>
      </div>
      <LeadsControlBoard rows={rows} />
    </section>
  );
}
