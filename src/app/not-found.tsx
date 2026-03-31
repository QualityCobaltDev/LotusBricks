import Link from "next/link";
import { routes } from "@/lib/routes";

export default function NotFound() {
  return (
    <section className="card card-body">
      <h1>Page not found</h1>
      <p>The page you requested does not exist.</p>
      <Link href={routes.home}>Return home</Link>
    </section>
  );
}
