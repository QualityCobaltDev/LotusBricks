import { Reveal } from "@/components/ui/reveal";
import { getStaggerDelay } from "@/lib/motion";
import { platformPotentialDisclaimer, platformPotentialStats } from "@/lib/site/content";

export function PlatformPotential() {
  return (
    <section className="shell section platform-potential">
      <Reveal>
        <div className="section-head platform-potential-head">
          <h2>Platform Potential</h2>
          <p className="muted">
            Designed to maximize visibility, enquiries, and response efficiency across Cambodia&apos;s property market.
          </p>
        </div>
      </Reveal>
      <div className="stat-grid">
        {platformPotentialStats.map((item, index) => (
          <Reveal key={item.label} delay={getStaggerDelay(index)}>
            <article className="stat-card potential-card">
              <p>{item.value}</p>
              <span>{item.label}</span>
            </article>
          </Reveal>
        ))}
      </div>
      <Reveal delay={getStaggerDelay(platformPotentialStats.length)}>
        <p className="platform-potential-disclaimer">{platformPotentialDisclaimer}</p>
      </Reveal>
    </section>
  );
}
