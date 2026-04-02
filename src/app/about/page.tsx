import Link from "next/link";
import type { Metadata } from "next";
import { trustStats } from "@/lib/site/content";

export const metadata: Metadata = {
  title: "About",
  description: "Learn how RightBricks delivers verified property intelligence and trusted marketplace workflows across Cambodia.",
  alternates: { canonical: "/about" }
};

export default function AboutPage() {
  return (
    <section className="shell section">
      <div className="section-head narrow">
        <h1>About RightBricks</h1>
        <p className="muted">RightBricks is built to help Cambodia&apos;s property market move with more trust, clarity, and speed.</p>
      </div>

      <div className="two-col">
        <article className="card-pad">
          <h2>Why choose us</h2>
          <ul className="check-list">
            <li>Verification-first listing standards for stronger buyer confidence.</li>
            <li>Clear contact paths that reduce enquiry friction.</li>
            <li>Professional support for owners, agencies, developers, and investors.</li>
          </ul>
          <Link href="/contact" className="btn btn-primary" data-track-event="contact_form_start" data-track-label="about-contact">Contact Us</Link>
        </article>
        <article className="card-pad">
          <h2>Our mission</h2>
          <p>To become Cambodia&apos;s most trusted property platform by combining verified inventory, transparent communication, and conversion-focused listing execution.</p>
          <h3>Serving Cambodia real estate market</h3>
          <p className="muted">We support Phnom Penh, Siem Reap, Sihanoukville, and other growth corridors with a premium, business-grade platform experience.</p>
        </article>
      </div>

      <div className="stat-grid">{trustStats.map((item) => <article key={item.label} className="stat-card"><p>{item.value}</p><span>{item.label}</span></article>)}</div>

      <section className="cta-band">
        <h2>Ready to grow your property visibility?</h2>
        <div className="hero-actions">
          <Link href="/pricing" className="btn btn-primary" data-track-event="choose_tier" data-track-label="about-list-property">List Your Property</Link>
          <Link href="/listings" className="btn btn-ghost" data-track-event="click_browse_listings" data-track-label="about-view-listings">View Listings</Link>
        </div>
      </section>
    </section>
  );
}
