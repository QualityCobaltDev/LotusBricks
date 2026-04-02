import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { listingSchema } from "@/lib/validators";
import { failResult, okResult, toUserFacingError } from "@/lib/mutation-result";
import { logServerError } from "@/lib/observability";
import { revalidatePath } from "next/cache";

function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function revalidateListingSurfaces(slug?: string | null) {
  revalidatePath("/");
  revalidatePath("/listings");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/listings/${slug}`);
}

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

  console.info("[admin-listings-create] request_start", { actor: session.userId });
  const parsed = listingSchema.safeParse(body);
  if (!parsed.success) {
    console.info("[admin-listings-create] validation_failed", { actor: session.userId, issues: parsed.error.flatten().fieldErrors });
    return NextResponse.json(failResult("Validation failed.", { fieldErrors: parsed.error.flatten().fieldErrors }), { status: 400 });
  }

  const payload = parsed.data;
  const slug = normalizeSlug(payload.slug || payload.title);
  if (!slug) return NextResponse.json(failResult("Slug is required."), { status: 400 });

  const { imageUrl, videoUrl, imageUrls, videoUrls, mediaItems, availabilityDate, ...rest } = payload;
  const normalizedItems = mediaItems.length
    ? mediaItems
    : [
      ...((imageUrls.length ? imageUrls : imageUrl ? [imageUrl] : []).map((url) => ({ url, kind: "image" as const }))),
      ...((videoUrls.length ? videoUrls : videoUrl ? [videoUrl] : []).map((url) => ({ url, kind: "video" as const })))
    ];

  try {
    const listing = await db.listing.create({
      data: {
        ...rest,
        slug,
        ownerId: session.userId,
        availabilityDate: availabilityDate ? new Date(availabilityDate) : undefined,
        publishedAt: rest.status === "PUBLISHED" ? new Date() : null
      }
    });

    if (normalizedItems.length) {
      await db.listingMedia.createMany({
        data: normalizedItems.map((item, index) => ({
          listingId: listing.id,
          url: item.url,
          kind: item.kind,
          isPrimary: index === 0,
          sortOrder: index + 1,
          sourceType: "upload"
        }))
      });
    }

    console.info("[admin-listings-create] db_success", { listingId: listing.id, slug: listing.slug });
    revalidateListingSurfaces(listing.slug);
    console.info("[admin-listings-create] cache_revalidated", { slug: listing.slug });

    return NextResponse.json(okResult(listing, "Listing created successfully."));
  } catch (error) {
    logServerError("admin-listings-create", error, { slug });
    return NextResponse.json(toUserFacingError(error, "Unable to create listing."), { status: 500 });
  }
}
