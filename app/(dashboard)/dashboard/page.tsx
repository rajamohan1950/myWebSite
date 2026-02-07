import Link from "next/link";
import { MediumSync } from "./MediumSync";

export default function Dashboard() {
  return (
    <main className="mx-auto max-w-[var(--container)] px-[var(--space-page-x)] py-[var(--space-page-y)]">
      <div className="card max-w-2xl rounded-2xl p-8 sm:p-10">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          <span className="text-accent">Dashboard</span>
        </h1>
        <p className="mt-2 text-muted">
          Manage your content, posts, and agents from here. (Auth and more
          sections will be added later.)
        </p>

        <ul className="mt-10 list-none space-y-1 rounded-xl border border-[var(--card-border)] bg-card p-2 shadow-sm" role="list">
          <li>
            <Link
              href="/dashboard"
              aria-current="page"
              className="block rounded-lg bg-[var(--tab-active-bg)] px-4 py-3 text-sm font-semibold text-[var(--tab-active-text)] focus-visible:outline-offset-2"
            >
              Overview (current)
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/posts"
              className="block rounded-lg px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted/10 focus-visible:outline-offset-2"
            >
              Posts / CMS
            </Link>
          </li>
          <li>
            <span className="block rounded-lg px-4 py-3 text-muted" aria-disabled>
              Agent (coming soon)
            </span>
          </li>
        </ul>

        <MediumSync />
      </div>
    </main>
  );
}
