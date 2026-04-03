import { z } from "zod";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { logAuditEvent } from "@/lib/admin-control";
import { failResult, okResult, toUserFacingError } from "@/lib/mutation-result";
import { logServerError } from "@/lib/observability";
import { revalidatePublicContent } from "@/lib/admin-revalidate";

const cmsPayloadSchema = z.object({
  key: z.string().min(2),
  title: z.string().min(2),
  body: z.string().min(2),
  meta: z.record(z.string(), z.unknown()).optional()
});

export async function GET() {
  const session = await getSession();
  if (session?.role !== "ADMIN") return NextResponse.json(failResult("Forbidden"), { status: 403 });

  const rows = await db.siteContent.findMany({ orderBy: { key: "asc" } });
  return NextResponse.json(okResult(rows));
}

export async function PUT(req: Request) {
  const session = await getSession();
  if (session?.role !== "ADMIN") return NextResponse.json(failResult("Forbidden"), { status: 403 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(failResult("Invalid JSON payload.", { fieldErrors: { body: ["Request body must be valid JSON."] } }), { status: 400 });
  }

  const parsed = cmsPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(failResult("Invalid payload", { fieldErrors: parsed.error.flatten().fieldErrors }), { status: 400 });
  }

  try {
    const row = await db.siteContent.upsert({
      where: { key: parsed.data.key },
      create: { key: parsed.data.key, title: parsed.data.title, body: parsed.data.body, meta: (parsed.data.meta ?? {}) as never },
      update: { title: parsed.data.title, body: parsed.data.body, meta: (parsed.data.meta ?? {}) as never }
    });

    try {
      await logAuditEvent({
        at: new Date().toISOString(),
        actor: session.userId,
        action: "UPDATE",
        objectType: "SITE_CONTENT",
        objectId: row.id,
        summary: `Updated CMS section ${parsed.data.key}`
      });
    } catch (auditError) {
      logServerError("admin-content-audit", auditError, { section: parsed.data.key });
    }

    revalidatePublicContent();
    return NextResponse.json(okResult(row, "Content section updated."));
  } catch (error) {
    logServerError("admin-content-put", error, { section: parsed.data.key });
    return NextResponse.json(toUserFacingError(error, "Unable to save content section."), { status: 500 });
  }
}
