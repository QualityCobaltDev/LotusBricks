import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { inquiryStatusSchema } from "@/lib/validators";
import { logAuditEvent } from "@/lib/admin-control";

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

  await logAuditEvent({
    at: new Date().toISOString(),
    actor: session.userId,
    action: "UPDATE",
    objectType: "LEAD",
    objectId: id,
    summary: `Lead status set to ${parsed.data.status}`
  });

  return NextResponse.json(updated);
}
