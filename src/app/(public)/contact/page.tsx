import { Suspense } from "react";
import { ContactForm } from "@/components/ui/contact-form";

export default function ContactPage() {
  return (
    <div className="grid" style={{ gap: "1rem" }}>
      <h1>Contact RightBricks</h1>
      <p>Call +855 23 000 000 or send a request below and our team will respond quickly.</p>
      <section className="card card-body"><Suspense fallback={<p>Loading form...</p>}><ContactForm /></Suspense></section>
    </div>
  );
}
