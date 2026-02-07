import Link from "next/link";
import { MediumSync } from "./MediumSync";

export default function Dashboard() {
  return (
    <main className="w-full px-[var(--space-page-x)] py-[var(--space-page-y)]">
      <div className="mx-auto w-full max-w-[var(--container)]">
      <div className="rounded-[var(--radius-lg)] border border-[var(--apple-border)] bg-[var(--apple-bg)] p-8 sm:p-10 shadow-sm">
        <h1 className="text-[clamp(1.5rem,4vw,2rem)] font-semibold tracking-tight text-[var(--apple-text)]">
          Dashboard
        </h1>
        <p className="mt-2 text-[var(--apple-text-secondary)]">
          Manage your content, posts, and agents from here. (Auth and more
          sections will be added later.)
        </p>

        <ul className="mt-10 list-none space-y-1 rounded-[var(--radius)] border border-[var(--apple-border)] bg-[var(--apple-bg-secondary)] p-2" role="list">
          <li>
            <Link
              href="/dashboard"
              aria-current="page"
              className="block rounded-[var(--radius)] bg-[var(--apple-blue)] px-4 py-3 text-sm font-normal text-white focus-visible:outline-offset-2"
            >
              Overview (current)
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/posts"
              className="block rounded-[var(--radius)] px-4 py-3 text-sm font-normal text-[var(--apple-text)] transition hover:bg-[var(--apple-bg-tertiary)] focus-visible:outline-offset-2"
            >
              Posts / CMS
            </Link>
          </li>
          <li>
            <span className="block rounded-[var(--radius)] px-4 py-3 text-[var(--apple-text-secondary)]" aria-disabled>
              Agent (coming soon)
            </span>
          </li>
        </ul>

        <MediumSync />
      </div>
      </div>
    </main>
  );
}
