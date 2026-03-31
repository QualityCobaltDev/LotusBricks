import { NextResponse } from "next/server";
import { contactSettings } from "@/lib/server-store";

export async function GET() {
  return NextResponse.json({ contactSettings });
}

export async function POST(request: Request) {
  const body = await request.json();
  contactSettings.phoneDisplay = body.phoneDisplay || contactSettings.phoneDisplay;
  contactSettings.phoneHref = body.phoneHref || contactSettings.phoneHref;
  contactSettings.email = body.email || contactSettings.email;
  contactSettings.supportHours = body.supportHours || contactSettings.supportHours;
  return NextResponse.json({ ok: true, contactSettings });
}
