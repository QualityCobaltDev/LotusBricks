import Link from "next/link";
import type { Metadata } from "next";
import { getContactSettings } from "@/lib/site-settings";
import { buildMetadata } from "@/lib/metadata";
import { CONTACT_CONFIDENCE_POINTS, CONTACT_PROCESS, TRUST_BADGES } from "@/lib/trust";

export const metadata: Metadata = buildMetadata({
  title: "Support Center for Property Owners, Buyers, and Agencies",
  description: "Get RightBricks support for listings, enquiries, account access, and marketplace workflows.",
  path: "/support"
});

export default async function SupportPage() {
  const contact = await getContactSettings();

  return (
    <section className="shell section">
      <div className="section-head">
        <h1>Support Center</h1>
        <p className="muted">Support for owners, agencies, developers, and buyers who need responsive, professional help at each step.</p>
      </div>

      <div className="two-col">
        <article className="card-pad">
          <h2>Contact support directly</h2>
          <p>Email: <a href={contact.emailHref}>{contact.email}</a></p>
          <p>Phone: <a href={contact.phoneHref}>{contact.phoneDisplay}</a></p>
          <p>Channels: <a href={contact.whatsappHref}>WhatsApp</a> · <a href={contact.telegramHref}>Telegram</a></p>
          {contact.supportHours && <p>Support hours: {contact.supportHours}</p>}
          {contact.supportAddress && <p>Location: {contact.supportAddress}</p>}
          <p className="muted">{CONTACT_CONFIDENCE_POINTS.join(" · ")}.</p>
          <p className="muted">For tier comparisons and onboarding questions, review <Link href="/pricing">pricing plans</Link> then continue in <Link href="/contact">contact</Link>.</p>
        </article>

        <article className="card-pad">
          <h2>How support works</h2>
          <ul className="check-list">
            {CONTACT_PROCESS.map((step) => (
              <li key={step.title}><strong>{step.title.replace(") ", " — ")}</strong> {step.text}</li>
            ))}
          </ul>
          <p className="muted">For new listing enquiries, use our <Link href="/contact">contact page</Link> so we can route your request correctly.</p>
        </article>
      </div>

      <article className="card-pad section-card-gap">
        <h2>Support standards</h2>
        <ul className="check-list">
          {TRUST_BADGES.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </article>
    </section>
  );
}
