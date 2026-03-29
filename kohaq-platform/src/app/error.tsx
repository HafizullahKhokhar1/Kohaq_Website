"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-heading text-3xl text-primary">Something went wrong</h1>
      <p className="mt-3 text-text-muted">An unexpected error occurred. Please try again.</p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-full bg-accent px-5 py-2 font-label text-xs uppercase tracking-[0.15em] text-[#111]"
      >
        Try again
      </button>
    </main>
  );
}

