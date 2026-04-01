import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { PLAN_CONFIG, PLAN_ORDER } from "@/lib/plans";

export async function GET() {
  return NextResponse.json(PLAN_ORDER.map((k) => PLAN_CONFIG[k]));
}

export async function POST(req: Request) {
  const session = await getSession();
  if (session?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  return NextResponse.json({ message: "Plan configuration is code-managed in src/lib/plans.ts", received: body }, { status: 202 });
}
