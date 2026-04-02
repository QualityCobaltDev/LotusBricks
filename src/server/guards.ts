import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export async function requireAuth() {
  const session = await getSession();
  if (!session) redirect("/login/admin");
  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();
  if (session.role !== "ADMIN") redirect("/");
  return session;
}

