import Link from "next/link";

type CourseCardProps = {
  title: string;
  slug: string;
  shortDesc?: string;
  category?: string;
  level?: string;
  price?: number;
  totalDuration?: number;
};

export function CourseCard({
  title,
  slug,
  shortDesc,
  category,
  level,
  price,
  totalDuration,
}: CourseCardProps) {
  return (
    <article className="rounded-xl border border-border bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:hover:shadow-glow">
      <p className="font-label text-[10px] uppercase tracking-[0.15em] text-text-muted">
        {category ?? "General"} {level ? `• ${level}` : ""}
      </p>
      <h3 className="mt-2 font-heading text-2xl text-primary dark:text-white">{title}</h3>
      <p className="mt-3 line-clamp-3 text-sm text-text-muted">
        {shortDesc ?? "Build practical, career-ready skills with a structured learning path."}
      </p>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-text-muted">{totalDuration ? `${totalDuration} min` : "Self-paced"}</span>
        <span className="font-semibold text-accent">{(price ?? 0) > 0 ? `PKR ${price}` : "Free"}</span>
      </div>

      <Link
        href={`/learn/${slug}`}
        className="mt-5 inline-flex rounded-full bg-accent px-4 py-2 font-label text-xs uppercase tracking-[0.15em] text-[#111]"
      >
        View Course
      </Link>
    </article>
  );
}

