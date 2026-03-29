import Link from "next/link";

export interface CommunityThread {
  _id: string;
  title: string;
  content?: string;
  category?: string;
  tags?: string[];
  isPinned?: boolean;
  isResolved?: boolean;
  commentCount?: number;
  createdAt?: string;
  author?: { name?: string } | null;
}

interface ThreadCardProps {
  thread: CommunityThread;
}

export function ThreadCard({ thread }: ThreadCardProps) {
  const createdAt = thread.createdAt
    ? new Date(thread.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <article className="rounded-xl border border-border bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:hover:shadow-glow">
      <div className="flex flex-wrap items-center gap-2 text-xs text-text-muted">
        {thread.isPinned ? (
          <span className="rounded-full bg-accent px-2 py-1 font-label uppercase tracking-[0.15em] text-[#111]">
            Pinned
          </span>
        ) : null}
        {thread.isResolved ? <span className="rounded-full border border-secondary px-2 py-1 text-secondary">Resolved</span> : null}
        {thread.category ? <span>{thread.category}</span> : null}
        {createdAt ? <span>{createdAt}</span> : null}
      </div>

      <h3 className="mt-3 font-heading text-2xl text-primary dark:text-white">{thread.title}</h3>
      <p className="mt-2 line-clamp-3 text-sm text-text-muted">{thread.content || "No content provided."}</p>

      {thread.tags && thread.tags.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {thread.tags.slice(0, 4).map((tag) => (
            <span key={`${thread._id}-${tag}`} className="rounded-full border border-border px-2 py-1 text-xs text-text-muted">
              #{tag}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-5 flex items-center justify-between">
        <p className="text-xs text-text-muted">{thread.author?.name || "Community Member"}</p>
        <Link
          href={`/community/${thread._id}`}
          className="rounded-full bg-accent px-4 py-2 font-label text-xs uppercase tracking-[0.15em] text-[#111]"
        >
          Open Thread ({thread.commentCount || 0})
        </Link>
      </div>
    </article>
  );
}

