import { Suspense } from "react";
import { ContactForm } from "@/components/ui/contact-form";

export default function ContactPage() {
  return (
    <section className="card card-body">
      <h1>Contact us</h1>
      <p>Send your inquiry to sales, support, or partnerships.</p>
      <Suspense fallback={<p>Loading contact form...</p>}>
        <ContactForm />
      </Suspense>
    </section>
  );
}
