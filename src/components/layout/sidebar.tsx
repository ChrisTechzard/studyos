"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Brain,
  CalendarDays,
  LayoutDashboard,
  Search,
  UserRound,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: LayoutDashboard },
  { href: "/study", label: "Study", icon: BookOpen },
  { href: "/groups", label: "Groups", icon: Users },
  { href: "/search", label: "Search", icon: Search },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/ai", label: "AI", icon: Brain },
  { href: "/profile", label: "Profile", icon: UserRound },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden border-r border-border bg-surface/80 md:flex md:flex-col">
      <div className="px-6 py-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
            S
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight">StudyOS</p>
            <p className="text-xs text-muted-foreground">Student learning OS</p>
          </div>
        </Link>
      </div>

      <nav aria-label="Primary" className="flex-1 px-3">
        <ul className="space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active
                      ? "bg-primary/12 text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-border px-4 py-4">
        <div className="rounded-xl bg-muted/70 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Ground Stage
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Foundation scaffold. Core modules are mapped and ready for implementation.
          </p>
        </div>
      </div>
    </aside>
  );
}
