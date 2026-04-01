import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { listingSchema } from "@/lib/validators";
import { getPlanByKey } from "@/lib/plans";

export async function GET() {
  const data = await db.listing.findMany({ include: { media: true }, orderBy: { updatedAt: "desc" } });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = listingSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });

  const user = await db.user.findUnique({ where: { id: session.userId }, select: { planTier: true } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const plan = getPlanByKey(user.planTier);
  const { imageUrl, videoUrl, imageUrls, videoUrls, ...payload } = parsed.data;
  const images = imageUrls.length ? imageUrls : imageUrl ? [imageUrl] : [];
  const videos = videoUrls.length ? videoUrls : videoUrl ? [videoUrl] : [];

  if (!plan.contactOnly && plan.listingLimit !== null) {
    const count = await db.listing.count({ where: { ownerId: session.userId } });
    const isUpdate = Boolean(payload.id);
    if (!isUpdate && count >= plan.listingLimit) {
      return NextResponse.json({
        error: `Listing limit reached (${count}/${plan.listingLimit}).`,
        cta: plan.key === "TIER_3" ? "Need more than 10 listings? Contact us for a Custom Tier." : "Upgrade your plan to publish more listings.",
        ctaHref: "/pricing"
      }, { status: 403 });
    }
  }

  const listing = await db.listing.upsert({
    where: { slug: payload.slug },
    update: { ...payload, ownerId: session.userId, publishedAt: payload.status === "PUBLISHED" ? new Date() : null },
    create: { ...payload, ownerId: session.userId, publishedAt: payload.status === "PUBLISHED" ? new Date() : null }
  });

  await db.listingMedia.deleteMany({ where: { listingId: listing.id } });
  const media = [
    ...images.map((url, index) => ({ listingId: listing.id, url, kind: "image", sortOrder: index + 1 })),
    ...videos.map((url, index) => ({ listingId: listing.id, url, kind: "video", sortOrder: images.length + index + 1 }))
  ];
  if (media.length) await db.listingMedia.createMany({ data: media });
  return NextResponse.json(listing);
}

export async function DELETE(req: Request) {
  const session = await getSession();
  if (session?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await db.listing.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
