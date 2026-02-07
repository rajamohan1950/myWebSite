import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { eq, isNotNull } from "drizzle-orm";
import { PostContent } from "./PostContent";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [post] = await db
    .select()
    .from(posts)
    .where(eq(posts.slug, slug));

  if (!post || !post.publishedAt) {
    notFound();
  }

  const date = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="mx-auto max-w-[var(--container)] px-[var(--space-page-x)] py-[var(--space-page-y)]">
      <article className="card max-w-3xl rounded-2xl p-8 sm:p-10">
        <Link
          href="/blog"
          className="text-sm font-medium text-accent hover:underline"
        >
          ← Blog
        </Link>
        <header className="mt-4">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {post.title}
          </h1>
          <time
            dateTime={
              post.publishedAt
                ? new Date(post.publishedAt).toISOString()
                : undefined
            }
            className="mt-2 block text-sm text-muted"
          >
            {date}
          </time>
        </header>
        {post.excerpt && (
          <p className="mt-4 text-muted">{post.excerpt}</p>
        )}
        <div className="prose prose-slate mt-8 dark:prose-invert max-w-none">
          <PostContent content={post.content} />
        </div>
      </article>
    </main>
  );
}
