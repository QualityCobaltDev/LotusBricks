import { db } from "@/lib/db";

export type CmsSection = {
  key: string;
  title: string;
  body: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  updatedAt?: string;
  updatedBy?: string;
  isDraft?: boolean;
  internalNotes?: string;
};

const DEFAULT_SECTIONS: CmsSection[] = [
  { key: "homepage", title: "Homepage", body: "Manage hero, trust, featured listings, and CTA sections." },
  { key: "about", title: "About", body: "Company story, market position, and trust proof." },
  { key: "contact", title: "Contact", body: "Contact form copy, support notes, and office details." },
  { key: "pricing", title: "Pricing Page", body: "Plans intro, comparison narrative, and CTA settings." },
  { key: "footer", title: "Footer", body: "Footer links, legal labels, and copyright note." },
  { key: "header", title: "Header / Navigation", body: "Primary navigation labels and utility links." },
  { key: "privacy", title: "Privacy Policy", body: "Privacy policy page content." },
  { key: "terms", title: "Terms", body: "Terms of service content." },
  { key: "accessibility", title: "Accessibility", body: "Accessibility statement content." },
  { key: "trust", title: "Trust / Support", body: "Trust and support framework details." }
];

export async function ensureCmsSections() {
  await Promise.all(
    DEFAULT_SECTIONS.map((section) =>
      db.siteContent.upsert({
        where: { key: section.key },
        update: {},
        create: { key: section.key, title: section.title, body: section.body, meta: {} }
      })
    )
  );
}

export async function getCmsSections() {
  await ensureCmsSections();
  return db.siteContent.findMany({ orderBy: { key: "asc" } });
}

const AUDIT_KEY = "admin.audit.v1";

export type AuditEvent = {
  at: string;
  actor: string;
  action: string;
  objectType: string;
  objectId?: string;
  summary: string;
};

export async function logAuditEvent(event: AuditEvent) {
  const existing = await db.siteSetting.findUnique({ where: { key: AUDIT_KEY } });
  const list = Array.isArray(existing?.value) ? (existing?.value as AuditEvent[]) : [];
  const next = [event, ...list].slice(0, 500);
  await db.siteSetting.upsert({
    where: { key: AUDIT_KEY },
    create: { key: AUDIT_KEY, value: next },
    update: { value: next }
  });
}

export async function getAuditEvents() {
  const existing = await db.siteSetting.findUnique({ where: { key: AUDIT_KEY } });
  return Array.isArray(existing?.value) ? (existing.value as AuditEvent[]) : [];
}
