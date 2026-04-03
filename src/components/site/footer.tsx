"use client";

import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { COMPANY_POSITIONING, CONTACT_CONFIDENCE_POINTS, TRUST_BADGES } from "@/lib/trust";

export function SiteFooter({
  emailHref,
  email,
  phoneHref,
  phoneDisplay,
  whatsappHref,
  telegramHref,
  supportHours,
  supportAddress,
  appVersion
}: {
  emailHref: string;
  email: string;
  phoneHref: string;
  phoneDisplay: string;
  whatsappHref?: string;
  telegramHref?: string;
  supportHours?: string;
  supportAddress?: string;
  appVersion?: string;
}) {
  return (
    <footer className="site-footer">
      <Reveal className="shell footer-cta" y={12}>
        <div>
          <h3>Ready to launch with confidence?</h3>
          <p>No-obligation guidance, direct support, and a structured listing workflow for serious property exposure.</p>
        </div>
        <div className="hero-actions">
          <Link href="/pricing" className="btn btn-primary" data-track-event="homepage_cta_click" data-track-label="footer-list-property">List Your Property</Link>
          <Link href="/contact" className="btn btn-outline" data-track-event="contact_form_start" data-track-label="footer-contact">Talk to the Team</Link>
        </div>
      </Reveal>

      <div className="shell footer-grid">
        <Reveal>
          <div>
            <h3>RightBricks</h3>
            <p>{COMPANY_POSITIONING}</p>
            <p className="muted">✉️ <a href={emailHref} data-track-event="email_click" data-track-label="footer-email">{email}</a> · ☎️ <a href={phoneHref} data-track-event="call_click" data-track-label="footer-phone">{phoneDisplay}</a></p>
            <p className="muted">💬 <a href={whatsappHref} data-track-event="whatsapp_click" data-track-label="footer-whatsapp">WhatsApp</a> · 📲 <a href={telegramHref} data-track-event="telegram_click" data-track-label="footer-telegram">Telegram</a></p>
            {supportHours && <p className="muted">Support hours: {supportHours}</p>}
            {supportAddress && <p className="muted">Location: {supportAddress}</p>}
          </div>
        </Reveal>
        <Reveal delay={80}>
          <div>
            <h4>Operational trust</h4>
            <ul>
              {TRUST_BADGES.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="muted">{CONTACT_CONFIDENCE_POINTS.join(" · ")}</p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div>
            <h4>Quick links</h4>
            <ul>
              <li><Link href="/pricing">List Your Property</Link></li>
              <li><Link href="/listings">Browse Listings</Link></li>
              <li><Link href="/contact">Contact Sales</Link></li>
              <li><Link href="/about">About RightBricks</Link></li>
              <li><Link href="/support">Support Center</Link></li>
            </ul>
          </div>
        </Reveal>
        <Reveal delay={160}>
          <div>
            <h4>Legal</h4>
            <ul>
              <li><Link href="/legal/privacy">Privacy Policy</Link></li>
              <li><Link href="/legal/terms">Terms of Service</Link></li>
              <li><Link href="/legal/accessibility">Accessibility Statement</Link></li>
            </ul>
          </div>
        </Reveal>
      </div>
      <Reveal className="shell footer-bottom" y={12}>
        <span>© {new Date().getFullYear()} RightBricks. All rights reserved.</span>
        <span>{appVersion ? `Version ${appVersion} · ` : ""}Built for transparent, high-confidence property decisions.</span>
      </Reveal>
    </footer>
  );
}
