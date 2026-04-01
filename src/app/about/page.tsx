import Link from "next/link";
import { trustStats } from "@/lib/site/content";

export default function AboutPage() {
  return (
    <section className="shell section">
      <div className="section-head narrow">
        <h1>Building confidence in every property decision</h1>
        <p className="muted">
          RightBricks was created to eliminate uncertainty in property discovery through verification, richer listing intelligence,
          and a customer-first advisory experience.
        </p>
      </div>

      <div className="two-col">
        <article className="card-pad">
          <h2>Our mission</h2>
          <p>Make real estate decisions more transparent, efficient, and trustworthy for buyers, renters, investors, and agencies.</p>
          <h3>What makes us different</h3>
          <ul className="check-list">
            <li>Verification standards before listings go live.</li>
            <li>Media-rich detail pages that reduce ambiguity.</li>
            <li>Fast response operations that improve closing velocity.</li>
          </ul>
        </article>
        <article className="card-pad">
          <h2>Who we serve</h2>
          <p>From first-time renters to institutional buyers, our platform supports both individual journeys and portfolio strategies.</p>
          <p>RightBricks combines marketplace UX with premium service expectations for modern property transactions.</p>
        </article>
      </div>

      <div className="stat-grid">
        {trustStats.map((item) => (
          <article key={item.label} className="stat-card">
            <p>{item.value}</p>
            <span>{item.label}</span>
          </article>
        ))}
      </div>

      <section className="cta-band">
        <h2>Partner with a platform built for trust at scale</h2>
        <div className="hero-actions">
          <Link href="/contact" className="btn btn-primary">Speak with our team</Link>
          <Link href="/listings" className="btn btn-ghost">View live inventory</Link>
        </div>
      </section>
    </section>
  );
}
