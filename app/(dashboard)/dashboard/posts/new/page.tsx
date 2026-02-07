"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewPostPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    publish: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          slug: form.slug || undefined,
          excerpt: form.excerpt || undefined,
          content: form.content,
          category: form.category || undefined,
          publishedAt: form.publish ? new Date().toISOString() : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create");
      router.push("/dashboard/posts");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="w-full px-[var(--space-page-x)] py-[var(--space-page-y)]">
      <div className="mx-auto w-full max-w-[var(--container)]">
      <div className="card rounded-[var(--radius-lg)] p-8 sm:p-10 shadow-sm max-w-3xl">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          <span className="text-accent">New post</span>
        </h1>
        <Link
          href="/dashboard/posts"
          className="mt-2 inline-block text-sm font-medium text-muted hover:text-foreground"
        >
          ← Back to posts
        </Link>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-foreground">
              Title
            </label>
            <input
              id="title"
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-card px-3 py-2 text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-foreground">
              Slug (optional, auto from title)
            </label>
            <input
              id="slug"
              type="text"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              placeholder="my-post"
              className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-card px-3 py-2 text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-foreground">
              Category (optional)
            </label>
            <input
              id="category"
              type="text"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              placeholder="e.g. Engineering, Product, Career"
              className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-card px-3 py-2 text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>

          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-foreground">
              Excerpt (optional)
            </label>
            <input
              id="excerpt"
              type="text"
              value={form.excerpt}
              onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-card px-3 py-2 text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-foreground">
              Content (Markdown supported)
            </label>
            <textarea
              id="content"
              rows={12}
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-card px-3 py-2 font-mono text-sm text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="publish"
              type="checkbox"
              checked={form.publish}
              onChange={(e) => setForm((f) => ({ ...f, publish: e.target.checked }))}
              className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
            />
            <label htmlFor="publish" className="text-sm text-foreground">
              Publish immediately
            </label>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-95 disabled:opacity-50 focus-visible:outline-offset-2"
            >
              {saving ? "Saving…" : "Create post"}
            </button>
            <Link
              href="/dashboard/posts"
              className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted/10"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
      </div>
    </main>
  );
}
