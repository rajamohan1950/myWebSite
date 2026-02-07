import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { PostContent } from "../../[slug]/PostContent";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function BlogPreviewPage({ params }: Props) {
  const { id } = await params;
  const idNum = parseInt(id, 10);
  if (Number.isNaN(idNum)) notFound();

  const [post] = await db.select().from(posts).where(eq(posts.id, idNum));
  if (!post) notFound();

  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Draft";

  return (
    <main className="mx-auto max-w-[var(--container)] px-[var(--space-page-x)] py-[var(--space-page-y)]">
      <article className="max-w-3xl rounded-[var(--radius-lg)] border border-[var(--apple-border)] bg-[var(--apple-bg)] p-8 sm:p-10">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Link href="/dashboard/posts" className="text-sm link-apple">
            ← Dashboard
          </Link>
          <span className="rounded bg-amber-500/20 px-2 py-1 text-xs font-medium text-amber-700 dark:text-amber-400">
            Preview {post.publishedAt ? "" : "(draft)"}
          </span>
        </div>
        <header className="mt-4">
          <h1 className="text-[clamp(1.5rem,4vw,2.25rem)] font-semibold tracking-tight text-[var(--apple-text)]">
            {post.title}
          </h1>
          <p className="mt-2 text-sm text-[var(--apple-text-secondary)]">{date}</p>
        </header>
        {post.excerpt && (
          <p className="mt-4 text-[var(--apple-text-secondary)]">{post.excerpt}</p>
        )}
        <div className="prose prose-slate mt-8 dark:prose-invert max-w-none">
          <PostContent content={post.content} />
        </div>
      </article>
    </main>
  );
}
