import { CONTACT } from "@/lib/contact";

export function FloatingContactCta() {
  return (
    <div className="floating-contact" aria-label="Quick contact actions">
      <a href={CONTACT.whatsappHref} className="btn btn-primary" data-track-event="whatsapp_click" data-track-label="floating-whatsapp">WhatsApp</a>
      <a href="/contact" className="btn btn-outline" data-track-event="contact_form_start" data-track-label="floating-contact">Contact Us</a>
    </div>
  );
}
