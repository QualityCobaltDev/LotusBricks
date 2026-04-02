import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Developer listing playbook",
  description: "How development teams can publish verification-ready listings that convert qualified inquiries.",
  alternates: { canonical: "/resources/developer-listing-playbook" }
};

export default function DeveloperListingPlaybookPage() {
  return (
    <section className="shell section narrow">
      <h1>Developer listing playbook</h1>
      <p className="muted">Present verified media, complete facts, and response workflows to improve lead quality and conversion.</p>
    </section>
  );
}
