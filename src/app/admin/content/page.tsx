import { requireAdmin } from "@/server/guards";
import { getCmsSections } from "@/lib/admin-control";
import { CmsSectionsEditor } from "@/components/admin/cms-sections-editor";

export default async function ContentPage() {
  await requireAdmin();
  const rows = await getCmsSections();

  return (
    <section className="section">
      <div className="section-head">
        <h2>Website CMS & SEO Control</h2>
        <p className="muted">Edit homepage blocks, trust pages, legal text, metadata, and publication states without code changes.</p>
      </div>
      <CmsSectionsEditor rows={rows} />
    </section>
  );
}
