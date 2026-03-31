import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const schema = z.object({
  listingSlug: z.string().min(2),
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5),
  preferredDate: z.string().datetime(),
  notes: z.string().max(500).optional()
});

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = schema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request data." }, { status: 400 });
  const user = await getCurrentUser();

  await prisma.viewingRequest.create({
    data: {
      userId: user?.id,
      listingSlug: parsed.data.listingSlug,
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      preferredDate: new Date(parsed.data.preferredDate),
      notes: parsed.data.notes
    }
  });
  return NextResponse.json({ ok: true, message: "Viewing request submitted." });
}
