import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sendTransactionalEmail } from "@/lib/email";

export async function POST() {
  const session = await getSession();
  if (session?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const to = process.env.SMTP_USER ?? "contact@rightbricks.online";
  const result = await sendTransactionalEmail({
    type: "SMTP_TEST",
    to,
    subject: "RightBricks SMTP test",
    template: {
      heading: "SMTP test successful",
      intro: "This is a test email from the RightBricks admin dashboard.",
      rows: [{ label: "Environment", value: process.env.NODE_ENV ?? "development" }]
    }
  });

  return NextResponse.json({ ok: result.ok });
}
