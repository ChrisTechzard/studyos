"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Brain,
  CalendarDays,
  GraduationCap,
  LayoutDashboard,
  Search,
  Settings,
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
  { href: "/ai", label: "AI Companion", icon: Brain },
  { href: "/profile", label: "Profile", icon: UserRound },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden border-r border-border bg-surface/40 backdrop-blur-xl md:flex md:flex-col">
      <div className="px-6 py-7">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/25 transition-transform duration-200 group-hover:scale-105">
            <GraduationCap className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-lg font-bold tracking-tight text-foreground">StudyOS</p>
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">Learning OS</p>
          </div>
        </Link>
      </div>

      <nav aria-label="Primary" className="flex-1 px-3">
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70">Menu</p>
        <ul className="space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active
                      ? "bg-primary/15 text-primary shadow-sm shadow-primary/5"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  )}
                >
                  <Icon className={cn("h-[18px] w-[18px] transition-colors", active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} aria-hidden="true" />
                  <span>{label}</span>
                  {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="px-3 pb-4">
        <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-accent/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">Early Access</p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            Foundation scaffold ready. Core modules coming next.
          </p>
          <div className="mt-3 h-1.5 rounded-full bg-muted">
            <div className="h-1.5 w-1/4 rounded-full bg-gradient-to-r from-primary to-accent" aria-hidden="true" />
          </div>
          <p className="mt-1.5 text-[11px] text-muted-foreground">Phase 1 of 8</p>
        </div>
        <button
          type="button"
          className="mt-3 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Settings className="h-[18px] w-[18px]" aria-hidden="true" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}
