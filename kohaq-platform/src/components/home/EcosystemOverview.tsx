"use client";

import { motion } from "framer-motion";

const items = [
  {
    title: "Kohaq Learn",
    description: "Structured learning paths, progress tracking, and certificates for real skills.",
  },
  {
    title: "Kohaq Careers",
    description: "Find internships and jobs with filters designed for Pakistan's growing tech ecosystem.",
  },
  {
    title: "Kohaq Labs",
    description: "Build portfolio-ready projects and collaborate through practical, mentor-backed sprints.",
  },
];

export function EcosystemOverview() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-14 sm:py-20">
      <h2 className="font-heading text-3xl text-primary sm:text-4xl">One Platform. Three Engines of Growth.</h2>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {items.map((item, idx) => (
          <motion.article
            key={item.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, delay: idx * 0.08 }}
            className="rounded-xl border border-border bg-surface p-6 shadow-sm transition hover:shadow-lg dark:hover:shadow-glow"
          >
            <h3 className="font-heading text-2xl text-primary dark:text-white">{item.title}</h3>
            <p className="mt-3 text-sm text-text-muted">{item.description}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

