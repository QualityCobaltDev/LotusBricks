import { requireAdmin } from "@/server/guards";
import { db } from "@/lib/db";
export default async function ContentPage(){await requireAdmin();const rows=await db.siteContent.findMany();return <section><h1>Site content</h1><ul>{rows.map((r)=><li key={r.id}>{r.key}: {r.title}</li>)}</ul></section>}
