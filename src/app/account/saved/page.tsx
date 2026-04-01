import Link from "next/link";
import { requireAuth } from "@/server/guards";
import { db } from "@/lib/db";

export default async function SavedPage(){const session=await requireAuth();const saved=await db.favorite.findMany({where:{userId:session.userId},include:{listing:true}});return <section><h1>Saved listings</h1><ul>{saved.map((s)=><li key={s.id}><Link href={`/listings/${s.listing.slug}`}>{s.listing.title}</Link></li>)}</ul></section>}
