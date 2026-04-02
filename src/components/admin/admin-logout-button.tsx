"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminLogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function onLogout() {
    if (isLoading) return;
    setIsLoading(true);

    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.replace("/login/admin");
      router.refresh();
      setIsLoading(false);
    }
  }

  return (
    <button className="btn btn-ghost" type="button" onClick={onLogout} aria-busy={isLoading}>
      {isLoading ? "Logging out..." : "Logout"}
    </button>
  );
}
