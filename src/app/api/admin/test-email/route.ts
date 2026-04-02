import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sendTransactionalEmail } from "@/lib/email";
import { failResult, okResult } from "@/lib/mutation-result";
import { logServerError } from "@/lib/observability";

export async function POST() {
  const session = await getSession();
  if (session?.role !== "ADMIN") return NextResponse.json(failResult("Forbidden"), { status: 403 });

  const to = process.env.SMTP_USER ?? "contact@rightbricks.online";

  try {
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

    if (!result.ok) {
      return NextResponse.json(failResult("SMTP test failed. Check SMTP settings and email logs."), { status: 400 });
    }

    return NextResponse.json(okResult(undefined, "SMTP test email sent."));
  } catch (error) {
    logServerError("admin-test-email-post", error);
    return NextResponse.json(failResult("Unable to send SMTP test email."), { status: 500 });
  }
}
