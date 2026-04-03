import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { listingSchema } from "@/lib/validators";
import { failResult, okResult, toUserFacingError } from "@/lib/mutation-result";
import { logServerError } from "@/lib/observability";
import { revalidatePublicListings } from "@/lib/admin-revalidate";
import { ensureUniqueListingSlug } from "@/lib/listing-slug";
import { getIntentFromListingType, getVerificationReadiness } from "@/lib/listing-validation";


export async function GET() {
  const session = await getSession();
  if (session?.role !== "ADMIN") return NextResponse.json(failResult("Forbidden"), { status: 403 });

  try {
    const listings = await db.listing.findMany({
      orderBy: { updatedAt: "desc" },
      include: { media: { orderBy: { sortOrder: "asc" } } }
    });
    return NextResponse.json(okResult(listings));
  } catch (error) {
    logServerError("admin-listings-get", error);
    return NextResponse.json(failResult("Unable to load listings."), { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getSession();
  if (session?.role !== "ADMIN") return NextResponse.json(failResult("Forbidden"), { status: 403 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(failResult("Invalid JSON payload."), { status: 400 });
  }

  const parsed = listingSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json(failResult("Validation failed.", { fieldErrors: parsed.error.flatten().fieldErrors }), { status: 400 });

  const payload = parsed.data;
  const candidateSlug = payload.slug || payload.title;
  const slug = await ensureUniqueListingSlug(candidateSlug);
  if (!slug) return NextResponse.json(failResult("Slug is required."), { status: 400 });

  const listingIntent = payload.listingIntent ?? getIntentFromListingType(payload.listingType);
  const priceFrequency = payload.priceFrequency ?? (listingIntent === "RENT" || listingIntent === "LEASE" ? "MONTHLY" : "TOTAL");
  const { imageUrl, videoUrl, imageUrls, videoUrls, mediaItems, availabilityDate, pricingUpdatedAt, lastReviewedAt, ...rest } = payload;

  const normalizedItems = mediaItems.length
    ? mediaItems
    : [
      ...((imageUrls.length ? imageUrls : imageUrl ? [imageUrl] : []).map((url) => ({ url, kind: "image" as const }))),
      ...((videoUrls.length ? videoUrls : videoUrl ? [videoUrl] : []).map((url) => ({ url, kind: "video" as const })))
    ];

  const readiness = getVerificationReadiness({ ...payload, listingIntent, priceFrequency, mediaCount: normalizedItems.length } as never);

  try {
    const listing = await db.$transaction(async (tx) => {
      const created = await tx.listing.create({
        data: {
        ...rest,
        slug,
        listingIntent,
        priceFrequency,
        ownerId: session.userId,
        availabilityDate: availabilityDate ? new Date(availabilityDate) : undefined,
        pricingUpdatedAt: pricingUpdatedAt ? new Date(pricingUpdatedAt) : new Date(),
        lastReviewedAt: lastReviewedAt ? new Date(lastReviewedAt) : null,
        publishedAt: rest.status === "PUBLISHED" ? new Date() : null
      }
      });

      await tx.listingSlugHistory.upsert({ where: { slug: created.slug }, update: {}, create: { slug: created.slug, listingId: created.id } });

      if (normalizedItems.length) {
        await tx.listingMedia.createMany({
          data: normalizedItems.map((item, index) => ({
            listingId: created.id,
            url: item.url,
            kind: item.kind,
            isPrimary: index === 0,
            sortOrder: index + 1,
            sourceType: "upload"
          }))
        });
      }

      return created;
    });

    revalidatePublicListings(listing.slug);
    return NextResponse.json(okResult({ ...listing, readiness }, "Listing created successfully."));
  } catch (error) {
    logServerError("admin-listings-create", error, { slug });
    return NextResponse.json(toUserFacingError(error, "Unable to create listing."), { status: 500 });
  }
}
