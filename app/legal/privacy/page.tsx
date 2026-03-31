import { Section } from "@/components/site/section";
import { siteConfig } from "@/lib/site-config";

export default function PrivacyPage() { return <Section className="py-12"><h1 className="text-3xl font-bold">Privacy Policy</h1><p className="mt-3 text-neutral-600">We process enquiry and contact data to deliver property services and support communications.</p><p className="mt-3">Data requests: <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>.</p></Section>; }
