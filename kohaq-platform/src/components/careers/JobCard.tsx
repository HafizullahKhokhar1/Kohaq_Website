"use client";

import Link from "next/link";

type JobCardProps = {
  id: string;
  title: string;
  company: { name: string; logo?: string } | string;
  domain?: string;
  type?: string;
  location?: string;
  salary?: { min?: number; max?: number; currency?: string };
  applicationDeadline?: string;
  applicationCount?: number;
};

export function JobCard({
  id,
  title,
  company,
  domain,
  type,
  location,
  salary,
  applicationDeadline,
  applicationCount,
}: JobCardProps) {
  const companyName = typeof company === "string" ? company : company?.name ?? "Company";
  const salaryDisplay = salary
    ? `PKR ${salary.min ?? 0}-${salary.max ?? 0}k`
    : "";

  const deadline = applicationDeadline
    ? new Date(applicationDeadline).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <article className="rounded-xl border border-border bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:hover:shadow-glow">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-label text-xs uppercase tracking-[0.15em] text-text-muted">{companyName}</p>
          <h3 className="mt-2 font-heading text-xl text-primary dark:text-white">{title}</h3>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {domain ? <span className="rounded-full border border-border px-2 py-1 text-xs text-text-muted">{domain}</span> : null}
        {type ? <span className="rounded-full border border-border px-2 py-1 text-xs text-text-muted capitalize">{type.replace("-", " ")}</span> : null}
        {location ? <span className="rounded-full border border-border px-2 py-1 text-xs text-text-muted">{location}</span> : null}
      </div>

      {salaryDisplay ? <p className="mt-3 text-sm font-semibold text-accent">{salaryDisplay}</p> : null}

      <div className="mt-4 flex items-center justify-between text-xs text-text-muted">
        <span>{applicationCount ?? 0} applications</span>
        {deadline ? <span>Due: {deadline}</span> : null}
      </div>

      <Link
        href={`/careers/${id}`}
        className="mt-4 inline-flex rounded-full bg-accent px-4 py-2 font-label text-xs uppercase tracking-[0.15em] text-[#111]"
      >
        View & Apply
      </Link>
    </article>
  );
}

