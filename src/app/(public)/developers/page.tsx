import Link from "next/link";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

const perks = ["Dedicated project onboarding", "Bulk inventory upload", "Priority campaign placement"];

export default function DevelopersPage() {
  return (
    <section className="card card-body">
      <h1>Developer Partnerships</h1>
      <p>Scale new-build inventory with enterprise workflows and reporting dashboards.</p>
      <ul>{perks.map((perk) => <li key={perk}>{perk}</li>)}</ul>
      <Link href={`${routes.contact}?inquiry=developer`}><Button>Talk to partnerships</Button></Link>
    </section>
  );
}
