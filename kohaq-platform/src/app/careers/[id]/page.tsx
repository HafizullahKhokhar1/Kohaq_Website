import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { JobApplyClient } from "@/components/careers/JobApplyClient";
import { connectToDatabase } from "@/lib/db/mongoose";
import Job from "@/lib/db/models/Job";

interface JobDetailsParams {
  id: string;
}

interface CompanyDoc {
  name: string;
  logo?: string;
}

interface JobDoc {
  _id: unknown;
  title: string;
  description?: string;
  location?: string;
  type?: string;
  domain?: string;
  salary?: { min?: number; max?: number };
  applicationDeadline?: string;
  requirements?: string[];
  benefits?: string[];
  company: CompanyDoc;
}

export async function generateMetadata({ params }: { params: Promise<JobDetailsParams> }): Promise<Metadata> {
  const { id } = await params;

  await connectToDatabase();
  const job = await Job.findById(id).lean();

  if (!job) {
    return {
      title: "Job Not Found - KOHAQ",
    };
  }

  const jobDoc = job as JobDoc;

  return {
    title: `${jobDoc.title} - KOHAQ Careers`,
    description: jobDoc.description || `Join KOHAQ as a ${jobDoc.title}`,
    openGraph: {
      title: `${jobDoc.title} - KOHAQ Careers`,
      description: jobDoc.description,
    },
  };
}

export default async function JobDetailPage({ params }: { params: Promise<JobDetailsParams> }) {
  const { id } = await params;

  await connectToDatabase();
  const job = await Job.findById(id).populate("company").lean();

  if (!job) {
    notFound();
  }

  const typedJob = job as JobDoc;
  const company = typedJob.company;

  return (
    <main className="min-h-screen space-y-12 py-12">
      {/* Header */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-3xl space-y-4 px-6 py-8">
          <div className="flex items-center gap-4">
            {company?.logo && (
              <Image
                src={company.logo}
                alt={company.name}
                className="h-12 w-12 rounded-lg object-cover"
                width={48}
                height={48}
              />
            )}
            <div>
              <p className="font-label text-xs uppercase tracking-[0.15em] text-text-muted">
                {company?.name}
              </p>
              <h1 className="font-heading text-3xl text-primary dark:text-white">
                {typedJob.title}
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-text-muted">
            {typedJob.location && <span>{typedJob.location}</span>}
            {typedJob.type && <span className="capitalize">{typedJob.type}</span>}
            {typedJob.domain && <span>{typedJob.domain}</span>}
            {typedJob.salary?.min && (
              <span>
                PKR {typedJob.salary.min}k - {typedJob.salary.max || typedJob.salary.min}k
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-3xl space-y-8 px-6">
        {typedJob.description && (
          <div className="space-y-3">
            <h2 className="font-heading text-xl text-primary dark:text-white">Description</h2>
            <p className="whitespace-pre-wrap text-text-muted">{typedJob.description}</p>
          </div>
        )}

        {typedJob.requirements && typedJob.requirements.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-heading text-xl text-primary dark:text-white">Requirements</h2>
            <ul className="space-y-2">
              {typedJob.requirements.map((req: string, idx: number) => (
                <li key={idx} className="flex gap-3 text-text-muted">
                  <span className="text-accent">•</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {typedJob.benefits && typedJob.benefits.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-heading text-xl text-primary dark:text-white">Benefits</h2>
            <ul className="space-y-2">
              {typedJob.benefits.map((benefit: string, idx: number) => (
                <li key={idx} className="flex gap-3 text-text-muted">
                  <span className="text-secondary">→</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {typedJob.applicationDeadline && (
          <div className="rounded-lg border border-border bg-surface p-4">
            <p className="text-sm text-text-muted">
              Applications deadline:{" "}
              <span className="font-semibold">
                {new Date(typedJob.applicationDeadline).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </p>
          </div>
        )}

        <JobApplyClient jobId={id} />
      </section>
    </main>
  );
}
