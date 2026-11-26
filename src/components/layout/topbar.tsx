"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const mobileNav = [
  { href: "/", label: "Home" },
  { href: "/study", label: "Study" },
  { href: "/groups", label: "Groups" },
  { href: "/search", label: "Search" },
  { href: "/calendar", label: "Calendar" },
  { href: "/ai", label: "AI" },
  { href: "/profile", label: "Profile" },
] as const;

type TopbarProps = {
  readonly userInitial: string;
};

export function Topbar({ userInitial }: TopbarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface/50 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
          <div className="md:hidden">
            <p className="text-base font-bold tracking-tight">StudyOS</p>
          </div>
          <div className="hidden items-center gap-2 rounded-xl border border-border bg-surface/50 px-3 py-2 text-sm text-muted-foreground md:flex md:w-72 lg:w-96">
            <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Search courses, groups, notes...</span>
            <kbd className="ml-auto hidden rounded-md border border-border bg-muted/50 px-1.5 py-0.5 text-[10px] font-medium lg:inline-block">⌘K</kbd>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/profile"
            aria-label="Open profile"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-sm font-bold text-white shadow-md shadow-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {userInitial}
          </Link>
        </div>
      </div>

      {open ? (
        <nav aria-label="Mobile" className="border-t border-border px-4 py-3 md:hidden">
          <ul className="grid grid-cols-2 gap-2">
            {mobileNav.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      active ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
