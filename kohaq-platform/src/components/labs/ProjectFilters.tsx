"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

interface ProjectFiltersProps {
  tags: string[];
}

export function ProjectFilters({ tags }: ProjectFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedTag = searchParams.get("tag") ?? "";
  const featured = searchParams.get("featured") ?? "";
  const search = searchParams.get("search") ?? "";

  const filters = useMemo(() => ["", ...tags], [tags]);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    params.delete("page");
    const query = params.toString();
    router.push(query ? `/labs?${query}` : "/labs");
  }

  return (
    <aside className="space-y-5 rounded-xl border border-border bg-surface p-5">
      <h3 className="font-heading text-lg text-primary dark:text-white">Filter Projects</h3>

      <div>
        <label className="font-label text-xs uppercase tracking-[0.15em] text-text-muted" htmlFor="search-projects">
          Search
        </label>
        <input
          id="search-projects"
          value={search}
          onChange={(event) => updateParam("search", event.target.value)}
          placeholder="Search by title or description"
          className="mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
        />
      </div>

      <div>
        <p className="font-label text-xs uppercase tracking-[0.15em] text-text-muted">Tag</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {filters.map((tag) => (
            <button
              key={`tag-${tag || "all"}`}
              type="button"
              onClick={() => updateParam("tag", tag)}
              className={`rounded-full px-3 py-1 text-xs transition ${
                selectedTag === tag
                  ? "bg-accent text-[#111]"
                  : "border border-border text-text-muted hover:border-accent"
              }`}
            >
              {tag || "All"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="font-label text-xs uppercase tracking-[0.15em] text-text-muted">Featured</p>
        <div className="mt-2 flex gap-2">
          {["", "true", "false"].map((value) => (
            <button
              key={`featured-${value || "all"}`}
              type="button"
              onClick={() => updateParam("featured", value)}
              className={`rounded-full px-3 py-1 text-xs transition ${
                featured === value
                  ? "bg-accent text-[#111]"
                  : "border border-border text-text-muted hover:border-accent"
              }`}
            >
              {value === "" ? "All" : value === "true" ? "Featured" : "Regular"}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
