import { NextResponse } from "next/server";
import { z } from "zod";
import { createInquiry } from "@/lib/marketplace";
import { sendContactEmail } from "@/lib/email/send";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(10)
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid form payload" }, { status: 400 });
  }

  const inquiry = createInquiry(parsed.data);
  await sendContactEmail(parsed.data).catch((error) => {
    console.error("Contact email error", error);
  });

  return NextResponse.json({ ok: true, inquiryId: inquiry.id });
}
