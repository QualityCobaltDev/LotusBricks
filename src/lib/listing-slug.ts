import { db } from "@/lib/db";

export function normalizeListingSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function ensureUniqueListingSlug(baseInput: string, excludeId?: string): Promise<string> {
  const base = normalizeListingSlug(baseInput);
  if (!base) return "";

  const collisions = await db.listing.findMany({
    where: {
      slug: { startsWith: base },
      ...(excludeId ? { id: { not: excludeId } } : {})
    },
    select: { slug: true }
  });

  const used = new Set(collisions.map((item) => item.slug));
  if (!used.has(base)) return base;

  let suffix = 2;
  while (used.has(`${base}-${suffix}`)) {
    suffix += 1;
  }

  return `${base}-${suffix}`;
}
