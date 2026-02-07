"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/profile", label: "Profile" },
  { href: "/blog", label: "Blog" },
  { href: "/products", label: "Products" },
  { href: "/linkedin", label: "LinkedIn" },
  { href: "/video-resume", label: "Video Resume" },
  { href: "/book-a-call", label: "Book a Call" },
  { href: "/resumes", label: "Resumes" },
];

const dashboardLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/posts", label: "Posts" },
];

export function Nav() {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = isDashboard ? dashboardLinks : publicLinks;

  return (
    <header
      className="sticky top-0 z-50 h-[var(--apple-nav-height)] border-b border-[var(--apple-nav-border)] bg-[var(--apple-nav-bg)] backdrop-blur-xl supports-[backdrop-filter]:bg-[var(--apple-nav-bg)]"
      role="banner"
    >
      <nav
        className="mx-auto flex h-full max-w-[var(--container-wide)] items-center justify-between gap-4 px-[var(--space-page-x)]"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="text-[17px] font-normal tracking-tight text-[var(--apple-text)] transition hover:opacity-80 focus-visible:rounded focus-visible:outline-offset-2"
        >
          Rajamohan Jabbala
        </Link>

        {/* Desktop: Apple-style 12px nav links */}
        <div className="hidden items-center gap-7 md:flex" role="tablist">
          {links.map(({ href, label }) => {
            const isActive =
              pathname === href ||
              (href !== "/" && href !== "/dashboard" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                role="tab"
                aria-selected={isActive}
                aria-current={isActive ? "page" : undefined}
                className={`apple-caption transition focus-visible:rounded focus-visible:outline-offset-2 ${
                  isActive
                    ? "text-[var(--apple-text)]"
                    : "text-[var(--apple-text-secondary)] hover:text-[var(--apple-text)]"
                }`}
              >
                {label}
              </Link>
            );
          })}
          {!isDashboard && (
            <Link
              href="/dashboard"
              className="apple-caption text-[var(--apple-text-secondary)] transition hover:text-[var(--apple-text)] focus-visible:rounded focus-visible:outline-offset-2"
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* Mobile: hamburger */}
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="flex h-9 w-9 items-center justify-center rounded text-[var(--apple-text)] hover:bg-black/5 focus-visible:outline-offset-2 md:hidden dark:hover:bg-white/10"
          aria-expanded={mobileOpen}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="border-t border-[var(--apple-nav-border)] bg-[var(--apple-nav-bg)] px-[var(--space-page-x)] py-3 backdrop-blur-xl md:hidden"
          role="dialog"
          aria-label="Mobile menu"
        >
          <ul className="flex flex-col">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`block border-b border-[var(--apple-border)] px-4 py-3.5 text-[17px] font-normal last:border-0 ${
                    pathname === href || (href !== "/" && pathname.startsWith(href))
                      ? "text-[var(--apple-text)]"
                      : "text-[var(--apple-text-secondary)]"
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
            {!isDashboard && (
              <li>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="block border-b border-[var(--apple-border)] px-4 py-3.5 text-[17px] font-normal text-[var(--apple-text-secondary)] last:border-0"
                >
                  Dashboard
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
