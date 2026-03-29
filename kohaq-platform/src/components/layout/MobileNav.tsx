"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/learn", label: "Learn" },
  { href: "/careers", label: "Careers" },
  { href: "/labs", label: "Labs" },
  { href: "/community", label: "Community" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border"
        aria-label="Toggle menu"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open ? (
        <div className="absolute inset-x-0 top-16 z-50 border-y border-border bg-surface/95 px-6 py-4 backdrop-blur">
          <nav className="flex flex-col gap-3">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 font-label uppercase tracking-[0.15em] hover:bg-surface-2"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2">
              <ThemeToggle />
            </div>
          </nav>
        </div>
      ) : null}
    </div>
  );
}

