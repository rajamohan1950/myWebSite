"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type TemplateItem = {
  id: number;
  slug: string;
  displayName: string;
  mimeType: string | null;
  uploadedAt: string;
};

export default function TemplatesPage() {
  const [list, setList] = useState<TemplateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/templates")
      .then((r) => r.json())
      .then((data) => setList(Array.isArray(data) ? data : []))
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  }, []);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      const res = await fetch("/api/resumes/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error ?? "Invalid password");
        return;
      }
      setAuthenticated(true);
      setPassword("");
    } catch {
      setAuthError("Request failed");
    }
  };

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
      const res = await fetch("/api/templates", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error ?? "Upload failed");
        return;
      }
      const added = data.added ?? [data];
      setList((prev) => [
        ...added.map((a: TemplateItem) => ({
          id: a.id,
          slug: a.slug,
          displayName: a.displayName,
          mimeType: null,
          uploadedAt: a.uploadedAt,
        })),
        ...prev,
      ]);
      setUploadFiles([]);
    } catch {
      setUploadError("Upload failed");
    } finally {
      setUploading(false);
    }
  };

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

        <section className="mt-12 rounded-[var(--radius-lg)] border border-[var(--apple-border)] bg-[var(--apple-bg)] p-6">
          <h2 className="text-lg font-semibold text-[var(--apple-text)] mb-2">Add templates</h2>
          <p className="text-sm text-[var(--apple-text-secondary)] mb-4">
            PDF, Word (.doc, .docx), and HTML only. Use the same password as Resumes to unlock uploads.
          </p>
          {!authenticated ? (
            <form onSubmit={handleUnlock} className="flex flex-wrap items-end gap-3">
              {authError && (
                <p className="w-full rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
                  {authError}
                </p>
              )}
              <div>
                <label htmlFor="templates-password" className="block text-sm font-medium text-[var(--apple-text)]">
                  Password
                </label>
                <input
                  id="templates-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 rounded-[var(--radius)] border border-[var(--apple-border)] bg-[var(--apple-bg)] px-3 py-2 text-[var(--apple-text)] w-48"
                  placeholder="Resumes password"
                />
              </div>
              <button type="submit" className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white">
                Unlock
              </button>
            </form>
          ) : (
            <form onSubmit={handleUpload} className="flex flex-wrap items-end gap-3">
              {uploadError && (
                <p className="w-full rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
                  {uploadError}
                </p>
              )}
              <div className="min-w-0 flex-1">
                <label htmlFor="templates-file" className="block text-sm font-medium text-[var(--apple-text)]">
                  PDF, Word, or HTML (multiple allowed)
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
                className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              >
                {uploading ? "Uploading…" : "Upload"}
              </button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
