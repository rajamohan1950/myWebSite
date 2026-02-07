"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShareLinkedInButton } from "@/components/ShareLinkedInButton";

function useBaseUrl() {
  const [baseUrl, setBaseUrl] = useState<string>("");
  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);
  return baseUrl;
}

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
  const baseUrl = useBaseUrl();
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
    <main className="w-full px-[var(--space-page-x)] py-[var(--space-page-y)]">
      <div className="mx-auto w-full max-w-[var(--container)]">
      <div className="rounded-[var(--radius-lg)] border border-[var(--apple-border)] bg-[var(--apple-bg)] p-8 sm:p-10 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-[clamp(1.5rem,4vw,2rem)] font-semibold tracking-tight text-[var(--apple-text)]">
            Posts
          </h1>
          <Link href="/dashboard/posts/new" className="btn-primary">
            New post
          </Link>
        </div>

        {loading ? (
          <p className="mt-6 text-[var(--apple-text-secondary)]">Loading…</p>
        ) : posts.length === 0 ? (
          <p className="mt-6 text-[var(--apple-text-secondary)]">No posts yet. Create one to get started.</p>
        ) : (
          <ul className="mt-8 list-none space-y-2" role="list">
            {posts.map((post) => (
              <li key={post.id}>
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius)] border border-[var(--apple-border)] bg-[var(--apple-bg-secondary)] p-4 transition hover:border-[var(--apple-text-secondary)]/30">
                  <Link href={`/dashboard/posts/${post.id}/edit`} className="min-w-0 flex-1">
                    <span className="font-semibold text-[var(--apple-text)]">{post.title}</span>
                    {post.excerpt && (
                      <p className="mt-0.5 truncate text-sm text-[var(--apple-text-secondary)]">{post.excerpt}</p>
                    )}
                  </Link>
                  <div className="flex items-center gap-2">
                    {post.publishedAt && (
                      <ShareLinkedInButton slug={post.slug} baseUrl={baseUrl || undefined} />
                    )}
                    <div className="flex items-center gap-2 text-sm text-[var(--apple-text-secondary)]">
                      {post.publishedAt ? (
                        <span className="rounded-full bg-[var(--accent-light)] px-2 py-0.5 font-medium text-[var(--apple-link)]">
                          Published
                        </span>
                      ) : (
                        <span className="rounded-full bg-[var(--apple-bg-tertiary)] px-2 py-0.5">Draft</span>
                      )}
                      <span>{new Date(post.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-8 text-sm text-[var(--apple-text-secondary)]">
          <Link href="/blog" className="link-apple">
            View public blog →
          </Link>
        </p>
      </div>
      </div>
    </main>
  );
}
