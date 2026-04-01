import { PrismaClient, UserRole, ListingStatus, PlanTier } from "@prisma/client";
import { createHash } from "node:crypto";
import { PLAN_CONFIG, STANDARD_PLAN_ORDER, formatUsd } from "../src/lib/plans";

const prisma = new PrismaClient();

const hashPassword = (value: string) => createHash("sha256").update(value).digest("hex");

async function main() {
  await prisma.user.upsert({
    where: { email: "admin@rightbricks.com" },
    update: {},
    create: {
      email: "admin@rightbricks.com",
      fullName: "Platform Admin",
      role: UserRole.ADMIN,
      passwordHash: hashPassword("Admin123!"),
      planTier: PlanTier.TIER_3,
      signupFeePaid: true,
      isActive: true
    }
  });

  await prisma.user.upsert({
    where: { email: "customer@rightbricks.com" },
    update: {},
    create: {
      email: "customer@rightbricks.com",
      fullName: "Sample Customer",
      role: UserRole.CUSTOMER,
      passwordHash: hashPassword("Customer123!"),
      planTier: PlanTier.TIER_2,
      signupFeePaid: true,
      isActive: true
    }
  });

  const customer = await prisma.user.findUniqueOrThrow({ where: { email: "customer@rightbricks.com" }, select: { id: true } });

  const listing = await prisma.listing.upsert({
    where: { slug: "modern-villa-phnom-penh" },
    update: {},
    create: {
      slug: "modern-villa-phnom-penh",
      title: "Modern Villa in Phnom Penh",
      summary: "4-bedroom premium villa with city access.",
      description: "High-end villa ideal for families looking for modern finishes and easy access to schools and business districts.",
      city: "Phnom Penh",
      district: "Chamkar Mon",
      priceUsd: 450000,
      bedrooms: 4,
      bathrooms: 4,
      areaSqm: 320,
      status: ListingStatus.PUBLISHED,
      featured: true,
      ownerId: customer.id,
      publishedAt: new Date()
    }
  });

  await prisma.listingMedia.createMany({
    data: [
      { listingId: listing.id, kind: "image", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c", sortOrder: 1 },
      { listingId: listing.id, kind: "video", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", sortOrder: 2 }
    ],
    skipDuplicates: true
  });

  await prisma.pricingPlan.deleteMany();
  await prisma.pricingPlan.createMany({
    data: STANDARD_PLAN_ORDER.map((key, idx) => {
      const plan = PLAN_CONFIG[key];
      return {
        name: plan.name,
        priceLabel: formatUsd(plan.recurringMonthlyUsd ?? 0),
        cadence: "monthly",
        ctaLabel: plan.ctaLabel,
        features: [
          `${plan.listingLimit} ${plan.listingLimit === 1 ? "listing" : "listings"}`,
          `${plan.photosPerListing} photos per listing`,
          `${plan.videosPerListing} videos per listing`,
          `+$${plan.oneTimeSignupFeeUsd} one-time sign-up fee`
        ],
        sortOrder: idx + 1
      };
    }),
    skipDuplicates: true
  });

  await prisma.siteContent.upsert({
    where: { key: "homepage.hero" },
    update: {},
    create: {
      key: "homepage.hero",
      title: "Find trusted property opportunities",
      body: "RightBricks helps buyers, renters, and investors discover verified property listings with transparent details."
    }
  });
}

main().finally(() => prisma.$disconnect());
