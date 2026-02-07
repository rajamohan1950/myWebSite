"use client";

import { useState, useEffect } from "react";

type ResumeItem = {
  id: number;
  displayName: string;
  uploadedAt: string;
};

export default function ResumesPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [list, setList] = useState<ResumeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (!authenticated) return;
    fetch("/api/resumes", { credentials: "include" })
      .then((r) => {
        if (r.status === 401) {
          setAuthenticated(false);
          return [];
        }
        return r.json();
      })
      .then((data) => setList(Array.isArray(data) ? data : []))
      .catch(() => setList([]));
  }, [authenticated]);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/resumes/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Invalid password");
        return;
      }
      setAuthenticated(true);
      setPassword("");
    } catch {
      setError("Request failed");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadFiles.length === 0) return;
    setError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      for (const file of uploadFiles) {
        formData.append("file", file);
      }
      const res = await fetch("/api/resumes", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Upload failed");
        return;
      }
      const data = await res.json();
      const addedList = data.added ?? [data];
      setList((prev) => [
        ...addedList.map((a: { id: number; displayName: string; uploadedAt: string }) => ({
          id: a.id,
          displayName: a.displayName,
          uploadedAt: a.uploadedAt,
        })),
        ...prev,
      ]);
      setUploadFiles([]);
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleRename = (item: ResumeItem) => {
    setEditingId(item.id);
    setEditingName(item.displayName);
  };

  const handleRenameSave = async () => {
    if (editingId == null || !editingName.trim()) {
      setEditingId(null);
      return;
    }
    setError(null);
    try {
      const res = await fetch(`/api/resumes/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: editingName.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Rename failed");
        return;
      }
      setList((prev) =>
        prev.map((r) =>
          r.id === editingId
            ? { ...r, displayName: editingName.trim() }
            : r
        )
      );
      setEditingId(null);
    } catch {
      setError("Rename failed");
    }
  };

  const handleRenameCancel = () => {
    setEditingId(null);
    setEditingName("");
  };

  const handleDelete = async (item: ResumeItem) => {
    const confirmed = window.confirm(
      `Delete "${item.displayName}"? This cannot be undone.`
    );
    if (!confirmed) return;
    setDeletingId(item.id);
    setError(null);
    try {
      const res = await fetch(`/api/resumes/${item.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Delete failed");
        return;
      }
      setList((prev) => prev.filter((r) => r.id !== item.id));
    } catch {
      setError("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  if (!authenticated) {
    return (
      <main className="w-full px-[var(--space-page-x)] py-[var(--space-page-y)]">
        <div className="mx-auto w-full max-w-[var(--container)]">
        <div className="rounded-[var(--radius-lg)] border border-[var(--apple-border)] bg-[var(--apple-bg)] p-8 sm:p-10 shadow-sm">
          <h1 className="text-[clamp(1.5rem,4vw,2rem)] font-semibold tracking-tight text-[var(--apple-text)]">
            Private Resumes
          </h1>
          <p className="mt-2 text-sm text-[var(--apple-text-secondary)]">
            Enter the password to view and manage your resumes.
          </p>
          <form onSubmit={handleUnlock} className="mt-6 space-y-4">
            {error && (
              <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            )}
            <div>
              <label htmlFor="resumes-password" className="block text-sm font-medium text-foreground">
                Password
              </label>
              <input
                id="resumes-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-[var(--radius)] border border-[var(--apple-border)] bg-[var(--apple-bg)] px-3 py-2.5 text-[var(--apple-text)] focus:border-[var(--apple-blue)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-light)]"
                placeholder="Enter password"
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50"
            >
              {loading ? "Checking…" : "Unlock"}
            </button>
          </form>
        </div>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full px-[var(--space-page-x)] py-[var(--space-page-y)]">
      <div className="mx-auto w-full max-w-[var(--container)]">
      <div className="rounded-[var(--radius-lg)] border border-[var(--apple-border)] bg-[var(--apple-bg)] p-8 sm:p-10 shadow-sm">
        <h1 className="text-[clamp(1.5rem,4vw,2rem)] font-semibold tracking-tight text-[var(--apple-text)]">
          My Resumes
        </h1>
        <p className="mt-1 text-sm text-[var(--apple-text-secondary)]">
          Upload and download your resumes. This page is password-protected.
        </p>

        <form onSubmit={handleUpload} className="mt-8 flex flex-wrap items-end gap-3">
          {error && (
            <p className="w-full rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
          <div className="min-w-0 flex-1">
            <label htmlFor="resumes-file" className="block text-sm font-medium text-foreground">
              Upload PDF or Word (multiple allowed)
            </label>
            <input
              id="resumes-file"
              type="file"
              accept=".pdf,.doc,.docx"
              multiple
              onChange={(e) => {
                const chosen = e.target.files;
                setUploadFiles(chosen ? Array.from(chosen) : []);
                setError(null);
              }}
              className="mt-1 w-full rounded-[var(--radius)] border border-[var(--apple-border)] bg-[var(--apple-bg)] px-3 py-2.5 text-sm text-[var(--apple-text)] file:mr-3 file:rounded file:border-0 file:bg-[var(--accent-light)] file:px-3 file:py-1 file:text-[var(--apple-link)]"
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
            className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-95 disabled:opacity-50"
          >
            {uploading ? "Uploading…" : "Upload"}
          </button>
        </form>

        <section className="mt-8" aria-labelledby="list-heading">
          <h2 id="list-heading" className="text-lg font-semibold text-[var(--apple-text)]">
            Stored resumes
          </h2>
          {list.length === 0 ? (
            <p className="mt-2 text-sm text-[var(--apple-text-secondary)]">No resumes yet. Upload one above.</p>
          ) : (
            <ul className="mt-3 list-none space-y-3">
              {list.map((item) => (
                <li
                  key={item.id}
                  className="rounded-[var(--radius-lg)] border border-[var(--apple-border)] bg-[var(--apple-bg-secondary)] p-4"
                >
                  {editingId === item.id ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleRenameSave();
                          if (e.key === "Escape") handleRenameCancel();
                        }}
                        className="min-w-0 flex-1 rounded-[var(--radius)] border border-[var(--apple-border)] bg-[var(--apple-bg)] px-3 py-2 text-sm text-[var(--apple-text)] focus:border-[var(--apple-blue)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-light)]"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={handleRenameSave}
                        className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-white hover:opacity-95"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={handleRenameCancel}
                        className="rounded-lg border border-[var(--card-border)] px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted/10"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Row 1: filename and date only */}
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <span
                          className="min-w-0 truncate font-medium text-foreground"
                          title={item.displayName}
                        >
                          {item.displayName}
                        </span>
                        <span className="shrink-0 text-sm text-muted">
                          {new Date(item.uploadedAt).toLocaleDateString()}
                        </span>
                      </div>
                      {/* Row 2: actions, always visible with spacing */}
                      <div className="mt-3 flex flex-wrap gap-2 border-t border-[var(--card-border)] pt-3">
                        <a
                          href={`/api/resumes/${item.id}?view=1`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex rounded-lg bg-accent px-3 py-2 text-sm font-medium text-white hover:opacity-95"
                        >
                          View online
                        </a>
                        <a
                          href={`/api/resumes/${item.id}`}
                          download={item.displayName}
                          className="inline-flex rounded-lg border border-[var(--card-border)] bg-card px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/10"
                        >
                          Download
                        </a>
                        <button
                          type="button"
                          onClick={() => handleRename(item)}
                          className="inline-flex rounded-lg border border-[var(--card-border)] bg-card px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/10"
                        >
                          Rename
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          disabled={deletingId === item.id}
                          className="inline-flex rounded-lg border border-red-500/40 bg-red-500/5 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-500/10 disabled:opacity-50 dark:text-red-400"
                        >
                          {deletingId === item.id ? "Deleting…" : "Delete"}
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
      </div>
    </main>
  );
}
