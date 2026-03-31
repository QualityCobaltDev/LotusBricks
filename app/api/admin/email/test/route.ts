import { NextResponse } from "next/server";
import { genericConfirmationTemplate } from "@/lib/email/templates";
import { sendEmail } from "@/lib/email/service";

export async function POST(request: Request) {
  const body = await request.json();
  const recipient = body.recipient;
  if (!recipient || typeof recipient !== "string") {
    return NextResponse.json({ error: "Recipient is required" }, { status: 400 });
  }

  const result = await sendEmail({
    to: recipient,
    subject: "RightBricks SMTP test email",
    html: genericConfirmationTemplate({ name: "Admin", title: "SMTP test successful", summary: "This is a system-generated SMTP health check email." }),
    type: "admin_test_email"
  });

  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
