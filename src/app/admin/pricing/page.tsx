import { requireAdmin } from "@/server/guards";
import { formatUsd, PLAN_CONFIG } from "@/lib/plans";
import { getPricingPlans } from "@/lib/pricing-settings";
import { PricingSettingsForm } from "@/components/admin/pricing-settings-form";

export default async function PricingAdmin() {
  await requireAdmin();
  const rows = await getPricingPlans();

  return (
    <section className="section two-col">
      <PricingSettingsForm initial={rows} />
      <article className="card-pad">
        <h2>Live Plan Builder Matrix</h2>
        <div className="admin-table-wrap">
          <table className="comparison-table">
            <thead>
              <tr><th>Plan</th><th>Base</th><th>Sign-up</th><th>Total upfront</th><th>Listing limit</th><th>Photo limit</th><th>Video limit</th><th>Visibility</th></tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.key}>
                  <td>{r.name}</td>
                  <td>{r.recurringMonthlyUsd === null ? "Price Varies" : formatUsd(r.recurringMonthlyUsd)}</td>
                  <td>{r.recurringMonthlyUsd === null ? "N/A" : formatUsd(r.oneTimeSignupFeeUsd)}</td>
                  <td>{r.recurringMonthlyUsd === null ? "Contact required" : formatUsd(r.recurringMonthlyUsd + r.oneTimeSignupFeeUsd)}</td>
                  <td>{PLAN_CONFIG[r.key].listingLimit ?? "Unlimited"}</td>
                  <td>{PLAN_CONFIG[r.key].photosPerListing}</td>
                  <td>{PLAN_CONFIG[r.key].videosPerListing}</td>
                  <td>{r.isActive === false ? "Hidden" : "Visible"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
