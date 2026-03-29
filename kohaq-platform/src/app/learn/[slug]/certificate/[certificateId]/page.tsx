import Link from "next/link";

interface CertificatePayload {
  success: boolean;
  data?: {
    certificateId: string;
    issuedAt: string;
    learnerName: string;
    courseName: string;
    courseSlug: string;
  };
}

async function getCertificateData(certificateId: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/certificates/${certificateId}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as CertificatePayload;
    return payload.data ?? null;
  } catch {
    return null;
  }
}

export default async function CertificateVerificationPage({
  params,
}: {
  params: { slug: string; certificateId: string };
}) {
  const cert = await getCertificateData(params.certificateId);

  if (!cert) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="font-heading text-3xl text-primary">Certificate Not Found</h1>
        <p className="mt-3 text-text-muted">This certificate could not be verified. Please check the link and try again.</p>
      </main>
    );
  }

  const issuedDate = new Date(cert.issuedAt);
  const formattedDate = issuedDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <section className="rounded-2xl border border-border bg-surface p-8 shadow-lg sm:p-12">
        <p className="text-center font-label text-xs uppercase tracking-[0.15em] text-text-muted">Certificate of Completion</p>

        <h1 className="mt-8 text-center font-heading text-4xl text-primary dark:text-secondary">KOHAQ</h1>

        <div className="mt-8 space-y-6 border-t border-b border-border py-8">
          <div className="text-center">
            <p className="text-sm text-text-muted">In recognition of successfully completing</p>
            <p className="mt-2 font-heading text-2xl text-primary dark:text-white">{cert.courseName}</p>
          </div>

          <div className="text-center">
            <p className="text-sm text-text-muted">This certifies that</p>
            <p className="mt-2 font-heading text-2xl text-primary dark:text-white">{cert.learnerName}</p>
          </div>

          <div className="text-center">
            <p className="text-sm text-text-muted">Has demonstrated the skills and knowledge required to complete this course</p>
            <p className="mt-4 text-xs text-text-muted">Issued: {formattedDate}</p>
            <p className="mt-2 font-mono text-xs text-text-muted">Certificate ID: {cert.certificateId}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 text-center sm:flex-row sm:justify-center">
          <Link href={`/learn/${cert.courseSlug}`} className="flex-1 rounded-full border border-accent px-4 py-2 font-label text-xs uppercase tracking-[0.15em] text-accent transition hover:bg-accent hover:text-[#111]">
            View Course
          </Link>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex-1 rounded-full bg-accent px-4 py-2 font-label text-xs uppercase tracking-[0.15em] text-[#111] transition hover:shadow-lg"
          >
            Print Certificate
          </button>
        </div>
      </section>

      <p className="mt-8 text-center text-sm text-text-muted">
        Verify this certificate at{" "}
        <code className="rounded border border-border bg-surface-2 px-2 py-1 text-xs font-mono">{cert.certificateId}</code>
      </p>
    </main>
  );
}
