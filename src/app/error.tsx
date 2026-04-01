"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[app-error-boundary]", error);
  }, [error]);

  return (
    <section className="shell section">
      <h1>Something went wrong</h1>
      <p className="muted">We hit an unexpected error while loading this page. Please try again.</p>
      {error.digest && <p className="muted">Reference: {error.digest}</p>}
      <div className="hero-actions">
        <button className="btn btn-primary" onClick={reset}>Try again</button>
        <Link href="/" className="btn btn-ghost">Back to homepage</Link>
      </div>
    </section>
  );
}
