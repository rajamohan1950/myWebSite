"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Post = {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function DashboardPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/posts")
      .then((r) => r.json())
      .then((data) => {
        setPosts(Array.isArray(data) ? data : []);
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="mx-auto max-w-[var(--container)] px-[var(--space-page-x)] py-[var(--space-page-y)]">
      <div className="card max-w-4xl rounded-2xl p-8 sm:p-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            <span className="text-accent">Posts</span>
          </h1>
          <Link
            href="/dashboard/posts/new"
            className="inline-flex min-h-[44px] items-center rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-95 focus-visible:outline-offset-2"
          >
            New post
          </Link>
        </div>

        {loading ? (
          <p className="mt-6 text-muted">Loading…</p>
        ) : posts.length === 0 ? (
          <p className="mt-6 text-muted">No posts yet. Create one to get started.</p>
        ) : (
          <ul className="mt-8 list-none space-y-2" role="list">
            {posts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/dashboard/posts/${post.id}/edit`}
                  className="card flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--card-border)] p-4 transition hover:border-accent/30 hover:shadow-md"
                >
                  <div className="min-w-0">
                    <span className="font-semibold text-foreground">{post.title}</span>
                    {post.excerpt && (
                      <p className="mt-0.5 truncate text-sm text-muted">{post.excerpt}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted">
                    {post.publishedAt ? (
                      <span className="rounded-full bg-accent/15 px-2 py-0.5 font-medium text-accent">
                        Published
                      </span>
                    ) : (
                      <span className="rounded-full bg-muted/20 px-2 py-0.5">Draft</span>
                    )}
                    <span>{new Date(post.updatedAt).toLocaleDateString()}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-8 text-sm text-muted">
          <Link href="/blog" className="text-accent hover:underline">
            View public blog →
          </Link>
        </p>
      </div>
    </main>
  );
}
