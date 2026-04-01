import { PrismaClient, UserRole, ListingStatus } from "@prisma/client";
import { createHash } from "node:crypto";

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
      isActive: true
    }
  });

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

  await prisma.pricingPlan.createMany({
    data: [
      { name: "Starter", priceLabel: "$29", cadence: "monthly", ctaLabel: "Start Starter", features: ["1 active listing", "Email support"], sortOrder: 1 },
      { name: "Growth", priceLabel: "$99", cadence: "monthly", ctaLabel: "Choose Growth", features: ["10 active listings", "Featured placement"], sortOrder: 2 }
    ],
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
