import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getResourceBySlug, RESOURCE_ARTICLES } from "@/lib/resources";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return RESOURCE_ARTICLES.map((resource) => ({ slug: resource.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const resource = getResourceBySlug(slug);
  if (!resource) {
    return { title: "Resource not found" };
  }

  return {
    title: resource.title,
    description: resource.description,
    alternates: { canonical: `/resources/${resource.slug}` }
  };
}

export default async function ResourceDetailPage({ params }: Props) {
  const { slug } = await params;
  const resource = getResourceBySlug(slug);

  if (!resource) {
    notFound();
  }

  return (
    <section className="shell section narrow">
      <h1>{resource.title}</h1>
      <p className="muted">{resource.body}</p>
    </section>
  );
}
