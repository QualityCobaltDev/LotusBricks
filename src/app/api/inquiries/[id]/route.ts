import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { inquiryStatusSchema } from "@/lib/validators";
import { logAuditEvent } from "@/lib/admin-control";
import { failResult, okResult, toUserFacingError } from "@/lib/mutation-result";
import { logServerError } from "@/lib/observability";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (session?.role !== "ADMIN") return NextResponse.json(failResult("Forbidden"), { status: 403 });

  const { id } = await params;
  const parsed = inquiryStatusSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json(failResult("Invalid payload", { fieldErrors: parsed.error.flatten().fieldErrors }), { status: 400 });

  try {
    const updated = await db.inquiry.update({
      where: { id },
      data: {
        status: parsed.data.status,
        notes: parsed.data.notes || null,
        assignedTo: parsed.data.assignedTo || null
      }
    });

    try {
      await logAuditEvent({
        at: new Date().toISOString(),
        actor: session.userId,
        action: "UPDATE",
        objectType: "LEAD",
        objectId: id,
        summary: `Lead status set to ${parsed.data.status}`
      });
    } catch (auditError) {
      logServerError("inquiry-patch-audit", auditError, { id });
    }

    return NextResponse.json(okResult(updated, "Lead updated."));
  } catch (error) {
    logServerError("inquiry-patch", error, { id });
    const result = toUserFacingError(error, "Unable to update lead.");
    const status = ("code" in result && result.code === "P2025") ? 404 : 500;
    return NextResponse.json(result, { status });
  }
}
