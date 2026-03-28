const partners = ["Systems Limited", "10Pearls", "NETSOL", "Arbisoft", "Contour", "Tkxel"];

export function PartnerLogos() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-14 sm:pb-20">
      <h2 className="font-label text-xs uppercase tracking-[0.2em] text-text-muted">Trusted by Partners</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {partners.map((name) => (
          <div key={name} className="flex h-14 items-center justify-center rounded-full border border-border bg-surface text-xs text-text-muted">
            {name}
          </div>
        ))}
      </div>
    </section>
  );
}

