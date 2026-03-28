import Link from "next/link";

export default function DashboardPage() {
  return (
    <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
      <h2 className="font-heading text-3xl text-primary">Welcome to KOHAQ Dashboard</h2>
      <p className="mt-2 text-text-muted">Role-based routes are scaffolded and ready for auth wiring in Phase 3.</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link href="/dashboard/student" className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-surface-2">
          Student
        </Link>
        <Link href="/dashboard/intern" className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-surface-2">
          Intern
        </Link>
        <Link href="/dashboard/partner" className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-surface-2">
          Partner
        </Link>
        <Link href="/dashboard/admin" className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-surface-2">
          Admin
        </Link>
      </div>
    </section>
  );
}

