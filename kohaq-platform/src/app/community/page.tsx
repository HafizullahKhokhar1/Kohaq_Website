"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CreateThreadForm } from "@/components/community/CreateThreadForm";
import { ThreadCard, type CommunityThread } from "@/components/community/ThreadCard";

export default function CommunityPage() {
  const [threads, setThreads] = useState<CommunityThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const categories = useMemo(
    () => ["", "General", "Frontend", "Backend", "AI", "Career", "DevOps"],
    []
  );

  const loadThreads = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("limit", "24");
      if (search.trim()) params.set("search", search.trim());
      if (category.trim()) params.set("category", category.trim());

      const response = await fetch(`/api/community?${params.toString()}`);
      const payload = (await response.json()) as {
        success: boolean;
        data?: { items: CommunityThread[] };
      };

      if (response.ok && payload.success && payload.data?.items) {
        setThreads(payload.data.items);
      } else {
        setThreads([]);
      }
    } finally {
      setLoading(false);
    }
  }, [category, search]);

  useEffect(() => {
    loadThreads();
  }, [loadThreads]);

  return (
    <main className="min-h-screen space-y-10 py-12">
      <section className="mx-auto max-w-6xl space-y-4 px-6">
        <h1 className="font-heading text-4xl font-bold text-primary dark:text-white">KOHAQ Community</h1>
        <p className="max-w-3xl text-lg text-text-muted">
          Ask questions, share wins, and collaborate with learners, mentors, and builders.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6">
        <div className="grid gap-6 lg:grid-cols-4">
          <div className="space-y-6">
            <CreateThreadForm onCreated={loadThreads} />

            <aside className="space-y-3 rounded-xl border border-border bg-surface p-5">
              <h2 className="font-heading text-xl text-primary dark:text-white">Filter Threads</h2>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by title or content"
                className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
              />
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
              >
                {categories.map((item) => (
                  <option key={`community-category-${item || "all"}`} value={item}>
                    {item || "All categories"}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategory("");
                }}
                className="rounded-full border border-border px-3 py-2 font-label text-xs uppercase tracking-[0.15em] text-text-muted hover:bg-surface-2"
              >
                Clear Filters
              </button>
            </aside>
          </div>

          <div className="space-y-4 lg:col-span-3">
            {loading ? (
              <div className="rounded-xl border border-border bg-surface p-8 text-center">
                <p className="text-text-muted">Loading threads...</p>
              </div>
            ) : threads.length === 0 ? (
              <div className="rounded-xl border border-border bg-surface p-8 text-center">
                <p className="text-text-muted">No threads match these filters yet.</p>
              </div>
            ) : (
              threads.map((thread) => <ThreadCard key={thread._id} thread={thread} />)
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

