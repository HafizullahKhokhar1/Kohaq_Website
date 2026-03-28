import Link from "next/link";

const DASHBOARD_LINKS = [
  { href: "/dashboard/student", label: "Student" },
  { href: "/dashboard/intern", label: "Intern" },
  { href: "/dashboard/partner", label: "Partner" },
  { href: "/dashboard/admin", label: "Admin" },
];

export function DashboardSidebar() {
  return (
    <aside className="hidden w-72 border-r border-border bg-surface p-5 lg:block">
      <p className="font-heading text-xl text-primary dark:text-secondary">KOHAQ</p>
      <p className="mt-1 font-label text-[10px] uppercase tracking-[0.15em] text-text-muted">Dashboard</p>
      <nav className="mt-6 space-y-2">
        {DASHBOARD_LINKS.map((item) => (
          <Link key={item.href} href={item.href} className="block rounded-xl px-3 py-2 text-sm transition hover:bg-surface-2 hover:text-accent">
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

