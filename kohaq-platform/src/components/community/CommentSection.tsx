"use client";

import { useCallback, useEffect, useState } from "react";

interface CommentItem {
  _id: string;
  content: string;
  createdAt?: string;
  author?: { name?: string } | null;
}

interface CommentSectionProps {
  threadId: string;
}

export function CommentSection({ threadId }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadComments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/community/${threadId}/comments`);
      const payload = (await response.json()) as { success: boolean; data?: CommentItem[] };
      if (response.ok && payload.success && payload.data) {
        setComments(payload.data);
      }
    } finally {
      setLoading(false);
    }
  }, [threadId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!content.trim()) {
      setMessage({ type: "error", text: "Comment cannot be empty." });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/community/${threadId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim() }),
      });

      const payload = (await response.json()) as { success: boolean; error?: string };
      if (!response.ok || !payload.success) {
        setMessage({ type: "error", text: payload.error || "Failed to post comment." });
        return;
      }

      setContent("");
      setMessage({ type: "success", text: "Comment posted." });
      await loadComments();
    } catch {
      setMessage({ type: "error", text: "Request failed. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4 rounded-xl border border-border bg-surface p-5">
      <h2 className="font-heading text-2xl text-primary dark:text-white">Discussion</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Share your comment"
          rows={4}
          className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
        />
        {message ? (
          <p className={`text-sm ${message.type === "success" ? "text-secondary" : "text-red-500"}`}>{message.text}</p>
        ) : null}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-accent px-4 py-2 font-label text-xs uppercase tracking-[0.15em] text-[#111] disabled:opacity-70"
        >
          {submitting ? "Posting..." : "Post Comment"}
        </button>
      </form>

      <div className="space-y-3">
        {loading ? (
          <p className="text-sm text-text-muted">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-text-muted">No comments yet. Start the conversation.</p>
        ) : (
          comments.map((comment) => (
            <article key={comment._id} className="rounded-lg border border-border bg-bg p-4">
              <p className="text-sm text-text">{comment.content}</p>
              <p className="mt-2 text-xs text-text-muted">
                {comment.author?.name || "Community Member"}
                {comment.createdAt
                  ? ` • ${new Date(comment.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}`
                  : ""}
              </p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

