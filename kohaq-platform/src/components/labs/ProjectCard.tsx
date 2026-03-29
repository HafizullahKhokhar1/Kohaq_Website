import Link from "next/link";

export interface LabProject {
  _id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  demoUrl?: string;
  githubUrl?: string;
  tags?: string[];
  isFeatured?: boolean;
  createdAt?: string;
}

interface ProjectCardProps {
  project: LabProject;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="rounded-xl border border-border bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:hover:shadow-glow">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-heading text-xl text-primary dark:text-white">{project.title}</h3>
        {project.isFeatured ? (
          <span className="rounded-full bg-accent px-2 py-1 font-label text-[10px] uppercase tracking-[0.15em] text-[#111]">
            Featured
          </span>
        ) : null}
      </div>

      <p className="mt-3 line-clamp-3 text-sm text-text-muted">
        {project.description || "No description provided yet."}
      </p>

      {project.tags && project.tags.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {project.tags.slice(0, 4).map((tag) => (
            <span key={`${project._id}-${tag}`} className="rounded-full border border-border px-2 py-1 text-xs text-text-muted">
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href={`/labs/${project._id}`}
          className="rounded-full bg-accent px-4 py-2 font-label text-xs uppercase tracking-[0.15em] text-[#111]"
        >
          View Details
        </Link>

        {project.demoUrl ? (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-border px-4 py-2 font-label text-xs uppercase tracking-[0.15em] text-text-muted hover:bg-surface-2"
          >
            Live Demo
          </a>
        ) : null}
      </div>
    </article>
  );
}
