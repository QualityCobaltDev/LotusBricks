import "../styles/globals.css";
import Link from "next/link";
import { getSession } from "@/lib/auth";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  return (
    <html lang="en">
      <body>
        <header className="header">
          <Link href="/" className="brand">RightBricks</Link>
          <nav>
            <Link href="/listings">Listings</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            {session ? <Link href={session.role === "ADMIN" ? "/admin" : "/account"}>Dashboard</Link> : <Link href="/sign-in">Sign In</Link>}
          </nav>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
