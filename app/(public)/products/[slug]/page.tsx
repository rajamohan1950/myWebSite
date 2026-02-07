import Link from "next/link";
import { notFound } from "next/navigation";
import { getRepo, getReadme } from "@/lib/github";
import { RepoReadme } from "./RepoReadme";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const repo = await getRepo(slug);
  if (!repo) return { title: "Project not found" };
  return {
    title: `${repo.name} | Rajamohan Jabbala`,
    description: repo.description ?? undefined,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const repo = await getRepo(slug);
  if (!repo) notFound();

  const readme = await getReadme(slug);

  return (
    <main className="w-full px-[var(--space-page-x)] py-[var(--space-page-y)]">
      <div className="mx-auto w-full max-w-[var(--container)]">
      <Link href="/products" className="text-sm link-apple mb-6 inline-block">
        ← All projects
      </Link>

      <article className="rounded-[var(--radius-lg)] border border-[var(--apple-border)] bg-[var(--apple-bg)] p-8 sm:p-10">
        <h1 className="text-[clamp(1.75rem,4vw,2.25rem)] font-semibold tracking-tight text-[var(--apple-text)]">
          {repo.name}
        </h1>
        {repo.description && (
          <p className="mt-2 text-lg text-[var(--apple-text-secondary)]">
            {repo.description}
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex btn-primary"
          >
            View on GitHub →
          </a>
          {repo.homepage && (
            <a
              href={repo.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex btn-secondary"
            >
              View live →
            </a>
          )}
        </div>

        {readme && (
          <div className="mt-10 border-t border-[var(--apple-border)] pt-10">
            <h2 className="text-lg font-semibold text-[var(--apple-text)] mb-4">README</h2>
            <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:text-[var(--apple-text)] prose-p:text-[var(--apple-text)] prose-a:text-[var(--apple-link)]">
              <RepoReadme content={readme} />
            </div>
          </div>
        )}

        {!readme && (
          <p className="mt-10 border-t border-[var(--apple-border)] pt-10 text-[var(--apple-text-secondary)]">
            No README for this repo.
          </p>
        )}
      </article>
      </div>
    </main>
  );
}
