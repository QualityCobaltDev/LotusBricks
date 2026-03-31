import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  await requireAdmin();
  const rows = await prisma.viewingRequest.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  return NextResponse.json({ rows });
}
