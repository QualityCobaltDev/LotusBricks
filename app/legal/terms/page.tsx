import { Section } from "@/components/site/section";
import { siteConfig } from "@/lib/site-config";

export default function TermsPage() { return <Section className="py-12"><h1 className="text-3xl font-bold">Terms of Service</h1><p className="mt-3 text-neutral-600">By using RightBricks, users agree to provide accurate listing and enquiry information.</p><p className="mt-3">Support contact: <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>, <a href={`tel:${siteConfig.contactPhoneHref}`}>{siteConfig.contactPhoneDisplay}</a>.</p></Section>; }
