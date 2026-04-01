import Link from "next/link";
import { db } from "@/lib/db";

export default async function ListingsPage() {
  const listings = await db.listing.findMany({ where: { status: "PUBLISHED" }, orderBy: { createdAt: "desc" } });
  return <section><h1>Listings</h1><div className="grid">{listings.map((l)=><article className="card" key={l.id}><h3>{l.title}</h3><p>{l.city} · {l.bedrooms} bed · ${l.priceUsd.toLocaleString()}</p><Link href={`/listings/${l.slug}`}>View details</Link></article>)}</div></section>;
}
