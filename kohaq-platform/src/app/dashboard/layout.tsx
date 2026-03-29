import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex min-h-screen bg-bg-subtle">
      <DashboardSidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-4 sm:px-6">
          <h1 className="font-heading text-xl text-primary">Dashboard</h1>
          <ThemeToggle />
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </section>
  );
}

