"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="h-8 w-8 animate-pulse rounded-full bg-surface-2" />;
  }

  if (status === "authenticated" && session?.user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard"
          className="hidden rounded-full bg-accent px-4 py-2 font-label text-xs uppercase tracking-[0.15em] text-[#111] transition hover:opacity-90 sm:inline-block"
        >
          Dashboard
        </Link>
        <button
          onClick={() => signOut()}
          className="rounded-full border border-border px-3 py-2 font-label text-xs uppercase tracking-[0.15em] text-text-muted transition hover:bg-surface-2 sm:px-4"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="hidden rounded-full bg-accent px-4 py-2 font-label text-xs uppercase tracking-[0.15em] text-[#111] transition hover:opacity-90 sm:inline-block"
    >
      Login
    </Link>
  );
}
