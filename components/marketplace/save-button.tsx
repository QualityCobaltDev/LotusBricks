"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = { listingSlug: string; initialSaved?: boolean; compact?: boolean };

export function SaveButton({ listingSlug, initialSaved = false, compact }: Props) {
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function toggle() {
    setLoading(true);
    const res = await fetch("/api/listings/save", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ listingSlug }) });
    const json = await res.json();
    setLoading(false);
    if (res.status === 401) return router.push(`/auth/login?redirect=/listings/${listingSlug}`);
    if (res.ok) {
      setSaved(json.saved);
      router.refresh();
    }
  }

  return <button type="button" onClick={toggle} disabled={loading} className={compact ? "text-xs font-medium text-neutral-500 hover:text-primary-700" : "rounded-lg border px-3 py-2 text-sm"}>{loading ? "..." : saved ? "Saved" : "Save"}</button>;
}
