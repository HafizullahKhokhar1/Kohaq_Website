const testimonials = [
  {
    name: "Areeba Khan",
    role: "Frontend Engineer Intern",
    quote: "Kohaq turned my learning path into a real internship in less than three months.",
  },
  {
    name: "Hamza Tariq",
    role: "Data Analyst",
    quote: "The project labs helped me build a portfolio that employers actually cared about.",
  },
  {
    name: "Sana Iqbal",
    role: "Career Switcher",
    quote: "From beginner to job-ready with one guided platform. The mentorship made the difference.",
  },
];

export function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-14 sm:py-20">
      <h2 className="font-heading text-3xl text-primary sm:text-4xl">Learner Stories</h2>
      <div className="mt-7 grid gap-4 md:grid-cols-3">
        {testimonials.map((item) => (
          <article key={item.name} className="rounded-xl border border-border bg-surface p-6 shadow-sm">
            <p className="text-sm leading-relaxed text-text">&quot;{item.quote}&quot;</p>
            <p className="mt-4 font-heading text-lg text-primary dark:text-white">{item.name}</p>
            <p className="text-xs text-text-muted">{item.role}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

