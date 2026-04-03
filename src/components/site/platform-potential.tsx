import { Reveal } from "@/components/ui/reveal";
import { getStaggerDelay } from "@/lib/motion";
import { platformPotentialDisclaimer, platformPotentialStats } from "@/lib/site/content";

export function PlatformPotential() {
  return (
    <section className="shell section platform-potential">
      <Reveal>
        <div className="section-head platform-potential-head">
          <h2>Operational standards</h2>
          <p className="muted">
            Trust signals that make RightBricks feel clear, accountable, and professionally operated.
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
