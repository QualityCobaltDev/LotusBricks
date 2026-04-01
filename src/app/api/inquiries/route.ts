import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { inquirySchema } from "@/lib/validators";

export async function POST(req: Request) {
  const parsed = inquirySchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
  const session = await getSession();
  const payload = parsed.data;

  const inquiry = await db.inquiry.create({
    data: {
      listingId: payload.listingId || null,
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone || null,
      companyName: payload.companyName || null,
      requestedListings: payload.requestedListings ?? null,
      inquiryType: payload.inquiryType,
      selectedPlan: payload.selectedPlan || null,
      message: payload.message,
      userId: session?.userId || null
    }
  });
  return NextResponse.json(inquiry, { status: 201 });
}

export async function GET() {
  const session = await getSession();
  if (session?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const items = await db.inquiry.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(items);
}
