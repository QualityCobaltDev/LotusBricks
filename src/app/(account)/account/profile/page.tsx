import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function ProfilePage() {
  return (
    <section className="card card-body" style={{ maxWidth: 700 }}>
      <h1>Profile</h1>
      <form>
        <FormField label="Name"><Input defaultValue="Alex Morgan" /></FormField>
        <FormField label="Email"><Input defaultValue="alex@example.com" type="email" /></FormField>
        <FormField label="Phone"><Input defaultValue="+1 (555) 120-4000" /></FormField>
        <Button type="submit">Save profile</Button>
      </form>
    </section>
  );
}
