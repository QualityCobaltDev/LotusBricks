import { OFFICIAL_CONTACT } from "@/lib/contact";

function shell(title: string, body: string) {
  return `
  <div style="font-family:Arial,sans-serif;background:#f8fafc;padding:24px;color:#0f172a">
    <div style="max-width:640px;margin:0 auto;background:white;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden">
      <div style="background:#275DFF;color:white;padding:18px 24px;font-weight:700;font-size:20px">RightBricks</div>
      <div style="padding:24px">
        <h1 style="margin:0 0 12px;font-size:20px">${title}</h1>
        ${body}
      </div>
      <div style="padding:16px 24px;background:#f8fafc;border-top:1px solid #e2e8f0;font-size:13px;color:#334155">
        Contact us: <a href="mailto:${OFFICIAL_CONTACT.email}">${OFFICIAL_CONTACT.email}</a> ·
        <a href="tel:${OFFICIAL_CONTACT.phoneHref}">${OFFICIAL_CONTACT.phoneDisplay}</a>
      </div>
    </div>
  </div>`;
}

export function enquiryAdminTemplate(data: {
  listingTitle: string;
  listingSlug: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  timestamp: string;
}) {
  return shell(
    "New property enquiry",
    `<p>A new enquiry was submitted.</p>
      <p><strong>Property:</strong> ${data.listingTitle} (${data.listingSlug})</p>
      <p><strong>Name:</strong> ${data.name}<br/><strong>Email:</strong> ${data.email}<br/><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Message:</strong><br/>${data.message || "No message"}</p>
      <p><strong>Timestamp:</strong> ${data.timestamp}</p>`
  );
}

export function enquiryUserTemplate(data: { name: string; listingTitle: string }) {
  return shell(
    "We received your enquiry",
    `<p>Hi ${data.name},</p>
    <p>Thanks for enquiring about <strong>${data.listingTitle}</strong>.</p>
    <p>Our team will contact you shortly via phone or email with next steps and viewing options.</p>`
  );
}

export function genericConfirmationTemplate(data: { name: string; title: string; summary: string }) {
  return shell(data.title, `<p>Hi ${data.name},</p><p>${data.summary}</p><p>Our team will contact you shortly via phone or email.</p>`);
}
