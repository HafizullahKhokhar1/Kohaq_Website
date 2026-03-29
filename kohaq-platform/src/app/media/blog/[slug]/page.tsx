import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connectToDatabase } from "@/lib/db/mongoose";
import BlogPost from "@/lib/db/models/BlogPost";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

interface BlogDetail {
  _id: string;
  title: string;
  excerpt?: string;
  content?: string;
  category?: string;
  tags?: string[];
  readTime?: number;
  publishedAt?: string;
  author?: { name?: string } | null;
}

async function getPost(slug: string) {
  await connectToDatabase();

  const post = await BlogPost.findOne({ slug, isPublished: true }).populate("author", "name").lean();

  if (!post) {
    return null;
  }

  return {
    ...post,
    _id: String(post._id),
  } as BlogDetail;
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return { title: "Post Not Found - KOHAQ Media" };
  }

  return {
    title: `${post.title} - KOHAQ Media`,
    description: post.excerpt || `Read ${post.title} on KOHAQ Media`,
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const dateLabel = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <main className="min-h-screen space-y-10 py-12">
      <section className="mx-auto max-w-4xl space-y-4 px-6">
        <Link href="/media/blog" className="font-label text-xs uppercase tracking-[0.15em] text-text-muted hover:text-text">
          Back to Blog
        </Link>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-text-muted">
            {post.category ? <span>{post.category}</span> : null}
            {dateLabel ? <span>{dateLabel}</span> : null}
            {post.readTime ? <span>{post.readTime} min read</span> : null}
            <span>{post.author?.name || "KOHAQ Team"}</span>
          </div>
          <h1 className="font-heading text-4xl font-bold text-primary dark:text-white">{post.title}</h1>
          {post.excerpt ? <p className="text-lg text-text-muted">{post.excerpt}</p> : null}
        </div>

        {post.tags && post.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={`${post._id}-tag-${tag}`} className="rounded-full border border-border px-2 py-1 text-xs text-text-muted">
                #{tag}
              </span>
            ))}
          </div>
        ) : null}
      </section>

      <article className="mx-auto max-w-4xl rounded-xl border border-border bg-surface p-6 md:p-8">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          {post.content ? (
            post.content.split("\n\n").map((paragraph, index) => (
              <p key={`${post._id}-paragraph-${index}`}>{paragraph}</p>
            ))
          ) : (
            <p>Content will be published soon.</p>
          )}
        </div>
      </article>
    </main>
  );
}
