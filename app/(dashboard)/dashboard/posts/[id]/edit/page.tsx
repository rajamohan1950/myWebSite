"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Post = {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  category: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    if (!id) return;
    fetch(`/api/posts?id=${id}`)
      .then((r) => r.json())
      .then((data) => {
        setPost(data);
        setForm({
          title: data.title ?? "",
          slug: data.slug ?? "",
          excerpt: data.excerpt ?? "",
          content: data.content ?? "",
          category: data.category ?? "",
          publish: !!data.publishedAt,
        });
      })
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [id]);

  const savePost = async (): Promise<boolean> => {
    if (!post) return false;
    setError(null);
    setSaving(true);
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "PATCH",
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
      if (!res.ok) throw new Error(data.error ?? "Failed to update");
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await savePost();
    if (ok) {
      router.push("/dashboard/posts");
      router.refresh();
    }
  };

  const handleSaveAndPreview = async () => {
    const ok = await savePost();
    if (ok) window.open(`/blog/preview/${post!.id}`, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-[var(--container)] px-[var(--space-page-x)] py-[var(--space-page-y)]">
        <div className="card max-w-2xl rounded-2xl p-8">
          <p className="text-muted">Loading…</p>
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="mx-auto max-w-[var(--container)] px-[var(--space-page-x)] py-[var(--space-page-y)]">
        <div className="card max-w-2xl rounded-2xl p-8">
          <p className="text-muted">Post not found.</p>
          <Link href="/dashboard/posts" className="mt-4 inline-block text-accent hover:underline">
            ← Back to posts
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full px-[var(--space-page-x)] py-[var(--space-page-y)]">
      <div className="mx-auto w-full max-w-[var(--container)]">
      <div className="card rounded-[var(--radius-lg)] p-8 sm:p-10 shadow-sm max-w-3xl">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          <span className="text-accent">Edit post</span>
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
              Slug
            </label>
            <input
              id="slug"
              type="text"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
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
              Published
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-95 disabled:opacity-50 focus-visible:outline-offset-2"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={handleSaveAndPreview}
              className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted/10 disabled:opacity-50 focus-visible:outline-offset-2"
            >
              {saving ? "Saving…" : "Save & Preview"}
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
