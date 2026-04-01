import { requireAdmin } from "@/server/guards";
import { db } from "@/lib/db";

export default async function Inquiries() {
  await requireAdmin();
  const rows = await db.inquiry.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  return (
    <section>
      <h1>Inquiries</h1>
      <ul>
        {rows.map((r) => (
          <li key={r.id}>
            {r.fullName} · {r.email} · {r.inquiryType} · {r.selectedPlan ?? "n/a"}
            {r.requestedListings ? ` · needs ${r.requestedListings} listings` : ""}
          </li>
        ))}
      </ul>
    </section>
  );
}
