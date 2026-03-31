import { NextResponse } from "next/server";
import { leads } from "@/lib/server-store";

export async function GET() {
  return NextResponse.json({ leads });
}
