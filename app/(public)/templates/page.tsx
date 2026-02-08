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
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const loadList = () => {
    setLoading(true);
    fetch("/api/templates")
      .then((r) => r.json())
      .then((data) => setList(Array.isArray(data) ? data : []))
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadList();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadFiles.length === 0) return;
    setUploadError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      for (const file of uploadFiles) {
        formData.append("file", file);
      }
      const res = await fetch("/api/templates", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error ?? "Upload failed");
        return;
      }
      setUploadFiles([]);
      loadList();
    } catch {
      setUploadError("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const q = search.trim().toLowerCase();
  const filtered =
    q === ""
      ? list
      : list.filter(
          (item) =>
            item.displayName.toLowerCase().includes(q) || item.slug.toLowerCase().includes(q)
        );

  return (
    <main className="w-full px-[var(--space-page-x)] py-[var(--space-page-y)]">
      <div className="mx-auto w-full max-w-[var(--container-wide)]">
        <h1 className="text-[clamp(1.75rem,4vw,2.25rem)] font-semibold tracking-tight text-[var(--apple-text)] mb-2">
          Templates
        </h1>
        <p className="text-[var(--apple-text-secondary)] mb-6 max-w-2xl">
          Freely available document templates (PDF, Word, HTML). Add, view, download, or share — no login.
        </p>

        {/* Add — above */}
        <section className="mb-8 rounded-[var(--radius-lg)] border border-[var(--apple-border)] bg-[var(--apple-bg)] p-5">
          <h2 className="text-base font-semibold text-[var(--apple-text)] mb-3">Add template</h2>
          <form onSubmit={handleUpload} className="flex flex-wrap items-end gap-3">
            {uploadError && (
              <p className="w-full rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
                {uploadError}
              </p>
            )}
            <div className="min-w-0 flex-1">
              <label htmlFor="templates-file" className="block text-sm font-medium text-[var(--apple-text)]">
                PDF, Word (.doc, .docx), or HTML
              </label>
              <input
                id="templates-file"
                type="file"
                accept=".pdf,.doc,.docx,.html,.htm"
                multiple
                onChange={(e) => {
                  const f = e.target.files;
                  setUploadFiles(f ? Array.from(f) : []);
                  setUploadError(null);
                }}
                className="mt-1 w-full rounded-[var(--radius)] border border-[var(--apple-border)] bg-[var(--apple-bg)] px-3 py-2 text-sm text-[var(--apple-text)] file:mr-3 file:rounded file:border-0 file:bg-[var(--accent-light)] file:px-3 file:py-1 file:text-[var(--apple-link)]"
              />
              {uploadFiles.length > 0 && (
                <p className="mt-1 text-xs text-[var(--apple-text-secondary)]">
                  {uploadFiles.length} file{uploadFiles.length !== 1 ? "s" : ""} selected
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={uploadFiles.length === 0 || uploading}
              className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-50"
            >
              {uploading ? "Adding…" : "Add"}
            </button>
          </form>
        </section>

        {/* Search */}
        <div className="mb-6">
          <label htmlFor="templates-search" className="sr-only">
            Search templates
          </label>
          <input
            id="templates-search"
            type="search"
            placeholder="Search by name or slug…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md rounded-[var(--radius)] border border-[var(--apple-border)] bg-[var(--apple-bg)] px-4 py-2.5 text-[var(--apple-text)] placeholder:text-[var(--apple-text-secondary)] focus:border-[var(--apple-link)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-light)]"
            aria-label="Search templates"
          />
        </div>

        {/* All templates below */}
        <h2 className="text-lg font-semibold text-[var(--apple-text)] mb-3">All templates</h2>
        {loading ? (
          <p className="text-[var(--apple-text-secondary)]">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="text-[var(--apple-text-secondary)]">
            {list.length === 0 ? "No templates yet. Add one above." : "No templates match your search."}
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 list-none">
            {filtered.map((item) => (
              <li
                key={item.id}
                className="rounded-[var(--radius-lg)] border border-[var(--apple-border)] bg-[var(--apple-bg)] p-5 shadow-sm transition hover:border-[var(--apple-link)]"
              >
                <h3 className="font-semibold text-[var(--apple-text)] truncate" title={item.displayName}>
                  {item.displayName}
                </h3>
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
