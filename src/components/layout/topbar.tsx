"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search } from "lucide-react";
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

export function Topbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
            aria-label="Toggle navigation"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
          <div className="md:hidden">
            <p className="text-base font-semibold">StudyOS</p>
          </div>
          <div className="hidden md:block">
            <p className="text-sm text-muted-foreground">
              A calm, focused home for student learning.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-sm text-muted-foreground sm:flex">
            <Search className="h-4 w-4" aria-hidden="true" />
            <span>Search courses, groups, notes</span>
          </div>
          <span className="rounded-full bg-primary/12 px-3 py-1 text-xs font-medium text-primary">
            MVP Ground Stage
          </span>
        </div>
      </div>

      {open ? (
        <nav aria-label="Mobile" className="border-t border-border px-4 py-3 md:hidden">
          <ul className="grid grid-cols-2 gap-2">
            {mobileNav.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary/12 text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
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
