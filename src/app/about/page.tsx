import Link from "next/link";
import type { Metadata } from "next";
import { platformPotentialStats } from "@/lib/site/content";
import { buildMetadata } from "@/lib/metadata";
import { getContactSettings } from "@/lib/site-settings";
import { COMPANY_POSITIONING, CONTACT_PROCESS, TRUST_BADGES } from "@/lib/trust";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description: "Learn how RightBricks delivers verified property intelligence and trusted marketplace workflows across Cambodia.",
  path: "/about"
});

export default async function AboutPage() {
  const contact = await getContactSettings();

  return (
    <section className="shell section">
      <div className="section-head narrow">
        <h1>About RightBricks</h1>
        <p className="muted">{COMPANY_POSITIONING}</p>
      </div>

      <div className="two-col">
        <article className="card-pad">
          <h2>Who RightBricks is for</h2>
          <ul className="check-list">
            <li>Owners and landlords who want direct, qualified enquiries.</li>
            <li>Agencies and developers who need a professional listing structure.</li>
            <li>Buyers and renters who value clear information and trusted communication paths.</li>
          </ul>
          <Link href="/contact" className="btn btn-primary" data-track-event="contact_form_start" data-track-label="about-contact">Contact Us</Link>
        </article>
        <article className="card-pad">
          <h2>What makes RightBricks different</h2>
          <ul className="check-list">
            {TRUST_BADGES.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <p className="muted">Every listing follows a structured presentation model to improve confidence before enquiries begin.</p>
        </article>
      </div>

      <article className="card-pad" style={{ marginBottom: "1rem" }}>
        <h2>How the process works</h2>
        <div className="grid">
          {CONTACT_PROCESS.map((step) => (
            <div key={step.title}>
              <h3>{step.title}</h3>
              <p className="muted">{step.text}</p>
            </div>
          ))}
        </div>
      </article>

      <div className="stat-grid">{platformPotentialStats.map((item) => <article key={item.label} className="stat-card"><p>{item.value}</p><span>{item.label}</span></article>)}</div>

      <section className="cta-band">
        <h2>Need help deciding your next step?</h2>
        <p>Talk to us directly at <a href={contact.emailHref}>{contact.email}</a> or <a href={contact.phoneHref}>{contact.phoneDisplay}</a>.</p>
        <div className="hero-actions">
          <Link href="/pricing" className="btn btn-primary" data-track-event="choose_tier" data-track-label="about-list-property">List Your Property</Link>
          <Link href="/support" className="btn btn-ghost" data-track-event="contact_form_start" data-track-label="about-support">Visit Support</Link>
        </div>
      </section>
    </section>
  );
}
