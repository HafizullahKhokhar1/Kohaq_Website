import type { Metadata } from "next";
import Link from "next/link";
import { BlogCard, type BlogCardData } from "@/components/media/BlogCard";
import { connectToDatabase } from "@/lib/db/mongoose";
import BlogPost from "@/lib/db/models/BlogPost";

export const metadata: Metadata = {
  title: "Blog - KOHAQ Media",
  description: "Engineering stories, community highlights, and product updates from KOHAQ.",
};

interface BlogPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    tag?: string;
    category?: string;
  }>;
}

function getPages(currentPage: number, totalPages: number) {
  const pages: number[] = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  return pages;
}

export default async function BlogListPage({ searchParams }: BlogPageProps) {
  const resolved = await searchParams;

  const page = Math.max(1, Number(resolved.page ?? "1") || 1);
  const limit = Math.min(24, Math.max(1, Number(resolved.limit ?? "9") || 9));
  const search = (resolved.search ?? "").trim();
  const tag = (resolved.tag ?? "").trim();
  const category = (resolved.category ?? "").trim();

  const query: Record<string, unknown> = { isPublished: true };

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { excerpt: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
    ];
  }

  if (tag) {
    query.tags = tag;
  }

  if (category) {
    query.category = category;
  }

  await connectToDatabase();

  const [postsRaw, total, categoriesRaw, tagsRaw] = await Promise.all([
    BlogPost.find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("author", "name")
      .lean(),
    BlogPost.countDocuments(query),
    BlogPost.distinct("category", { isPublished: true }),
    BlogPost.distinct("tags", { isPublished: true }),
  ]);

  const posts = postsRaw.map((post) => ({
    ...post,
    _id: String(post._id),
  })) as BlogCardData[];

  const categories = categoriesRaw.filter((item): item is string => typeof item === "string" && item.length > 0);
  const tags = tagsRaw.filter((item): item is string => typeof item === "string" && item.length > 0);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const pages = getPages(page, totalPages);

  return (
    <main className="min-h-screen space-y-10 py-12">
      <section className="mx-auto max-w-6xl space-y-4 px-6">
        <Link href="/media" className="font-label text-xs uppercase tracking-[0.15em] text-text-muted hover:text-text">
          Back to Media
        </Link>
        <h1 className="font-heading text-4xl font-bold text-primary dark:text-white">KOHAQ Blog</h1>
        <p className="max-w-3xl text-lg text-text-muted">
          Product notes, technical decisions, and learning stories from the KOHAQ team.
        </p>
      </section>

      <section className="mx-auto max-w-6xl space-y-6 px-6">
        <div className="space-y-3 rounded-xl border border-border bg-surface p-5">
          <form className="grid gap-3 md:grid-cols-3">
            <input
              defaultValue={search}
              name="search"
              placeholder="Search posts"
              className="rounded-lg border border-border bg-bg px-3 py-2 text-sm"
            />
            <select name="category" defaultValue={category} className="rounded-lg border border-border bg-bg px-3 py-2 text-sm">
              <option value="">All categories</option>
              {categories.map((item) => (
                <option key={`category-${item}`} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <select name="tag" defaultValue={tag} className="rounded-lg border border-border bg-bg px-3 py-2 text-sm">
              <option value="">All tags</option>
              {tags.map((item) => (
                <option key={`tag-${item}`} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="w-fit rounded-full bg-accent px-4 py-2 font-label text-xs uppercase tracking-[0.15em] text-[#111]"
            >
              Apply Filters
            </button>
          </form>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-xl border border-border bg-surface p-8 text-center">
            <p className="text-text-muted">No published posts match this filter.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {posts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        )}

        {totalPages > 1 ? (
          <nav className="flex flex-wrap items-center gap-2" aria-label="Blog pagination">
            {pages.map((pageNumber) => {
              const params = new URLSearchParams();
              params.set("page", String(pageNumber));
              params.set("limit", String(limit));
              if (search) params.set("search", search);
              if (tag) params.set("tag", tag);
              if (category) params.set("category", category);

              return (
                <Link
                  key={`blog-page-${pageNumber}`}
                  href={`/media/blog?${params.toString()}`}
                  className={`rounded-full px-3 py-1 text-xs ${
                    pageNumber === page
                      ? "bg-accent text-[#111]"
                      : "border border-border text-text-muted hover:border-accent"
                  }`}
                >
                  {pageNumber}
                </Link>
              );
            })}
          </nav>
        ) : null}
      </section>
    </main>
  );
}

