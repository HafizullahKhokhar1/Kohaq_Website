"use client";

import { useState } from "react";

export function ApplicationModal({
  jobId,
  isOpen,
  onClose,
}: {
  jobId: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [resumeUrl, setResumeUrl] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit() {
    if (!resumeUrl.trim()) {
      setMessage({ type: "error", text: "Resume URL is required" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/jobs/${jobId}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume: resumeUrl,
          coverLetter: coverLetter.trim(),
        }),
      });

      const payload = (await response.json()) as { success: boolean; error?: string };

      if (!response.ok || !payload.success) {
        setMessage({ type: "error", text: payload.error ?? "Application failed" });
        return;
      }

      setMessage({ type: "success", text: "Applied successfully!" });
      setTimeout(() => {
        onClose();
        setResumeUrl("");
        setCoverLetter("");
      }, 1500);
    } catch {
      setMessage({ type: "error", text: "Application failed. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-lg">
        <h2 className="font-heading text-2xl text-primary dark:text-white">Apply Now</h2>
        <p className="mt-2 text-sm text-text-muted">Submit your resume and cover letter</p>

        <div className="mt-5 space-y-4">
          <div>
            <label className="font-label text-xs uppercase tracking-[0.15em] text-text-muted">
              Resume URL (Cloudinary, Google Drive, etc)
            </label>
            <input
              type="url"
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              placeholder="https://..."
              className="mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="font-label text-xs uppercase tracking-[0.15em] text-text-muted">
              Cover Letter (optional)
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Tell us why you're interested in this role..."
              rows={4}
              className="mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
            />
          </div>

          {message ? (
            <p className={`text-sm ${message.type === "success" ? "text-secondary" : "text-red-500"}`}>
              {message.text}
            </p>
          ) : null}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 rounded-full bg-accent px-4 py-2 font-label text-xs uppercase tracking-[0.15em] text-[#111] disabled:opacity-70"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full border border-border px-4 py-2 font-label text-xs uppercase tracking-[0.15em] hover:bg-surface-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

