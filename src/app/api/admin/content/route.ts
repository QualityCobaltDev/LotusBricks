import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { logAuditEvent } from "@/lib/admin-control";

export async function GET() {
  const session = await getSession();
  if (session?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const rows = await db.siteContent.findMany({ orderBy: { key: "asc" } });
  return NextResponse.json(rows);
}

export async function PUT(req: Request) {
  const session = await getSession();
  if (session?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = (await req.json()) as {
    key: string;
    title: string;
    body: string;
    meta?: Record<string, unknown>;
  };

  if (!body.key || !body.title || !body.body) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

  const row = await db.siteContent.upsert({
    where: { key: body.key },
    create: { key: body.key, title: body.title, body: body.body, meta: (body.meta ?? {}) as never },
    update: { title: body.title, body: body.body, meta: (body.meta ?? {}) as never }
  });

  await logAuditEvent({
    at: new Date().toISOString(),
    actor: session.userId,
    action: "UPDATE",
    objectType: "SITE_CONTENT",
    objectId: row.id,
    summary: `Updated CMS section ${body.key}`
  });

  return NextResponse.json({ ok: true, row });
}
