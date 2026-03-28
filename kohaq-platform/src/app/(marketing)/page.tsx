import Link from "next/link";

export default function MarketingHomePage() {
  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,140,0,0.18),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(27,38,59,0.18),transparent_40%)] dark:bg-[radial-gradient(circle_at_25%_20%,rgba(57,255,20,0.15),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(249,166,2,0.15),transparent_40%)]" />
      <section className="relative mx-auto max-w-7xl px-6 py-16 sm:py-24">
        <p className="font-label text-xs uppercase tracking-[0.2em] text-text-muted">New Tomorrow</p>
        <h1 className="mt-4 max-w-4xl font-heading text-4xl leading-tight text-primary dark:text-white sm:text-6xl">
          KOHAQ brings learning, careers, labs, and community into one growth platform.
        </h1>
        <p className="mt-6 max-w-2xl text-base text-text-muted sm:text-lg">
          Built for Pakistan&apos;s future talent with industry-grade pathways from skills to real opportunities.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/learn" className="rounded-full bg-accent px-6 py-3 font-label text-xs uppercase tracking-[0.15em] text-[#111] transition hover:shadow-lg">
            Start Learning
          </Link>
          <Link href="/careers" className="rounded-full border border-primary px-6 py-3 font-label text-xs uppercase tracking-[0.15em] text-primary transition hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-[#0d1b2a]">
            Explore Careers
          </Link>
        </div>
      </section>
    </main>
  );
}

