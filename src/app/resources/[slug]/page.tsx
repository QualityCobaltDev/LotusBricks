import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildBreadcrumbJsonLd, buildMetadata } from "@/lib/metadata";
import { getCanonicalSiteUrl } from "@/lib/env";
import { getResourceBySlug, RESOURCE_ARTICLES } from "@/lib/resources";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return RESOURCE_ARTICLES.map((resource) => ({ slug: resource.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const resource = getResourceBySlug(slug);
  if (!resource) {
    return { title: "Resource not found", robots: { index: false, follow: false } };
  }

  return buildMetadata({
    title: resource.title,
    description: resource.description,
    path: `/resources/${resource.slug}`,
    type: "article"
  });
}

export default async function ResourceDetailPage({ params }: Props) {
  const { slug } = await params;
  const resource = getResourceBySlug(slug);

  if (!resource) {
    notFound();
  }

  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Resources", path: "/resources" },
    { name: resource.title, path: `/resources/${resource.slug}` }
  ]);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: resource.title,
    description: resource.description,
    datePublished: resource.publishedAt,
    dateModified: resource.updatedAt,
    mainEntityOfPage: `${getCanonicalSiteUrl()}/resources/${resource.slug}`,
    author: {
      "@type": "Organization",
      name: "RightBricks"
    },
    publisher: {
      "@type": "Organization",
      name: "RightBricks"
    }
  };

  return (
    <section className="shell section narrow">
      <nav aria-label="Breadcrumb"><p><Link href="/">Home</Link> / <Link href="/resources">Resources</Link> / <span>{resource.title}</span></p></nav>
      <h1>{resource.title}</h1>
      <p className="muted">Updated {resource.updatedAt}</p>
      <p className="muted">{resource.body}</p>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
    </section>
  );
}
