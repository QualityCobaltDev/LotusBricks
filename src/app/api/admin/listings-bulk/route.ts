import { z } from "zod";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { logAuditEvent } from "@/lib/admin-control";
import { failResult, okResult } from "@/lib/mutation-result";
import { logServerError } from "@/lib/observability";

const bulkListingSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
  action: z.enum(["publish", "archive", "delete"])
});

export async function PATCH(req: Request) {
  const session = await getSession();
  if (session?.role !== "ADMIN") return NextResponse.json(failResult("Forbidden"), { status: 403 });

  const parsed = bulkListingSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json(failResult("Invalid payload", { fieldErrors: parsed.error.flatten().fieldErrors }), { status: 400 });

  try {
    if (parsed.data.action === "delete") {
      await db.listing.deleteMany({ where: { id: { in: parsed.data.ids } } });
    } else {
      await db.listing.updateMany({
        where: { id: { in: parsed.data.ids } },
        data: {
          status: parsed.data.action === "publish" ? "PUBLISHED" : "ARCHIVED",
          publishedAt: parsed.data.action === "publish" ? new Date() : null
        }
      });
    }

    try {
      await logAuditEvent({
        at: new Date().toISOString(),
        actor: session.userId,
        action: parsed.data.action.toUpperCase(),
        objectType: "LISTING",
        summary: `${parsed.data.action} ${parsed.data.ids.length} listing(s)`
      });
    } catch (auditError) {
      logServerError("admin-listings-bulk-audit", auditError);
    }

    return NextResponse.json(okResult(undefined, "Listing bulk action completed."));
  } catch (error) {
    logServerError("admin-listings-bulk-patch", error, { action: parsed.data.action, ids: parsed.data.ids });
    return NextResponse.json(failResult("Unable to process listing bulk action."), { status: 500 });
  }
}
