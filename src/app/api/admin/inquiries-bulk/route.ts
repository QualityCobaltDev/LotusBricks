import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { logAuditEvent } from "@/lib/admin-control";
import { LeadStatus } from "@prisma/client";

export async function PATCH(req: Request) {
  const session = await getSession();
  if (session?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const payload = (await req.json()) as { ids: string[]; status: LeadStatus; assignedTo?: string };
  if (!Array.isArray(payload.ids) || !payload.ids.length) return NextResponse.json({ error: "ids required" }, { status: 400 });

  await db.inquiry.updateMany({
    where: { id: { in: payload.ids } },
    data: { status: payload.status, assignedTo: payload.assignedTo || undefined }
  });

  await logAuditEvent({
    at: new Date().toISOString(),
    actor: session.userId,
    action: "BULK_UPDATE",
    objectType: "LEAD",
    summary: `Updated ${payload.ids.length} lead(s) to ${payload.status}`
  });

  return NextResponse.json({ ok: true });
}
