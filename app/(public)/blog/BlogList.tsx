"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

export type BlogItem =
  | { type: "post"; id: number; title: string; excerpt: string | null; date: string; slug: string; category: string | null }
  | { type: "medium"; id: number; title: string; excerpt: string | null; date: string; link: string; category: string | null };

const ALL = "All";

function getCategory(item: BlogItem): string {
  const c = item.category?.trim();
  return c || "Uncategorized";
}

export function BlogList({ items }: { items: BlogItem[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQ = searchParams.get("q") ?? "";
  const urlCategory = searchParams.get("category") ?? ALL;

  const [q, setQ] = useState(urlQ);
  const [category, setCategory] = useState(urlCategory);

  useEffect(() => {
    setQ(searchParams.get("q") ?? "");
    setCategory(searchParams.get("category") ?? ALL);
  }, [searchParams]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => set.add(getCategory(item)));
    return [ALL, ...Array.from(set).sort()];
  }, [items]);

  const filtered = useMemo(() => {
    const lower = q.trim().toLowerCase();
    const bySearch = lower
      ? items.filter(
          (i) =>
            i.title.toLowerCase().includes(lower) ||
            (i.excerpt?.toLowerCase().includes(lower) ?? false)
        )
      : items;
    const byCategory =
      category === ALL
        ? bySearch
        : bySearch.filter((i) => getCategory(i) === category);
    return byCategory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [items, q, category]);

  const setQuery = useCallback(
    (updates: { q?: string; category?: string }) => {
      const params = new URLSearchParams(searchParams.toString());
      const newQ = updates.q !== undefined ? updates.q : params.get("q") ?? "";
      const newCat = updates.category !== undefined ? updates.category : params.get("category") ?? ALL;
      if (newQ) params.set("q", newQ);
      else params.delete("q");
      if (newCat !== ALL) params.set("category", newCat);
      else params.delete("category");
      const s = params.toString();
      router.replace(s ? `?${s}` : "/blog", { scroll: false });
    },
    [router, searchParams]
  );

  useEffect(() => {
    const t = setTimeout(() => setQuery({ q }), 300);
    return () => clearTimeout(t);
  }, [q, setQuery]);

  const onSearchChange = (value: string) => {
    setQ(value);
  };

  const onCategoryChange = (c: string) => {
    setCategory(c);
    setQuery({ category: c });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          placeholder="Search posts…"
          value={q}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search blog"
          className="w-full rounded-[var(--radius)] border border-[var(--apple-border)] bg-[var(--apple-bg)] px-3 py-2.5 text-[15px] text-[var(--apple-text)] placeholder:text-[var(--apple-text-secondary)] focus:border-[var(--apple-blue)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-light)] sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onCategoryChange(c)}
              className={`rounded-full px-4 py-2 text-sm font-normal transition focus-visible:outline-offset-2 ${
                category === c
                  ? "bg-[var(--apple-blue)] text-white"
                  : "bg-[var(--apple-bg-tertiary)] text-[var(--apple-text-secondary)] hover:text-[var(--apple-text)]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-[var(--apple-text-secondary)]">
          {items.length === 0
            ? "No posts yet. Check back later or sync Medium from the dashboard."
            : "No posts match your search or category."}
        </p>
      ) : (
        <ul className="list-none space-y-6" role="list">
          {filtered.map((item) => {
            const dateStr = new Date(item.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });
            const cat = getCategory(item);
            if (item.type === "post") {
              return (
                <li key={`post-${item.id}`}>
                  <Link
                    href={`/blog/${item.slug}`}
                    className="block rounded-[var(--radius)] border border-[var(--apple-border)] bg-[var(--apple-bg-secondary)] p-5 transition hover:border-[var(--apple-text-secondary)]/30"
                  >
                    <span className="inline-block rounded bg-[var(--accent-light)] px-2 py-0.5 text-xs font-medium text-[var(--apple-link)]">
                      {cat}
                    </span>
                    <h2 className="mt-2 text-lg font-semibold text-[var(--apple-text)]">
                      {item.title}
                    </h2>
                    {item.excerpt && (
                      <p className="mt-1 text-sm text-[var(--apple-text-secondary)] line-clamp-2">
                        {item.excerpt}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-[var(--apple-text-secondary)]">{dateStr}</p>
                  </Link>
                </li>
              );
            }
            return (
              <li key={`medium-${item.id}`}>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-[var(--radius)] border border-[var(--apple-border)] bg-[var(--apple-bg-secondary)] p-5 transition hover:border-[var(--apple-text-secondary)]/30"
                >
                  <span className="inline-block rounded bg-[var(--apple-bg-tertiary)] px-2 py-0.5 text-xs font-medium text-[var(--apple-text-secondary)]">
                    {cat}
                  </span>
                  <h2 className="mt-2 text-lg font-semibold text-[var(--apple-text)]">
                    {item.title}
                  </h2>
                  {item.excerpt && (
                    <p className="mt-1 text-sm text-[var(--apple-text-secondary)] line-clamp-2">
                      {item.excerpt}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-[var(--apple-text-secondary)]">{dateStr} · Read on Medium →</p>
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
