import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Media - KOHAQ",
  description: "KOHAQ stories, blog posts, and gallery highlights.",
};

const MEDIA_SECTIONS = [
  {
    href: "/media/blog",
    title: "Blog",
    description: "Deep dives, engineering stories, and ecosystem updates from KOHAQ.",
    cta: "Read Articles",
  },
  {
    href: "/media/gallery",
    title: "Gallery",
    description: "Snapshots from labs, events, workshops, and student milestones.",
    cta: "Explore Gallery",
  },
];

export default function MediaHubPage() {
  return (
    <main className="min-h-screen space-y-10 py-12">
      <section className="mx-auto max-w-6xl space-y-4 px-6">
        <h1 className="font-heading text-4xl font-bold text-primary dark:text-white">KOHAQ Media</h1>
        <p className="max-w-3xl text-lg text-text-muted">
          Follow our journey through technical write-ups, behind-the-scenes stories, and visual highlights.
        </p>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-2">
        {MEDIA_SECTIONS.map((section) => (
          <article key={section.href} className="rounded-xl border border-border bg-surface p-6 shadow-sm">
            <h2 className="font-heading text-2xl text-primary dark:text-white">{section.title}</h2>
            <p className="mt-3 text-text-muted">{section.description}</p>
            <Link
              href={section.href}
              className="mt-5 inline-flex rounded-full bg-accent px-4 py-2 font-label text-xs uppercase tracking-[0.15em] text-[#111]"
            >
              {section.cta}
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}

