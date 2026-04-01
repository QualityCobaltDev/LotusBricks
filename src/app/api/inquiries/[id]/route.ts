import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { inquiryStatusSchema } from "@/lib/validators";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (session?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const parsed = inquiryStatusSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });

  const updated = await db.inquiry.update({
    where: { id },
    data: {
      status: parsed.data.status,
      notes: parsed.data.notes || null,
      assignedTo: parsed.data.assignedTo || null
    }
  });

  return NextResponse.json(updated);
}
