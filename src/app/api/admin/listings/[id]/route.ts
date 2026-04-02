import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { listingSchema } from "@/lib/validators";
import { failResult, okResult, toUserFacingError } from "@/lib/mutation-result";
import { logServerError } from "@/lib/observability";
import { revalidatePath } from "next/cache";

const statusSchema = z.object({ status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]) });

function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function revalidateListingSurfaces(slug?: string | null, previousSlug?: string | null) {
  revalidatePath("/");
  revalidatePath("/listings");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/listings/${slug}`);
  if (previousSlug && previousSlug !== slug) revalidatePath(`/listings/${previousSlug}`);
}

async function assertAdmin() {
  const session = await getSession();
  if (session?.role !== "ADMIN") return null;
  return session;
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await assertAdmin();
  if (!session) return NextResponse.json(failResult("Forbidden"), { status: 403 });

  const { id } = await params;
  try {
    const listing = await db.listing.findUnique({ where: { id }, include: { media: { orderBy: { sortOrder: "asc" } } } });
    if (!listing) return NextResponse.json(failResult("Listing not found."), { status: 404 });
    return NextResponse.json(okResult(listing));
  } catch (error) {
    logServerError("admin-listings-id-get", error, { id });
    return NextResponse.json(failResult("Unable to load listing."), { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await assertAdmin();
  if (!session) return NextResponse.json(failResult("Forbidden"), { status: 403 });

  const { id } = await params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(failResult("Invalid JSON payload."), { status: 400 });
  }

  console.info("[admin-listings-update] request_start", { actor: session.userId, id });
  const parsed = listingSchema.safeParse(body);
  if (!parsed.success) {
    console.info("[admin-listings-update] validation_failed", { id, actor: session.userId, issues: parsed.error.flatten().fieldErrors });
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
    const existing = await db.listing.findUnique({ where: { id }, select: { slug: true } });
    if (!existing) return NextResponse.json(failResult("Listing not found."), { status: 404 });

    const listing = await db.listing.update({
      where: { id },
      data: {
        ...rest,
        slug,
        availabilityDate: availabilityDate ? new Date(availabilityDate) : null,
        publishedAt: rest.status === "PUBLISHED" ? new Date() : null
      }
    });

    await db.listingMedia.deleteMany({ where: { listingId: id } });
    if (normalizedItems.length) {
      await db.listingMedia.createMany({
        data: normalizedItems.map((item, index) => ({
          listingId: id,
          url: item.url,
          kind: item.kind,
          isPrimary: index === 0,
          sortOrder: index + 1,
          sourceType: "upload"
        }))
      });
    }

    console.info("[admin-listings-update] db_success", { id, slug: listing.slug });
    revalidateListingSurfaces(listing.slug, existing.slug);
    console.info("[admin-listings-update] cache_revalidated", { id, slug: listing.slug, previousSlug: existing.slug });

    return NextResponse.json(okResult(listing, "Listing saved successfully."));
  } catch (error) {
    logServerError("admin-listings-update", error, { id, slug });
    return NextResponse.json(toUserFacingError(error, "Unable to save listing."), { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await assertAdmin();
  if (!session) return NextResponse.json(failResult("Forbidden"), { status: 403 });

  const { id } = await params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(failResult("Invalid JSON payload."), { status: 400 });
  }

  const parsed = statusSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json(failResult("Invalid status payload."), { status: 400 });

  try {
    const listing = await db.listing.update({
      where: { id },
      data: {
        status: parsed.data.status,
        publishedAt: parsed.data.status === "PUBLISHED" ? new Date() : null
      },
      select: { id: true, slug: true, status: true }
    });

    revalidateListingSurfaces(listing.slug);
    return NextResponse.json(okResult(listing, `Listing moved to ${listing.status.toLowerCase()}.`));
  } catch (error) {
    logServerError("admin-listings-status", error, { id, status: parsed.data.status });
    return NextResponse.json(toUserFacingError(error, "Unable to update status."), { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await assertAdmin();
  if (!session) return NextResponse.json(failResult("Forbidden"), { status: 403 });

  const { id } = await params;
  try {
    const existing = await db.listing.findUnique({ where: { id }, select: { slug: true } });
    if (!existing) return NextResponse.json(failResult("Listing not found."), { status: 404 });

    await db.listing.delete({ where: { id } });
    revalidateListingSurfaces(null, existing.slug);
    return NextResponse.json(okResult(undefined, "Listing deleted."));
  } catch (error) {
    logServerError("admin-listings-delete", error, { id });
    return NextResponse.json(toUserFacingError(error, "Unable to delete listing."), { status: 500 });
  }
}
