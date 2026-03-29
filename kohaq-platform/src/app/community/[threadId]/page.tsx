import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CommentSection } from "@/components/community/CommentSection";
import { connectToDatabase } from "@/lib/db/mongoose";
import Thread from "@/lib/db/models/Thread";

interface ThreadDetailPageProps {
  params: Promise<{ threadId: string }>;
}

interface ThreadDetail {
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

async function getThread(threadId: string) {
  await connectToDatabase();

  const thread = await Thread.findById(threadId).populate("author", "name").lean();

  if (!thread) {
    return null;
  }

  return {
    ...thread,
    _id: String(thread._id),
  } as ThreadDetail;
}

export async function generateMetadata({ params }: ThreadDetailPageProps): Promise<Metadata> {
  const { threadId } = await params;
  const thread = await getThread(threadId);

  if (!thread) {
    return { title: "Thread Not Found - KOHAQ Community" };
  }

  return {
    title: `${thread.title} - KOHAQ Community`,
    description: thread.content?.slice(0, 160) || `Discussion thread in ${thread.category || "Community"}`,
  };
}

export default async function ThreadDetailPage({ params }: ThreadDetailPageProps) {
  const { threadId } = await params;
  const thread = await getThread(threadId);

  if (!thread) {
    notFound();
  }

  const createdAt = thread.createdAt
    ? new Date(thread.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <main className="min-h-screen space-y-8 py-12">
      <section className="mx-auto max-w-4xl space-y-4 px-6">
        <Link href="/community" className="font-label text-xs uppercase tracking-[0.15em] text-text-muted hover:text-text">
          Back to Community
        </Link>

        <div className="space-y-3 rounded-xl border border-border bg-surface p-6">
          <div className="flex flex-wrap items-center gap-2 text-xs text-text-muted">
            {thread.isPinned ? (
              <span className="rounded-full bg-accent px-2 py-1 font-label uppercase tracking-[0.15em] text-[#111]">
                Pinned
              </span>
            ) : null}
            {thread.isResolved ? (
              <span className="rounded-full border border-secondary px-2 py-1 text-secondary">Resolved</span>
            ) : null}
            {thread.category ? <span>{thread.category}</span> : null}
            {createdAt ? <span>{createdAt}</span> : null}
            <span>{thread.author?.name || "Community Member"}</span>
          </div>

          <h1 className="font-heading text-3xl font-bold text-primary dark:text-white">{thread.title}</h1>
          <p className="whitespace-pre-wrap text-text-muted">{thread.content || "No content provided."}</p>

          {thread.tags && thread.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {thread.tags.map((tag) => (
                <span key={`${thread._id}-${tag}`} className="rounded-full border border-border px-2 py-1 text-xs text-text-muted">
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6">
        <CommentSection threadId={thread._id} />
      </section>
    </main>
  );
}
