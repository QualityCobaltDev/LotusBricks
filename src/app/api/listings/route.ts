import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { listingSchema } from "@/lib/validators";
import { getPlanByKey } from "@/lib/plans";
import { logServerError } from "@/lib/observability";

export async function GET() {
  try {
    const data = await db.listing.findMany({ include: { media: true }, orderBy: { updatedAt: "desc" } });
    return NextResponse.json(data);
  } catch (error) {
    logServerError("api-listings-get", error);
    return NextResponse.json({ error: "Unable to load listings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = listingSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });

  try {
    const user = await db.user.findUnique({ where: { id: session.userId }, select: { planTier: true } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const plan = getPlanByKey(user.planTier);
    const { imageUrl, videoUrl, imageUrls, videoUrls, ...payload } = parsed.data;
    const images = imageUrls.length ? imageUrls : imageUrl ? [imageUrl] : [];
    const videos = videoUrls.length ? videoUrls : videoUrl ? [videoUrl] : [];

    const existingById = payload.id ? await db.listing.findUnique({ where: { id: payload.id }, select: { id: true, ownerId: true } }) : null;
    const existingBySlug = await db.listing.findUnique({ where: { slug: payload.slug }, select: { id: true, ownerId: true } });
    const existingListing = existingById ?? existingBySlug;

    if (existingListing) {
      const canManage = session.role === "ADMIN" || existingListing.ownerId === session.userId;
      if (!canManage) {
        return NextResponse.json({ error: "Forbidden: you can only modify your own listings." }, { status: 403 });
      }

      if (existingById && existingBySlug && existingById.id !== existingBySlug.id) {
        return NextResponse.json({ error: "Slug already belongs to another listing." }, { status: 409 });
      }
    }

    if (!plan.contactOnly && plan.listingLimit !== null) {
      const count = await db.listing.count({ where: { ownerId: session.userId } });
      if (!existingListing && count >= plan.listingLimit) {
        return NextResponse.json({
          error: `Listing limit reached (${count}/${plan.listingLimit}).`,
          cta: plan.key === "TIER_3" ? "Need more than 10 listings? Contact us for a Custom Tier." : "Upgrade your plan to publish more listings.",
          ctaHref: "/pricing"
        }, { status: 403 });
      }
    }

    const listing = existingListing
      ? await db.listing.update({
        where: { id: existingListing.id },
        data: {
          ...payload,
          ownerId: session.role === "ADMIN" ? existingListing.ownerId : session.userId,
          publishedAt: payload.status === "PUBLISHED" ? new Date() : null
        }
      })
      : await db.listing.create({
        data: {
          ...payload,
          ownerId: session.userId,
          publishedAt: payload.status === "PUBLISHED" ? new Date() : null
        }
      });

    await db.listingMedia.deleteMany({ where: { listingId: listing.id } });
    const media = [
      ...images.map((url, index) => ({ listingId: listing.id, url, kind: "image", sortOrder: index + 1 })),
      ...videos.map((url, index) => ({ listingId: listing.id, url, kind: "video", sortOrder: images.length + index + 1 }))
    ];
    if (media.length) await db.listingMedia.createMany({ data: media });
    return NextResponse.json(listing);
  } catch (error) {
    logServerError("api-listings-post", error);
    return NextResponse.json({ error: "Unable to save listing" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getSession();
  if (session?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  try {
    await db.listing.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    logServerError("api-listings-delete", error, { id });
    return NextResponse.json({ error: "Unable to delete listing" }, { status: 500 });
  }
}
