export type ResourceArticle = {
  slug: string;
  title: string;
  description: string;
  summary: string;
  body: string;
};

export const RESOURCE_ARTICLES: ResourceArticle[] = [
  {
    slug: "phnom-penh-investment-guide",
    title: "Phnom Penh investment guide",
    description: "District-level signals and checkpoints for property investment decisions in Phnom Penh.",
    summary: "District-level investment signals, rental pressure zones, and underwriting checkpoints.",
    body: "Use district-level context, verification standards, and documentation checks to make faster, lower-risk decisions."
  },
  {
    slug: "buyer-due-diligence-checklist",
    title: "Buyer due-diligence checklist",
    description: "A practical due-diligence checklist for evaluating Cambodia property listings.",
    summary: "A pre-deposit legal, financial, and physical review workflow for safer transactions.",
    body: "Validate listing media, ownership documentation, pricing comparables, and inquiry readiness before committing."
  },
  {
    slug: "developer-listing-playbook",
    title: "Developer listing playbook",
    description: "How development teams can publish verification-ready listings that convert qualified inquiries.",
    summary: "How developers can launch trusted listing pages that convert qualified enquiries.",
    body: "Present verified media, complete facts, and response workflows to improve lead quality and conversion."
  }
];

const RESOURCE_SLUG_SET = new Set(RESOURCE_ARTICLES.map((article) => article.slug));

export function getResourceBySlug(slug: string) {
  return RESOURCE_ARTICLES.find((article) => article.slug === slug) ?? null;
}

export function isKnownResourceSlug(slug: string) {
  return RESOURCE_SLUG_SET.has(slug);
}
