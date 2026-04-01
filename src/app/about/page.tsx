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
        <p className="muted">RightBricks exists to reduce uncertainty in real estate decisions through verification-first listing standards, transparent data, and responsive support.</p>
      </div>

      <div className="two-col">
        <article className="card-pad">
          <h2>What we verify</h2>
          <ul className="check-list">
            <li>Listing source legitimacy and ownership signals.</li>
            <li>Media consistency, recency, and property matching.</li>
            <li>Core facts used by buyers, renters, and investors.</li>
          </ul>
          <h3>Who we serve</h3>
          <p>Buyers, renters, agencies, developers, and institutional teams looking for clearer property decisions in Cambodia.</p>
        </article>
        <article className="card-pad">
          <h2>Our operating principles</h2>
          <ol>
            <li>Truth over volume: better listings beat more listings.</li>
            <li>Speed with accountability: clear inquiry routing and follow-through.</li>
            <li>Market context matters: localization and district-level relevance.</li>
          </ol>
          <p className="muted">Expansion-ready architecture supports Phnom Penh, Siem Reap, and Sihanoukville growth tracks.</p>
        </article>
      </div>

      <div className="stat-grid">{trustStats.map((item) => <article key={item.label} className="stat-card"><p>{item.value}</p><span>{item.label}</span></article>)}</div>

      <section className="cta-band">
        <h2>Ready to work with a verification-first marketplace?</h2>
        <div className="hero-actions">
          <Link href="/contact" className="btn btn-primary">Speak with our team</Link>
          <Link href="/listings" className="btn btn-ghost">View live inventory</Link>
        </div>
      </section>
    </section>
  );
}
