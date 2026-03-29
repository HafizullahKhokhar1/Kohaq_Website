import Link from "next/link";

export interface BlogCardData {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  tags?: string[];
  category?: string;
  readTime?: number;
  publishedAt?: string;
  author?: { name?: string } | null;
}

interface BlogCardProps {
  post: BlogCardData;
}

export function BlogCard({ post }: BlogCardProps) {
  const dateLabel = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <article className="rounded-xl border border-border bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:hover:shadow-glow">
      <div className="flex flex-wrap items-center gap-2">
        {post.category ? (
          <span className="rounded-full border border-border px-2 py-1 text-xs text-text-muted">{post.category}</span>
        ) : null}
        {dateLabel ? <span className="text-xs text-text-muted">{dateLabel}</span> : null}
        {post.readTime ? <span className="text-xs text-text-muted">{post.readTime} min read</span> : null}
      </div>

      <h2 className="mt-3 font-heading text-2xl text-primary dark:text-white">{post.title}</h2>
      <p className="mt-2 line-clamp-3 text-sm text-text-muted">{post.excerpt || "No excerpt available."}</p>

      {post.tags && post.tags.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {post.tags.slice(0, 4).map((tag) => (
            <span key={`${post._id}-${tag}`} className="rounded-full bg-surface-2 px-2 py-1 text-xs text-text-muted">
              #{tag}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-5 flex items-center justify-between">
        <p className="text-xs text-text-muted">{post.author?.name || "KOHAQ Team"}</p>
        <Link
          href={`/media/blog/${post.slug}`}
          className="rounded-full bg-accent px-4 py-2 font-label text-xs uppercase tracking-[0.15em] text-[#111]"
        >
          Read More
        </Link>
      </div>
    </article>
  );
}
