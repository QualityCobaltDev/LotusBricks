import { requireCustomer } from "@/server/guards";
import { db } from "@/lib/db";
import { getPricingPlanByKey } from "@/lib/pricing-settings";
import { getTranslations } from "next-intl/server";

export default async function AccountPage() {
  const session = await requireCustomer();
  const t = await getTranslations("account");
  const user = await db.user.findUnique({ where: { id: session.userId } });
  const favorites = await db.favorite.count({ where: { userId: session.userId } });
  const listingCount = await db.listing.count({ where: { ownerId: session.userId } });
  const plan = await getPricingPlanByKey((user?.planTier as any) ?? "TIER_1");

  return (
    <section>
      <h1>{t("title")}</h1>
      <p>{user?.fullName}</p>
      <p>{t("currentPlan", { plan: plan.name })}</p>
      {plan.listingLimit !== null && <p>{t("listingUsage", { used: listingCount, limit: plan.listingLimit })}</p>}
      <p>{t("mediaPerListing", { photos: plan.photosPerListing, videos: plan.videosPerListing })}</p>
      <p>{t("savedListings", { count: favorites })}</p>
      {!user?.signupFeePaid && <p className="muted">{t("signupFeeNote")}</p>}
      {plan.listingLimit !== null && listingCount >= plan.listingLimit && (
        <p>
          {plan.key === "TIER_3" ? t("needMoreListings") : t("reachedListingCap")}
          {" "}
          <a href={plan.key === "TIER_3" ? "/contact?plan=custom&tierNeeds=10-plus" : "/pricing"}>{t("takeAction")}</a>
        </p>
      )}
    </section>
  );
}
