import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <h3>RightBricks</h3>
          <p>
            A trusted marketplace for buyers, renters, and investors who need verified listings, clearer decisions, and faster
            transactions.
          </p>
          <p className="muted">support@rightbricks.com · +1 (415) 555-0199</p>
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
            <li><a href="#">Data security</a></li>
            <li><a href="#">Privacy policy</a></li>
            <li><a href="#">Terms</a></li>
            <li><a href="#">Accessibility</a></li>
          </ul>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© {new Date().getFullYear()} RightBricks. All rights reserved.</span>
        <span>Built for transparent, high-confidence property decisions.</span>
      </div>
    </footer>
  );
}
