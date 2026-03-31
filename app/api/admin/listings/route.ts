import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  id: z.string().optional(),
  slug: z.string().min(3),
  title: z.string().min(3),
  description: z.string().min(10),
  priceUsd: z.coerce.number().int().positive(),
  city: z.string().min(2),
  district: z.string().min(2),
  propertyType: z.string().min(2),
  intent: z.enum(["buy", "rent"]),
  status: z.enum(["DRAFT", "PUBLISHED", "PAUSED", "ARCHIVED", "SUBMITTED", "UNDER_REVIEW", "REJECTED"]).default("DRAFT"),
  featured: z.boolean().optional(),
  imageUrl: z.string().url().optional().or(z.literal(""))
});

export async function GET() {
  await requireAdmin();
  const rows = await prisma.managedListing.findMany({ orderBy: { updatedAt: "desc" } });
  return NextResponse.json({ rows });
}

export async function POST(request: Request) {
  await requireAdmin();
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid listing payload", issues: parsed.error.flatten() }, { status: 400 });

  const data = { ...parsed.data, imageUrl: parsed.data.imageUrl || null, featured: Boolean(parsed.data.featured) };
  if (parsed.data.id) {
    const row = await prisma.managedListing.update({ where: { id: parsed.data.id }, data });
    return NextResponse.json({ ok: true, row });
  }
  const row = await prisma.managedListing.create({ data });
  return NextResponse.json({ ok: true, row });
}

export async function DELETE(request: Request) {
  await requireAdmin();
  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await prisma.managedListing.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
