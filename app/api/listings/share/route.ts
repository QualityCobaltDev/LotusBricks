import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({ listingSlug: z.string().min(2), channel: z.string().min(2).max(30) });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid share payload." }, { status: 400 });
  const user = await getCurrentUser();
  await prisma.listingShare.create({ data: { userId: user?.id, listingSlug: parsed.data.listingSlug, channel: parsed.data.channel } });
  return NextResponse.json({ ok: true });
}
