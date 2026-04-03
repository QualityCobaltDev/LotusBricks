import Link from "next/link";
import { getContactSettings } from "@/lib/site-settings";
import { CONTACT_CONFIDENCE_POINTS, CONTACT_PROCESS, TRUST_BADGES } from "@/lib/trust";

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
