import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { logAuditEvent } from "@/lib/admin-control";

const KEY = "admin.brand-settings.v1";

export async function GET() {
  const session = await getSession();
  if (session?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const setting = await db.siteSetting.findUnique({ where: { key: KEY } });
  return NextResponse.json(setting?.value ?? {});
}

export async function PUT(req: Request) {
  const session = await getSession();
  if (session?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const value = await req.json();

  await db.siteSetting.upsert({
    where: { key: KEY },
    create: { key: KEY, value: value as never },
    update: { value: value as never }
  });

  await logAuditEvent({
    at: new Date().toISOString(),
    actor: session.userId,
    action: "UPDATE",
    objectType: "SETTINGS",
    summary: "Updated global brand settings"
  });

  return NextResponse.json({ ok: true });
}
