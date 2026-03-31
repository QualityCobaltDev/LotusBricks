import { NextResponse } from "next/server";
import { emailLogs } from "@/lib/server-store";

export async function GET() {
  return NextResponse.json({ emailLogs });
}
