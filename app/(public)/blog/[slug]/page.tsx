import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { PostContent } from "./PostContent";
import { ShareLinkedInButton } from "@/components/ShareLinkedInButton";

export const dynamic = "force-dynamic";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:5001";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [post] = await db.select().from(posts).where(eq(posts.slug, slug));
  if (!post || !post.publishedAt) return { title: "Not found" };

  const url = `${baseUrl}/blog/${post.slug}`;
  const title = post.title;
  const description =
    post.excerpt?.slice(0, 200) ??
    post.content.replace(/\s+/g, " ").slice(0, 200).trim() + "...";

  const imageUrl = `${url}/opengraph-image`;

  return {
    title: `${title} | Rajamohan Jabbala`,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "article",
      siteName: "Rajamohan Jabbala",
      publishedTime: post.publishedAt
        ? new Date(post.publishedAt).toISOString()
        : undefined,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    alternates: { canonical: url },
  };
}

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
    <main className="w-full px-[var(--space-page-x)] py-[var(--space-page-y)]">
      <article className="mx-auto w-full max-w-[var(--container)] rounded-[var(--radius-lg)] border border-[var(--apple-border)] bg-[var(--apple-bg)] p-8 sm:p-10 shadow-sm">
        <Link href="/blog" className="text-sm link-apple">
          ← Blog
        </Link>
        <header className="mt-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-[clamp(1.5rem,4vw,2.25rem)] font-semibold tracking-tight text-[var(--apple-text)]">
              {post.title}
            </h1>
            <div className="flex flex-col items-end gap-1">
              <ShareLinkedInButton slug={post.slug} baseUrl={baseUrl} />
              {baseUrl.includes("localhost") && (
                <p className="text-right text-xs text-amber-600 dark:text-amber-400 max-w-[280px]">
                  LinkedIn only enables Post for public URLs. Run{" "}
                  <code className="rounded bg-amber-500/20 px-1 py-0.5 text-[10px]">
                    npx ngrok http 5001
                  </code>{" "}
                  and share the ngrok link, or deploy the site.
                </p>
              )}
            </div>
          </div>
          <time
            dateTime={post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined}
            className="mt-2 block text-sm text-[var(--apple-text-secondary)]"
          >
            {date}
          </time>
        </header>
        {post.excerpt && (
          <p className="mt-4 text-[var(--apple-text-secondary)]">{post.excerpt}</p>
        )}
        <div className="prose prose-slate mt-8 dark:prose-invert max-w-none prose-headings:text-[var(--apple-text)] prose-p:text-[var(--apple-text)] prose-a:text-[var(--apple-link)]">
          <PostContent content={post.content} />
        </div>
      </article>
    </main>
  );
}
