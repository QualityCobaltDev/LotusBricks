"use client";

import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";

export function SiteFooter({
  emailHref,
  email,
  phoneHref,
  phoneDisplay,
  whatsappHref,
  telegramHref,
  appVersion
}: {
  emailHref: string;
  email: string;
  phoneHref: string;
  phoneDisplay: string;
  whatsappHref?: string;
  telegramHref?: string;
  appVersion?: string;
}) {
  return (
    <footer className="site-footer">
      <Reveal className="shell footer-cta" y={12}>
        <div>
          <h3>Ready to generate qualified property leads?</h3>
          <p>Launch your listing with RightBricks and get direct enquiries from serious buyers, renters, and investors in Cambodia.</p>
        </div>
        <div className="hero-actions">
          <Link href="/pricing" className="btn btn-primary" data-track-event="homepage_cta_click" data-track-label="footer-list-property">List Your Property</Link>
          <Link href="/contact" className="btn btn-outline" data-track-event="contact_form_start" data-track-label="footer-contact">Contact Us</Link>
        </div>
      </Reveal>

      <div className="shell footer-grid">
        <Reveal>
          <div>
            <h3>RightBricks</h3>
            <p>
              Trusted platform serving Cambodia&apos;s real estate market with verified listings, transparent communication, and responsive support.
            </p>
            <p className="muted">✉️ <a href={emailHref} data-track-event="email_click" data-track-label="footer-email">{email}</a> · ☎️ <a href={phoneHref} data-track-event="call_click" data-track-label="footer-phone">{phoneDisplay}</a></p>
            <p className="muted">💬 <a href={whatsappHref} data-track-event="whatsapp_click" data-track-label="footer-whatsapp">WhatsApp</a> · 📲 <a href={telegramHref} data-track-event="telegram_click" data-track-label="footer-telegram">Telegram</a></p>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <div>
            <h4>Quick actions</h4>
            <ul>
              <li><Link href="/pricing">List Your Property</Link></li>
              <li><Link href="/listings">Browse Listings</Link></li>
              <li><Link href="/contact">Contact Sales</Link></li>
              <li><Link href="/about">Why RightBricks</Link></li>
              <li><Link href="/resources">Resources</Link></li>
            </ul>
          </div>
        </Reveal>
        <Reveal delay={160}>
          <div>
            <h4>Trust & legal</h4>
            <ul>
              <li><Link href="/support">Support center</Link></li>
              <li><Link href="/legal/privacy">Privacy policy</Link></li>
              <li><Link href="/legal/terms">Terms</Link></li>
              <li><Link href="/legal/accessibility">Accessibility</Link></li>
              <li><Link href="/login/admin">Admin Access</Link></li>
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
