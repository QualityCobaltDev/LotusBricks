import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  await requireAdmin();
  const [users, saved, requests, reports] = await Promise.all([
    prisma.user.count(),
    prisma.savedListing.count(),
    prisma.viewingRequest.count(),
    prisma.listingReport.count()
  ]);
  return NextResponse.json({ users, saved, requests, reports });
}
