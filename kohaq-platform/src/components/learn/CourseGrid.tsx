import { CourseCard } from "@/components/learn/CourseCard";

type CourseItem = {
  _id: string;
  title: string;
  slug: string;
  shortDesc?: string;
  category?: string;
  level?: string;
  price?: number;
  totalDuration?: number;
};

export function CourseGrid({ items }: { items: CourseItem[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-surface p-8 text-center text-sm text-text-muted">
        No courses found for the selected filters.
      </div>
    );
  }

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <CourseCard
          key={item._id}
          title={item.title}
          slug={item.slug}
          shortDesc={item.shortDesc}
          category={item.category}
          level={item.level}
          price={item.price}
          totalDuration={item.totalDuration}
        />
      ))}
    </section>
  );
}

