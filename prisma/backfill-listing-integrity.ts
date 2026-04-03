import { PrismaClient } from "@prisma/client";
import { getIntentFromListingType } from "../src/lib/listing-validation";

const prisma = new PrismaClient();

async function run() {
  const listings = await prisma.listing.findMany({ select: { id: true, slug: true, listingType: true, listingIntent: true, priceFrequency: true } });

  for (const listing of listings) {
    const listingIntent = listing.listingIntent ?? getIntentFromListingType(listing.listingType);
    const priceFrequency = listing.priceFrequency ?? (listingIntent === "RENT" || listingIntent === "LEASE" ? "MONTHLY" : "TOTAL");

    await prisma.listing.update({
      where: { id: listing.id },
      data: {
        listingIntent,
        priceFrequency,
        pricingUpdatedAt: new Date()
      }
    });

    await prisma.listingSlugHistory.upsert({ where: { slug: listing.slug }, update: { listingId: listing.id }, create: { slug: listing.slug, listingId: listing.id } });
  }

  console.info(`Backfilled ${listings.length} listings.`);
}

run().finally(async () => prisma.$disconnect());
