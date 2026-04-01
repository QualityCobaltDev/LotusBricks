import { db } from "@/lib/db";
import Link from "next/link";

export default async function HomePage() {
  const hero = await db.siteContent.findUnique({ where: { key: "homepage.hero" } });
  const featured = await db.listing.findMany({ where: { status: "PUBLISHED", featured: true }, take: 3 });
  return (
    <section>
      <h1>{hero?.title ?? "Property marketplace for modern teams"}</h1>
      <p>{hero?.body}</p>
      <p><Link className="btn" href="/listings">Browse listings</Link></p>
      <h2>Featured properties</h2>
      <div className="grid">{featured.map((x) => <article className="card" key={x.id}><h3>{x.title}</h3><p>{x.city} · ${x.priceUsd.toLocaleString()}</p><Link href={`/listings/${x.slug}`}>View</Link></article>)}</div>
    </section>
  );
}
