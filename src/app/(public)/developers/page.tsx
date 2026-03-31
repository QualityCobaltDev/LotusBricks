import Link from "next/link";
import { routes } from "@/lib/routes";

export default function DevelopersPage() {
  return (
    <section className="card card-body">
      <h1>Developer & Enterprise Partnerships</h1>
      <p>Launch projects with dedicated campaign pages, inventory syndication, and custom reporting.</p>
      <ul>
        <li>Bulk project onboarding</li>
        <li>Dedicated account management</li>
        <li>Custom SLA and commercial packages</li>
      </ul>
      <Link href={`${routes.contact}?inquiry=enterprise`}>Contact enterprise sales</Link>
    </section>
  );
}
