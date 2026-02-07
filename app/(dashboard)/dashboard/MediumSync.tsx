"use client";

import { useState } from "react";

export function MediumSync() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ total: number; created: number; updated: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSync = async () => {
    const value = username.trim();
    if (!value) {
      setError("Enter your Medium username (e.g. @you or you) or full RSS feed URL.");
      return;
    }
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/medium/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          value.startsWith("http") ? { feedUrl: value } : { username: value.replace(/^@/, "") }
        ),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Sync failed");
      setResult({ total: data.total, created: data.created, updated: data.updated });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sync failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-10 rounded-[var(--radius)] border border-[var(--apple-border)] bg-[var(--apple-bg-secondary)] p-5">
      <h2 className="text-lg font-semibold text-[var(--apple-text)]">Sync Medium articles</h2>
      <p className="mt-1 text-sm text-[var(--apple-text-secondary)]">
        Pull your latest Medium articles into the blog using your public RSS feed (no account or API key needed).
        Medium’s feed includes your <strong>10 most recent</strong> articles. Run sync whenever you publish to keep the list updated.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <input
          type="text"
          placeholder="@username or https://medium.com/feed/@username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSync()}
          className="min-w-[200px] flex-1 rounded-[var(--radius)] border border-[var(--apple-border)] bg-[var(--apple-bg)] px-3 py-2 text-sm text-[var(--apple-text)] placeholder:text-[var(--apple-text-secondary)] focus:border-[var(--apple-blue)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-light)]"
        />
        <button
          type="button"
          onClick={handleSync}
          disabled={loading}
          className="rounded-[var(--radius)] bg-[var(--apple-blue)] px-4 py-2 text-sm font-normal text-white transition hover:opacity-90 disabled:opacity-50 focus-visible:outline-offset-2"
        >
          {loading ? "Syncing…" : "Sync now"}
        </button>
      </div>
      {error && (
        <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      {result && (
        <p className="mt-3 text-sm text-[var(--apple-text-secondary)]">
          Synced {result.total} articles ({result.created} new, {result.updated} updated).{" "}
          <a href="/blog" className="link-apple">
            View blog →
          </a>
        </p>
      )}
    </section>
  );
}
