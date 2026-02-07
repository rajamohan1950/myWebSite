"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/profile", label: "Profile" },
  { href: "/video-resume", label: "Video Resume" },
  { href: "/book-a-call", label: "Book a Call" },
];

const dashboardLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/posts", label: "Posts" },
];

export function Nav() {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <header
      className="sticky top-0 z-50 border-b border-[var(--nav-border)] bg-[var(--nav-bg)] shadow-[var(--nav-shadow)] backdrop-blur-md"
      role="banner"
    >
      <nav
        className="mx-auto flex max-w-[var(--container)] items-center justify-between gap-4 px-[var(--space-page-x)] py-3"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-foreground transition hover:opacity-90 focus-visible:rounded-md"
        >
          Rajamohan Jabbala
        </Link>

        {/* Tab bar */}
        <div
          className="flex items-center gap-1 rounded-xl bg-[var(--tab-hover-bg)] p-1"
          role="tablist"
        >
          {(isDashboard ? dashboardLinks : publicLinks).map(({ href, label }) => {
            const isActive =
              pathname === href ||
              (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                role="tab"
                aria-selected={isActive}
                aria-current={isActive ? "page" : undefined}
                className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-offset-2 ${
                  isActive
                    ? "bg-[var(--tab-active-bg)] text-[var(--tab-active-text)] shadow-sm"
                    : "text-[var(--tab-inactive)] hover:bg-white/50 hover:text-foreground dark:hover:bg-white/10"
                }`}
              >
                {label}
              </Link>
            );
          })}
          {!isDashboard && (
            <Link
              href="/dashboard"
              role="tab"
              className="rounded-lg px-4 py-2.5 text-sm font-semibold text-[var(--tab-inactive)] transition hover:bg-white/50 hover:text-foreground focus-visible:outline-offset-2 dark:hover:bg-white/10"
            >
              Dashboard
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
