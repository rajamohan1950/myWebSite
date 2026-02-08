"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShareTemplateButton } from "@/components/ShareTemplateButton";

type TemplateItem = {
  id: number;
  slug: string;
  displayName: string;
  mimeType: string | null;
  uploadedAt: string;
  viewCount: number;
  downloadCount: number;
  shareCount: number;
};

export default function TemplatesPage() {
  const [list, setList] = useState<TemplateItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/templates")
      .then((r) => r.json())
      .then((data) => setList(Array.isArray(data) ? data : []))
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="w-full px-[var(--space-page-x)] py-[var(--space-page-y)]">
      <div className="mx-auto w-full max-w-[var(--container-wide)]">
        <h1 className="text-[clamp(1.75rem,4vw,2.25rem)] font-semibold tracking-tight text-[var(--apple-text)] mb-2">
          Templates
        </h1>
        <p className="text-[var(--apple-text-secondary)] mb-6 max-w-2xl">
          Download or view document templates (PDF, Word, HTML). Each template has a unique URL for sharing.
        </p>

        {loading ? (
          <p className="text-[var(--apple-text-secondary)]">Loading…</p>
        ) : list.length === 0 ? (
          <p className="text-[var(--apple-text-secondary)]">No templates yet.</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 list-none">
            {list.map((item) => (
              <li
                key={item.id}
                className="rounded-[var(--radius-lg)] border border-[var(--apple-border)] bg-[var(--apple-bg)] p-5 shadow-sm transition hover:border-[var(--apple-link)]"
              >
                <h2 className="font-semibold text-[var(--apple-text)] truncate" title={item.displayName}>
                  {item.displayName}
                </h2>
                <p className="mt-1 text-xs text-[var(--apple-text-secondary)]">
                  {new Date(item.uploadedAt).toLocaleDateString()} · /templates/{item.slug}
                </p>
                <p className="mt-2 text-xs text-[var(--apple-text-secondary)]">
                  Viewed {item.viewCount} · Downloaded {item.downloadCount} · Shared {item.shareCount}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={`/api/templates/${encodeURIComponent(item.slug)}?view=1`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex rounded-lg bg-[var(--apple-blue)] px-3 py-2 text-sm font-medium text-white hover:opacity-90"
                  >
                    View
                  </a>
                  <a
                    href={`/api/templates/${encodeURIComponent(item.slug)}`}
                    download={item.displayName}
                    className="inline-flex rounded-lg border border-[var(--apple-border)] bg-[var(--apple-bg-secondary)] px-3 py-2 text-sm font-medium text-[var(--apple-text)] hover:border-[var(--apple-link)]"
                  >
                    Download
                  </a>
                  <ShareTemplateButton
                    slug={item.slug}
                    className="inline-flex rounded-lg border border-[var(--apple-border)] px-3 py-2 text-sm font-medium text-[var(--apple-text)] hover:border-[var(--apple-link)]"
                  >
                    Share
                  </ShareTemplateButton>
                  <Link
                    href={`/templates/${encodeURIComponent(item.slug)}`}
                    className="inline-flex rounded-lg border border-[var(--apple-border)] px-3 py-2 text-sm font-medium text-[var(--apple-link)] hover:underline"
                  >
                    Page →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
