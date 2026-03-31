import Link from "next/link";
import { routes } from "@/lib/routes";

export default function LandlordsPage() {
  return (
    <section className="card card-body">
      <h1>Landlord Services</h1>
      <p>Fill units faster with qualified leads and clear monthly performance reporting.</p>
      <ul>
        <li>Optimized listing setup</li>
        <li>Tenant inquiry triage</li>
        <li>Support for long-term portfolio growth</li>
      </ul>
      <Link href={`${routes.contact}?inquiry=landlord-onboarding`}>Request onboarding</Link>
    </section>
  );
}
