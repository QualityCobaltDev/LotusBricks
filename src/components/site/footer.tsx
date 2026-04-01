import Link from "next/link";

export function SiteFooter({
  emailHref,
  email,
  phoneHref,
  phoneDisplay,
  appVersion
}: {
  emailHref: string;
  email: string;
  phoneHref: string;
  phoneDisplay: string;
  appVersion?: string;
}) {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <h3>RightBricks</h3>
          <p>
            Cambodia’s trusted marketplace for buyers, renters, sellers, landlords, and developers seeking verified listings and structured property workflows.
          </p>
          <p className="muted"><a href={emailHref}>{email}</a> · <a href={phoneHref}>{phoneDisplay}</a></p>
        </div>
        <div>
          <h4>Explore</h4>
          <ul>
            <li><Link href="/listings">Listings</Link></li>
            <li><Link href="/pricing">Pricing</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4>Trust & legal</h4>
          <ul>
            <li><Link href="/support">Support center</Link></li>
            <li><Link href="/legal/privacy">Privacy policy</Link></li>
            <li><Link href="/legal/terms">Terms</Link></li>
            <li><Link href="/legal/accessibility">Accessibility</Link></li>
          </ul>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© {new Date().getFullYear()} RightBricks. All rights reserved.</span>
        <span>Build {appVersion ?? "dev"} · Built for transparent, high-confidence property decisions.</span>
      </div>
    </footer>
  );
}
