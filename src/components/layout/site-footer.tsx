import Link from "next/link";
import { routes } from "@/lib/routes";

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container" style={{ display: "grid", gap: "0.5rem" }}>
        <small>© {new Date().getFullYear()} RightBricks. Trusted Cambodia real estate marketplace.</small>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link href={routes.about}>About</Link>
          <Link href={routes.help}>Help</Link>
          <Link href={routes.terms}>Terms</Link>
          <Link href={routes.privacy}>Privacy</Link>
        </div>
      </div>
    </footer>
  );
}
