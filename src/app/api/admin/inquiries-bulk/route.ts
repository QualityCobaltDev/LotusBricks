import { z } from "zod";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { logAuditEvent } from "@/lib/admin-control";
import { LeadStatus } from "@prisma/client";
import { failResult, okResult } from "@/lib/mutation-result";
import { logServerError } from "@/lib/observability";

const bulkInquirySchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
  status: z.nativeEnum(LeadStatus),
  assignedTo: z.string().optional()
});

export async function PATCH(req: Request) {
  const session = await getSession();
  if (session?.role !== "ADMIN") return NextResponse.json(failResult("Forbidden"), { status: 403 });

  const parsed = bulkInquirySchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json(failResult("Invalid payload", { fieldErrors: parsed.error.flatten().fieldErrors }), { status: 400 });

  try {
    await db.inquiry.updateMany({
      where: { id: { in: parsed.data.ids } },
      data: { status: parsed.data.status, assignedTo: parsed.data.assignedTo || null }
    });

    try {
      await logAuditEvent({
        at: new Date().toISOString(),
        actor: session.userId,
        action: "BULK_UPDATE",
        objectType: "LEAD",
        summary: `Updated ${parsed.data.ids.length} lead(s) to ${parsed.data.status}`
      });
    } catch (auditError) {
      logServerError("admin-inquiries-bulk-audit", auditError);
    }

    return NextResponse.json(okResult(undefined, "Lead bulk update completed."));
  } catch (error) {
    logServerError("admin-inquiries-bulk-patch", error, { status: parsed.data.status, ids: parsed.data.ids });
    return NextResponse.json(failResult("Unable to process lead bulk update."), { status: 500 });
  }
}
