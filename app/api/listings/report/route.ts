import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({ listingSlug: z.string().min(2), reason: z.string().min(2), notes: z.string().max(500).optional() });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid report data." }, { status: 400 });
  const user = await getCurrentUser();

  await prisma.listingReport.create({ data: { userId: user?.id, listingSlug: parsed.data.listingSlug, reason: parsed.data.reason, notes: parsed.data.notes } });
  return NextResponse.json({ ok: true, message: "Thanks, this listing has been reported." });
}
