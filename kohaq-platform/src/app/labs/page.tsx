import type { Metadata } from "next";
import Link from "next/link";
import { ProjectCard, type LabProject } from "@/components/labs/ProjectCard";
import { ProjectFilters } from "@/components/labs/ProjectFilters";
import { connectToDatabase } from "@/lib/db/mongoose";
import Project from "@/lib/db/models/Project";

export const metadata: Metadata = {
  title: "Labs - KOHAQ",
  description: "Explore KOHAQ labs projects, experiments, and open-source builds.",
};

interface LabsPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    tag?: string;
    featured?: string;
  }>;
}

function getPagination(currentPage: number, totalPages: number) {
  const pages: number[] = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  return pages;
}

export default async function LabsPage({ searchParams }: LabsPageProps) {
  const resolved = await searchParams;

  const page = Math.max(1, Number(resolved.page ?? "1") || 1);
  const limit = Math.min(24, Math.max(1, Number(resolved.limit ?? "9") || 9));
  const search = (resolved.search ?? "").trim();
  const tag = (resolved.tag ?? "").trim();
  const featured = (resolved.featured ?? "").trim();

  const query: Record<string, unknown> = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (tag) {
    query.tags = tag;
  }

  if (featured === "true") {
    query.isFeatured = true;
  }

  if (featured === "false") {
    query.isFeatured = false;
  }

  await connectToDatabase();

  const [projectsRaw, total, tagsRaw] = await Promise.all([
    Project.find(query)
      .sort({ isFeatured: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Project.countDocuments(query),
    Project.distinct("tags"),
  ]);

  const projects = projectsRaw.map((project) => ({
    ...project,
    _id: String(project._id),
  })) as LabProject[];

  const tags = tagsRaw.filter((item): item is string => typeof item === "string");

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const pagination = getPagination(page, totalPages);

  return (
    <main className="min-h-screen space-y-10 py-12">
      <section className="mx-auto max-w-6xl space-y-4 px-6">
        <h1 className="font-heading text-4xl font-bold text-primary dark:text-white">KOHAQ Labs</h1>
        <p className="max-w-3xl text-lg text-text-muted">
          Explore experiments, prototypes, and student-built products from the KOHAQ ecosystem.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6">
        <div className="grid gap-6 lg:grid-cols-4">
          <ProjectFilters tags={tags} />

          <div className="space-y-6 lg:col-span-3">
            {projects.length === 0 ? (
              <div className="rounded-xl border border-border bg-surface p-8 text-center">
                <p className="text-text-muted">No projects match your filters yet.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {projects.map((project) => (
                  <ProjectCard key={project._id} project={project} />
                ))}
              </div>
            )}

            {totalPages > 1 ? (
              <nav className="flex flex-wrap items-center gap-2" aria-label="Labs pagination">
                {pagination.map((pageNumber) => {
                  const params = new URLSearchParams();
                  params.set("page", String(pageNumber));
                  params.set("limit", String(limit));
                  if (search) params.set("search", search);
                  if (tag) params.set("tag", tag);
                  if (featured) params.set("featured", featured);

                  return (
                    <Link
                      key={`labs-page-${pageNumber}`}
                      href={`/labs?${params.toString()}`}
                      className={`rounded-full px-3 py-1 text-xs ${
                        pageNumber === page
                          ? "bg-accent text-[#111]"
                          : "border border-border text-text-muted hover:border-accent"
                      }`}
                    >
                      {pageNumber}
                    </Link>
                  );
                })}
              </nav>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}

