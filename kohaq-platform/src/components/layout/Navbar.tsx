import Link from "next/link";
import Image from "next/image";
import { MobileNav } from "@/components/layout/MobileNav";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

const NAV_LINKS = [
  { href: "/learn", label: "Learn" },
  { href: "/careers", label: "Careers" },
  { href: "/labs", label: "Labs" },
  { href: "/media", label: "Media" },
  { href: "/community", label: "Community" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/images/logo-dark.png" alt="Kohaq" width={120} height={32} className="h-8 w-auto dark:hidden" />
          <Image src="/images/logo-white.png" alt="Kohaq" width={120} height={32} className="hidden h-8 w-auto dark:block" />
          <div className="hidden sm:block">
            <p className="font-heading text-lg text-primary dark:text-secondary">KOHAQ</p>
            <p className="font-label text-[10px] uppercase tracking-[0.15em] text-text-muted">New Tomorrow</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 font-label text-xs uppercase tracking-[0.15em] text-text-muted transition hover:bg-surface-2 hover:text-text"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

