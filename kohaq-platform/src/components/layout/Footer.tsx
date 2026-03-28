import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-2">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-3">
        <div>
          <h3 className="font-heading text-xl text-primary dark:text-secondary">KOHAQ</h3>
          <p className="mt-2 max-w-sm text-sm text-text-muted">
            Pakistan&apos;s premier EdTech and career ecosystem focused on real outcomes.
          </p>
        </div>
        <div>
          <h4 className="font-label text-xs uppercase tracking-[0.15em] text-text-muted">Explore</h4>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link href="/learn" className="hover:text-accent">Kohaq Learn</Link>
            <Link href="/careers" className="hover:text-accent">Kohaq Careers</Link>
            <Link href="/labs" className="hover:text-accent">Kohaq Labs</Link>
          </div>
        </div>
        <div>
          <h4 className="font-label text-xs uppercase tracking-[0.15em] text-text-muted">Company</h4>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link href="/about" className="hover:text-accent">About</Link>
            <Link href="/contact" className="hover:text-accent">Contact</Link>
            <Link href="/media" className="hover:text-accent">Media</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-border px-6 py-4 text-center text-xs text-text-muted">
        Copyright {new Date().getFullYear()} KOHAQ. All rights reserved.
      </div>
    </footer>
  );
}

