import { db } from "@/lib/db";
import { posts, mediumArticles, type Post, type MediumArticle } from "@/lib/db/schema";
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
    ...publishedPosts.map((p: Post) => ({
      type: "post" as const,
      id: p.id,
      title: p.title,
      excerpt: p.excerpt,
      date: new Date(p.publishedAt!).toISOString(),
      slug: p.slug,
      category: p.category,
    })),
    ...mediumItems.map((m: MediumArticle) => ({
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
    <main className="w-full px-[var(--space-page-x)] py-[var(--space-page-y)]">
      <div className="mx-auto w-full max-w-[var(--container)]">
        <section className="rounded-[var(--radius-lg)] border border-[var(--apple-border)] bg-[var(--apple-bg)] p-8 sm:p-10 shadow-sm">
          <h1 className="text-[clamp(1.75rem,4vw,2.25rem)] font-semibold tracking-tight text-[var(--apple-text)]">
            Blog
          </h1>
          <p className="mt-2 text-[var(--apple-text-secondary)]">
            Posts and updates by category. Use search or filters; your choice is kept in the URL.
          </p>

          <div className="mt-10">
            <BlogList items={items} />
          </div>
        </section>
      </div>
    </main>
  );
}
