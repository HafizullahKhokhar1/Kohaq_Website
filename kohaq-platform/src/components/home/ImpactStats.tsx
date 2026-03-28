const stats = [
  { label: "Learners", value: "12K+" },
  { label: "Courses", value: "180+" },
  { label: "Hiring Partners", value: "95+" },
  { label: "Projects Built", value: "1.2K+" },
];

export function ImpactStats() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-14 sm:pb-20">
      <div className="grid gap-4 rounded-2xl border border-border bg-surface p-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl bg-surface-2 p-5">
            <p className="font-heading text-3xl text-accent">{stat.value}</p>
            <p className="mt-1 text-sm text-text-muted">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

