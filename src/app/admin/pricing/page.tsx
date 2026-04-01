import { requireAdmin } from "@/server/guards";
import { PLAN_CONFIG, PLAN_ORDER, formatUsd } from "@/lib/plans";

export default async function PricingAdmin() {
  await requireAdmin();
  const rows = PLAN_ORDER.map((k) => PLAN_CONFIG[k]);

  return (
    <section>
      <h1>Pricing plans</h1>
      <p>Single source of truth for recurring price, one-time sign-up fee, and listing/media caps.</p>
      <div className="card-pad">
        <table className="comparison-table">
          <thead>
            <tr><th>Plan</th><th>Recurring monthly</th><th>Sign-up fee</th><th>Listings</th><th>Photos</th><th>Videos</th><th>Checkout</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.key}>
                <td>{r.name}</td>
                <td>{r.recurringMonthlyUsd === null ? "Pricing Varies" : formatUsd(r.recurringMonthlyUsd)}</td>
                <td>{r.recurringMonthlyUsd === null ? "N/A" : formatUsd(r.oneTimeSignupFeeUsd)}</td>
                <td>{r.listingLimit === null ? "10+" : r.listingLimit}</td>
                <td>{r.photosPerListing}</td>
                <td>{r.videosPerListing}</td>
                <td>{r.contactOnly ? "Contact-only" : "Self-serve"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
