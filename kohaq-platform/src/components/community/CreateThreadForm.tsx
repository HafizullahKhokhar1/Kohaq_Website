"use client";

import { useState } from "react";

interface CreateThreadFormProps {
  onCreated: () => void;
}

export function CreateThreadForm({ onCreated }: CreateThreadFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim() || !content.trim()) {
      setMessage({ type: "error", text: "Title and content are required." });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          category: category.trim(),
          tags: tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        }),
      });

      const payload = (await response.json()) as { success: boolean; error?: string };

      if (!response.ok || !payload.success) {
        setMessage({ type: "error", text: payload.error || "Failed to create thread." });
        return;
      }

      setTitle("");
      setContent("");
      setCategory("");
      setTags("");
      setMessage({ type: "success", text: "Thread created successfully." });
      onCreated();
    } catch {
      setMessage({ type: "error", text: "Request failed. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border bg-surface p-5">
      <h2 className="font-heading text-xl text-primary dark:text-white">Start a Thread</h2>

      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Thread title"
        className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
      />

      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Describe your question or idea"
        rows={5}
        className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
      />

      <div className="grid gap-3 md:grid-cols-2">
        <input
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          placeholder="Category (e.g. Frontend, AI, Career)"
          className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
        />
        <input
          value={tags}
          onChange={(event) => setTags(event.target.value)}
          placeholder="Tags separated by comma"
          className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
        />
      </div>

      {message ? (
        <p className={`text-sm ${message.type === "success" ? "text-secondary" : "text-red-500"}`}>{message.text}</p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-accent px-4 py-2 font-label text-xs uppercase tracking-[0.15em] text-[#111] disabled:opacity-70"
      >
        {submitting ? "Publishing..." : "Publish Thread"}
      </button>
    </form>
  );
}
