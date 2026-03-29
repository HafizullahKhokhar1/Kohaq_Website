import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connectToDatabase } from "@/lib/db/mongoose";
import Project from "@/lib/db/models/Project";

interface ProjectDetailProps {
  params: Promise<{ projectId: string }>;
}

interface ProjectDetail {
  _id: string;
  title: string;
  description?: string;
  demoUrl?: string;
  githubUrl?: string;
  youtubeVideoId?: string;
  tags?: string[];
  resources?: Array<{ name?: string; url?: string }>;
  isFeatured?: boolean;
  createdAt?: string;
}

async function getProject(projectId: string) {
  await connectToDatabase();
  const project = await Project.findById(projectId).lean();

  if (!project) {
    return null;
  }

  return {
    ...project,
    _id: String(project._id),
  } as ProjectDetail;
}

export async function generateMetadata({ params }: ProjectDetailProps): Promise<Metadata> {
  const { projectId } = await params;
  const project = await getProject(projectId);

  if (!project) {
    return { title: "Project Not Found - KOHAQ Labs" };
  }

  return {
    title: `${project.title} - KOHAQ Labs`,
    description: project.description || `Explore ${project.title} in KOHAQ Labs`,
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailProps) {
  const { projectId } = await params;
  const project = await getProject(projectId);

  if (!project) {
    notFound();
  }

  const projectDate = project.createdAt
    ? new Date(project.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <main className="min-h-screen space-y-10 py-12">
      <section className="mx-auto max-w-4xl space-y-4 px-6">
        <Link href="/labs" className="font-label text-xs uppercase tracking-[0.15em] text-text-muted hover:text-text">
          Back to Labs
        </Link>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {project.isFeatured ? (
              <span className="rounded-full bg-accent px-2 py-1 font-label text-[10px] uppercase tracking-[0.15em] text-[#111]">
                Featured Project
              </span>
            ) : null}
            {projectDate ? (
              <span className="rounded-full border border-border px-2 py-1 text-xs text-text-muted">{projectDate}</span>
            ) : null}
          </div>

          <h1 className="font-heading text-4xl font-bold text-primary dark:text-white">{project.title}</h1>
          <p className="text-lg text-text-muted">{project.description || "No project description available."}</p>
        </div>

        {project.tags && project.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={`${project._id}-tag-${tag}`} className="rounded-full border border-border px-2 py-1 text-xs text-text-muted">
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </section>

      <section className="mx-auto grid max-w-4xl gap-6 px-6 md:grid-cols-3">
        <article className="rounded-xl border border-border bg-surface p-5 md:col-span-2">
          <h2 className="font-heading text-2xl text-primary dark:text-white">Overview</h2>
          <p className="mt-3 text-text-muted">
            {project.description || "Project details and documentation will be published here soon."}
          </p>

          {project.youtubeVideoId ? (
            <div className="mt-5 overflow-hidden rounded-lg border border-border">
              <iframe
                src={`https://www.youtube.com/embed/${project.youtubeVideoId}`}
                title={`${project.title} demo video`}
                className="aspect-video w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : null}
        </article>

        <aside className="space-y-4">
          <article className="rounded-xl border border-border bg-surface p-5">
            <h3 className="font-heading text-lg text-primary dark:text-white">Links</h3>
            <div className="mt-3 flex flex-col gap-2">
              {project.demoUrl ? (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-accent px-4 py-2 text-center font-label text-xs uppercase tracking-[0.15em] text-[#111]"
                >
                  Live Demo
                </a>
              ) : null}

              {project.githubUrl ? (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-border px-4 py-2 text-center font-label text-xs uppercase tracking-[0.15em] text-text-muted hover:bg-surface-2"
                >
                  GitHub Repo
                </a>
              ) : null}
            </div>
          </article>

          {project.resources && project.resources.length > 0 ? (
            <article className="rounded-xl border border-border bg-surface p-5">
              <h3 className="font-heading text-lg text-primary dark:text-white">Resources</h3>
              <ul className="mt-3 space-y-2">
                {project.resources.map((resource, index) => (
                  <li key={`${project._id}-resource-${index}`}>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-text-muted underline-offset-4 hover:text-text hover:underline"
                    >
                      {resource.name || resource.url}
                    </a>
                  </li>
                ))}
              </ul>
            </article>
          ) : null}
        </aside>
      </section>
    </main>
  );
}
