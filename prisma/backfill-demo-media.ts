import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { DEMO_LISTING_MEDIA } from "../src/lib/listing-media";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function run() {
  for (const [slug, media] of Object.entries(DEMO_LISTING_MEDIA)) {
    const listing = await prisma.listing.findUnique({ where: { slug }, select: { id: true } });
    if (!listing) continue;

    const uploads = await prisma.listingMedia.findMany({
      where: { listingId: listing.id, NOT: { sourceType: "seed" } },
      orderBy: { sortOrder: "asc" }
    });

    await prisma.listingMedia.deleteMany({ where: { listingId: listing.id, sourceType: "seed" } });

    await prisma.listingMedia.createMany({
      data: [
        ...media.map((item) => ({ ...item, listingId: listing.id })),
        ...uploads.map((item, index) => ({
          listingId: listing.id,
          url: item.url,
          kind: item.kind,
          alt: item.alt,
          caption: item.caption,
          thumbnail: item.thumbnail,
          title: item.title,
          description: item.description,
          isPrimary: item.isPrimary,
          sortOrder: media.length + index + 1,
          sourceType: "upload"
        }))
      ]
    });
  }
}

run().finally(async () => {
  await prisma.$disconnect();
  await pool.end();
});
