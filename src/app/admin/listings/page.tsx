import { requireAdmin } from "@/server/guards";
import { db } from "@/lib/db";

export default async function AdminListings(){await requireAdmin();const listings=await db.listing.findMany({orderBy:{updatedAt:'desc'}});return <section><h1>Manage listings</h1><p>Use API /api/listings for create/update/delete.</p><div className='grid'>{listings.map((x)=><article className='card' key={x.id}><strong>{x.title}</strong><p>{x.status}</p></article>)}</div></section>}
