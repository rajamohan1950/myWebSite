import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { templates } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";

type Props = { params: Promise<{ slug: string }> };

export default async function TemplateSlugPage({ params }: Props) {
  const { slug } = await params;
  const [row] = await db
    .select()
    .from(templates)
    .where(eq(templates.slug, slug));

  if (!row) notFound();

  const viewUrl = `/api/templates/${encodeURIComponent(row.slug)}?view=1`;
  const downloadUrl = `/api/templates/${encodeURIComponent(row.slug)}`;

  return (
    <main className="w-full px-[var(--space-page-x)] py-[var(--space-page-y)]">
      <div className="mx-auto w-full max-w-[var(--container)]">
        <nav className="mb-6 text-sm text-[var(--apple-text-secondary)]">
          <Link href="/templates" className="hover:text-[var(--apple-link)]">
            ← Templates
          </Link>
        </nav>
        <h1 className="text-[clamp(1.5rem,4vw,2rem)] font-semibold tracking-tight text-[var(--apple-text)] mb-2">
          {row.displayName}
        </h1>
        <p className="text-sm text-[var(--apple-text-secondary)] mb-6">
          Unique URL: /templates/{row.slug}
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href={viewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-lg bg-[var(--apple-blue)] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            View in new tab
          </a>
          <a
            href={downloadUrl}
            download={row.displayName}
            className="inline-flex rounded-lg border border-[var(--apple-border)] bg-[var(--apple-bg-secondary)] px-4 py-2.5 text-sm font-medium text-[var(--apple-text)] hover:border-[var(--apple-link)]"
          >
            Download
          </a>
        </div>
      </div>
    </main>
  );
}
