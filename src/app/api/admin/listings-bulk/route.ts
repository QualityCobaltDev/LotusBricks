import { z } from "zod";
import { NextResponse } from "next/server";
import { revalidatePublicListings } from "@/lib/admin-revalidate";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { logAuditEvent } from "@/lib/admin-control";
import { failResult, okResult } from "@/lib/mutation-result";
import { logServerError } from "@/lib/observability";
import { getVerificationReadiness } from "@/lib/listing-validation";

const bulkListingSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
  action: z.enum(["publish", "archive", "delete"])
});

export async function PATCH(req: Request) {
  const session = await getSession();
  if (session?.role !== "ADMIN") return NextResponse.json(failResult("Forbidden"), { status: 403 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(failResult("Invalid JSON payload."), { status: 400 });
  }

  const parsed = bulkListingSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json(failResult("Invalid payload", { fieldErrors: parsed.error.flatten().fieldErrors }), { status: 400 });

  try {
    if (parsed.data.action === "delete") {
      await db.listing.deleteMany({ where: { id: { in: parsed.data.ids } } });
    } else if (parsed.data.action === "publish") {
      const rows = await db.listing.findMany({ where: { id: { in: parsed.data.ids } }, include: { media: { select: { id: true } } } });
      const blocked: Record<string, string[]> = {};
      const publishableIds: string[] = [];

      for (const row of rows) {
        if (row.verificationState === "VERIFIED") {
          const readiness = getVerificationReadiness({ ...row, mediaCount: row.media.length });
          if (!readiness.readyForVerified) {
            blocked[row.id] = [`${row.title}: readiness ${readiness.score}%`];
            continue;
          }
        }
        publishableIds.push(row.id);
      }

      if (publishableIds.length) {
        await db.listing.updateMany({ where: { id: { in: publishableIds } }, data: { status: "PUBLISHED", publishedAt: new Date() } });
      }

      if (Object.keys(blocked).length) {
        return NextResponse.json(failResult("Some listings could not be published.", { fieldErrors: blocked }), { status: 400 });
      }
    } else {
      await db.listing.updateMany({ where: { id: { in: parsed.data.ids } }, data: { status: "ARCHIVED", publishedAt: null } });
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

    revalidatePublicListings();

    return NextResponse.json(okResult(undefined, "Listing bulk action completed."));
  } catch (error) {
    logServerError("admin-listings-bulk-patch", error, { action: parsed.data.action, ids: parsed.data.ids });
    return NextResponse.json(failResult("Unable to process listing bulk action."), { status: 500 });
  }
}
