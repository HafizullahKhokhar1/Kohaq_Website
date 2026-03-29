import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gallery - KOHAQ Media",
  description: "Visual highlights from KOHAQ labs, events, and community milestones.",
};

const GALLERY_ITEMS = [
  { title: "Build Night", subtitle: "Lahore Campus", accent: "from-[#F59E0B]/30 to-[#10B981]/30" },
  { title: "Career Sprint", subtitle: "Mentor Sessions", accent: "from-[#06B6D4]/30 to-[#3B82F6]/30" },
  { title: "Demo Day", subtitle: "Student Startups", accent: "from-[#FB7185]/30 to-[#F97316]/30" },
  { title: "AI Workshop", subtitle: "Hands-on Labs", accent: "from-[#84CC16]/30 to-[#14B8A6]/30" },
  { title: "Community Meetup", subtitle: "Founders Circle", accent: "from-[#A78BFA]/30 to-[#22C55E]/30" },
  { title: "Graduation Showcase", subtitle: "Portfolio Reviews", accent: "from-[#F43F5E]/30 to-[#0EA5E9]/30" },
];

export default function GalleryPage() {
  return (
    <main className="min-h-screen space-y-10 py-12">
      <section className="mx-auto max-w-6xl space-y-4 px-6">
        <Link href="/media" className="font-label text-xs uppercase tracking-[0.15em] text-text-muted hover:text-text">
          Back to Media
        </Link>
        <h1 className="font-heading text-4xl font-bold text-primary dark:text-white">Gallery</h1>
        <p className="max-w-3xl text-lg text-text-muted">
          A visual timeline of events, labs, and outcomes built across the KOHAQ ecosystem.
        </p>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-6 md:grid-cols-2 xl:grid-cols-3">
        {GALLERY_ITEMS.map((item) => (
          <article key={item.title} className="overflow-hidden rounded-xl border border-border bg-surface">
            <div className={`h-44 bg-gradient-to-br ${item.accent}`} />
            <div className="space-y-1 p-4">
              <h2 className="font-heading text-xl text-primary dark:text-white">{item.title}</h2>
              <p className="text-sm text-text-muted">{item.subtitle}</p>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

