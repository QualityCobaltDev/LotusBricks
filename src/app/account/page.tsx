import { requireCustomer } from "@/server/guards";
import { db } from "@/lib/db";
import { getPricingPlanByKey } from "@/lib/pricing-settings";

export default async function AccountPage() {
  const session = await requireCustomer();
  const user = await db.user.findUnique({ where: { id: session.userId } });
  const favorites = await db.favorite.count({ where: { userId: session.userId } });
  const listingCount = await db.listing.count({ where: { ownerId: session.userId } });
  const plan = await getPricingPlanByKey((user?.planTier as any) ?? "TIER_1");

  return (
    <section>
      <h1>Account</h1>
      <p>{user?.fullName}</p>
      <p>Current plan: <strong>{plan.name}</strong></p>
      {plan.listingLimit !== null && <p>Listing usage: <strong>{listingCount}/{plan.listingLimit}</strong></p>}
      <p>Media per listing: {plan.photosPerListing} photos · {plan.videosPerListing} videos</p>
      <p>Saved listings: {favorites}</p>
      {!user?.signupFeePaid && <p className="muted">One-time sign-up fee applies to all new standard subscriptions and is collected once at activation.</p>}
      {plan.listingLimit !== null && listingCount >= plan.listingLimit && (
        <p>
          {plan.key === "TIER_3" ? "Need more than 10 listings? Contact us for a Custom Tier." : "You have reached your listing cap. Upgrade to publish more listings."}
          {" "}
          <a href={plan.key === "TIER_3" ? "/contact?plan=custom&tierNeeds=10-plus" : "/pricing"}>Take action</a>
        </p>
      )}
    </section>
  );
}
