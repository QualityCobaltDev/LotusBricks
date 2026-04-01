import { db } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function ListingDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const listing = await db.listing.findUnique({ where: { slug }, include: { media: { orderBy: { sortOrder: "asc" } } } });
  if (!listing || listing.status !== "PUBLISHED") return notFound();
  return <section><h1>{listing.title}</h1><p>{listing.description}</p><p>${listing.priceUsd.toLocaleString()} · {listing.areaSqm} sqm</p><h3>Media</h3><ul>{listing.media.map((m)=><li key={m.id}><a href={m.url}>{m.kind}</a></li>)}</ul></section>;
}
