import { requireAdmin } from "@/server/guards";
import { formatUsd } from "@/lib/plans";
import { getPricingPlans } from "@/lib/pricing-settings";
import { PricingSettingsForm } from "@/components/admin/pricing-settings-form";

export default async function PricingAdmin() {
  await requireAdmin();
  const rows = await getPricingPlans();

  return (
    <section className="shell section two-col">
      <PricingSettingsForm initial={rows} />
      <article className="card-pad">
        <h2>Live pricing table</h2>
        <div className="admin-table-wrap">
          <table className="comparison-table">
            <thead>
              <tr><th>Plan</th><th>Base</th><th>Sign-up</th><th>Total upfront</th><th>Checkout</th></tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.key}>
                  <td>{r.name}</td>
                  <td>{r.recurringMonthlyUsd === null ? "Price Varies" : formatUsd(r.recurringMonthlyUsd)}</td>
                  <td>{r.recurringMonthlyUsd === null ? "N/A" : formatUsd(r.oneTimeSignupFeeUsd)}</td>
                  <td>{r.recurringMonthlyUsd === null ? "Contact required" : formatUsd(r.recurringMonthlyUsd + r.oneTimeSignupFeeUsd)}</td>
                  <td>{r.contactOnly ? "Contact-only" : "Self-serve"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
