import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Please sign in to save listings." }, { status: 401 });
  const { listingSlug } = await request.json();
  if (!listingSlug) return NextResponse.json({ error: "Missing listing slug." }, { status: 400 });

  const existing = await prisma.savedListing.findUnique({ where: { userId_listingSlug: { userId: user.id, listingSlug } } });
  if (existing) {
    await prisma.savedListing.delete({ where: { id: existing.id } });
    return NextResponse.json({ ok: true, saved: false });
  }

  await prisma.savedListing.create({ data: { userId: user.id, listingSlug } });
  return NextResponse.json({ ok: true, saved: true });
}
