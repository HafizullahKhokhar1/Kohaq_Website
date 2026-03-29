"use client";

import { useState } from "react";

export function EnrollButton({ slug }: { slug: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleEnroll() {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/courses/${slug}/enroll`, { method: "POST" });
      const payload = (await response.json()) as { success: boolean; error?: string };

      if (!response.ok || !payload.success) {
        setMessage(payload.error ?? "Enrollment failed");
        return;
      }

      setMessage("Enrolled successfully. Open the first lesson to begin.");
    } catch {
      setMessage("Enrollment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleEnroll}
        disabled={loading}
        className="rounded-full bg-accent px-5 py-2 font-label text-xs uppercase tracking-[0.15em] text-[#111] disabled:opacity-70"
      >
        {loading ? "Enrolling..." : "Enroll now"}
      </button>
      {message ? <p className="text-sm text-text-muted">{message}</p> : null}
    </div>
  );
}
