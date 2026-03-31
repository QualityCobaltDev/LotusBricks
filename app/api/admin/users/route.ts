import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  await requireAdmin();
  const rows = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, email: true, username: true, role: true, isActive: true, createdAt: true, profile: { select: { fullName: true } }, _count: { select: { savedListings: true } } }
  });
  return NextResponse.json({ rows });
}
