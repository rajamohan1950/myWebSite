import Link from "next/link";
import { getRepos, type Repo } from "@/lib/github";

export const dynamic = "force-dynamic";

/** Gradient from repo name for card header (consistent per repo). */
function cardGradient(name: string): string {
  let n = 0;
  for (let i = 0; i < name.length; i++) n = (n * 31 + name.charCodeAt(i)) >>> 0;
  const h = n % 360;
  return `linear-gradient(135deg, hsl(${h}, 45%, 28%) 0%, hsl(${(h + 40) % 360}, 38%, 22%) 100%)`;
}

export default async function ProductsPage() {
  let repos: Repo[] = [];
  try {
    repos = await getRepos();
  } catch {
    repos = [];
  }

  const summary = (r: Repo) => (r.description && r.description.trim()) || "No description.";
  const deployed = repos.filter((r) => r.homepage && r.homepage.trim());

  return (
    <main className="w-full px-[var(--space-page-x)] py-[var(--space-page-y)]">
      <div className="mx-auto w-full max-w-[var(--container-wide)]">
        <h1 className="text-[clamp(1.75rem,4vw,2.25rem)] font-semibold tracking-tight text-[var(--apple-text)] mb-2">
          Projects
        </h1>
        <p className="text-[var(--apple-text-secondary)] mb-6 max-w-2xl">
          Open-source and personal projects from my GitHub. Each card has a short summary from the repo; click through for the full README. Deployed projects are linked below and on each card.
        </p>

        {deployed.length > 0 && (
          <section className="mb-10 rounded-[var(--radius-lg)] border border-[var(--apple-border)] bg-[var(--apple-bg)]/95 p-6">
            <h2 className="text-lg font-semibold text-[var(--apple-text)] mb-3">Deployed projects — live URLs</h2>
            <ul className="flex flex-wrap gap-3 list-none">
              {deployed.map((repo) => (
                <li key={repo.name}>
                  <a
                    href={repo.homepage!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--apple-border)] bg-[var(--apple-bg-secondary)] px-3 py-2 text-sm font-medium text-[var(--apple-text)] hover:border-[var(--apple-link)] hover:text-[var(--apple-link)] transition"
                  >
                    <span className="truncate max-w-[180px]">{repo.name}</span>
                    <span aria-hidden>→</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {repos.length === 0 ? (
          <p className="text-[var(--apple-text-secondary)]">No repositories found. Check GITHUB_USERNAME in env.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {repos.map((repo) => (
              <div
                key={repo.name}
                className="group overflow-hidden rounded-[var(--radius-lg)] border border-[var(--apple-border)] bg-[var(--apple-bg)] shadow-md transition hover:border-[var(--apple-link)] hover:shadow-lg"
              >
                <Link
                  href={`/products/${encodeURIComponent(repo.name)}`}
                  className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--apple-link)]"
                >
                  <div
                    className="h-32 w-full shrink-0"
                    style={{ background: cardGradient(repo.name) }}
                    aria-hidden
                  />
                  <div className="p-5">
                    <h2 className="font-semibold text-[var(--apple-text)] group-hover:text-[var(--apple-link)]">
                      {repo.name}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--apple-text-secondary)] line-clamp-4">
                      {summary(repo)}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="text-xs font-medium text-[var(--apple-link)] group-hover:underline">
                        Read README →
                      </span>
                    </div>
                  </div>
                </Link>
                {repo.homepage && (
                  <div className="px-5 pb-5 -mt-2">
                    <a
                      href={repo.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg bg-[var(--apple-blue)] px-2.5 py-1.5 text-xs font-medium text-white hover:opacity-90"
                    >
                      Live →
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
