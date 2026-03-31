import { Section } from "@/components/site/section";
import { siteConfig } from "@/lib/site-config";

export default function HelpPage() {
  return <Section className="py-12"><h1 className="text-3xl font-bold">Help Center</h1><p className="mt-2 text-neutral-600">Support for enquiries, valuations, and listing management.</p><p className="mt-3">Contact <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a> or <a href={`tel:${siteConfig.contactPhoneHref}`}>{siteConfig.contactPhoneDisplay}</a>.</p></Section>;
}
