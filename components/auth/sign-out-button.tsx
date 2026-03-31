"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  className?: string;
};

export function SignOutButton({ className }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSignOut() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button type="button" onClick={onSignOut} disabled={loading} className={className}>
      {loading ? "Signing out..." : "Sign out"}
    </button>
  );
}
