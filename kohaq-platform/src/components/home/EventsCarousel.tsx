const events = [
  { title: "AI Career Launchpad", date: "April 12, 2026", place: "Lahore" },
  { title: "Frontend Sprint Week", date: "May 04, 2026", place: "Islamabad" },
  { title: "Data Science Demo Day", date: "May 28, 2026", place: "Karachi" },
];

export function EventsCarousel() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-14 sm:py-20">
      <h2 className="font-heading text-3xl text-primary sm:text-4xl">Upcoming Events</h2>
      <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
        {events.map((event) => (
          <article key={event.title} className="min-w-[280px] rounded-xl border border-border bg-surface p-5 shadow-sm">
            <p className="font-label text-[10px] uppercase tracking-[0.15em] text-text-muted">{event.date}</p>
            <h3 className="mt-2 font-heading text-xl text-primary dark:text-white">{event.title}</h3>
            <p className="mt-2 text-sm text-text-muted">{event.place}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

