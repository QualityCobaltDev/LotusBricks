import { requireAdmin } from "@/server/guards";
import { db } from "@/lib/db";
export default async function PricingAdmin(){await requireAdmin();const rows=await db.pricingPlan.findMany({orderBy:{sortOrder:'asc'}});return <section><h1>Pricing plans</h1><ul>{rows.map((r)=><li key={r.id}>{r.name} {r.priceLabel}</li>)}</ul></section>}
