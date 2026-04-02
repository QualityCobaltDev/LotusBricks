import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { logAuditEvent } from "@/lib/admin-control";

export async function PATCH(req: Request) {
  const session = await getSession();
  if (session?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const payload = (await req.json()) as { ids: string[]; action: "publish" | "archive" | "delete" };
  if (!Array.isArray(payload.ids) || !payload.ids.length) return NextResponse.json({ error: "ids required" }, { status: 400 });

  if (payload.action === "delete") {
    await db.listing.deleteMany({ where: { id: { in: payload.ids } } });
  } else {
    await db.listing.updateMany({
      where: { id: { in: payload.ids } },
      data: {
        status: payload.action === "publish" ? "PUBLISHED" : "ARCHIVED",
        publishedAt: payload.action === "publish" ? new Date() : null
      }
    });
  }

  await logAuditEvent({
    at: new Date().toISOString(),
    actor: session.userId,
    action: payload.action.toUpperCase(),
    objectType: "LISTING",
    summary: `${payload.action} ${payload.ids.length} listing(s)`
  });

  return NextResponse.json({ ok: true });
}
