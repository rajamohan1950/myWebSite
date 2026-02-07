import { db } from "@/lib/db";
import { posts, mediumArticles } from "@/lib/db/schema";
import { desc, isNotNull } from "drizzle-orm";
import { BlogList } from "./BlogList";

export const dynamic = "force-dynamic";

export default async function BlogArchivePage() {
  const [publishedPosts, mediumItems] = await Promise.all([
    db
      .select()
      .from(posts)
      .where(isNotNull(posts.publishedAt))
      .orderBy(desc(posts.publishedAt)),
    db
      .select()
      .from(mediumArticles)
      .orderBy(desc(mediumArticles.publishedAt)),
  ]);

  const items = [
    ...publishedPosts.map((p) => ({
      type: "post" as const,
      id: p.id,
      title: p.title,
      excerpt: p.excerpt,
      date: new Date(p.publishedAt!).toISOString(),
      slug: p.slug,
      category: p.category,
    })),
    ...mediumItems.map((m) => ({
      type: "medium" as const,
      id: m.id,
      title: m.title,
      excerpt: m.excerpt,
      date: new Date(m.publishedAt).toISOString(),
      link: m.link,
      category: m.category,
    })),
  ];

  return (
    <main className="mx-auto max-w-[var(--container)] px-[var(--space-page-x)] py-[var(--space-page-y)]">
      <div className="card max-w-3xl rounded-2xl p-8 sm:p-10">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          <span className="text-accent">Blog</span>
        </h1>
        <p className="mt-2 text-muted">
          Posts and updates by category. Use search or filters; your choice is kept in the URL.
        </p>

        <div className="mt-10">
          <BlogList items={items} />
        </div>
      </div>
    </main>
  );
}
