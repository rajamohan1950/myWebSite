import Link from "next/link";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { desc, isNotNull } from "drizzle-orm";

const YOUTUBE_EMBED = "https://www.youtube.com/embed/k2tL1DBVmPs";

async function getLatestPost() {
  const [post] = await db
    .select({ id: posts.id, title: posts.title, excerpt: posts.excerpt, slug: posts.slug, publishedAt: posts.publishedAt })
    .from(posts)
    .where(isNotNull(posts.publishedAt))
    .orderBy(desc(posts.publishedAt))
    .limit(1);
  return post ?? null;
}

export default async function Home() {
  const latestPost = await getLatestPost();

  return (
    <main>
      {/* 1. Video resume — first section, right below header (Apple hero style) */}
      <section className="bg-[var(--apple-bg)]">
        <div className="mx-auto max-w-[var(--container-wide)] px-[var(--space-page-x)] pt-12 pb-16 md:pt-16 md:pb-24">
          <h2 className="apple-display text-center text-[var(--apple-text)]">
            Video resume
          </h2>
          <p className="apple-subhead mx-auto mt-4 max-w-[600px] text-center text-[var(--apple-text-secondary)]">
            A short introduction to my background and what I bring to the table.
          </p>
          <div className="mx-auto mt-10 max-w-4xl">
            <div className="aspect-video w-full overflow-hidden rounded-[var(--radius-lg)] bg-[var(--apple-bg-tertiary)]">
              <iframe
                src={YOUTUBE_EMBED}
                title="Video resume — Rajamohan Jabbala"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </div>
          <p className="mt-6 text-center">
            <Link href="/video-resume" className="link-apple apple-body">
              Watch on video resume page →
            </Link>
          </p>
        </div>
      </section>

      {/* 2. Latest from the blog — Apple product-section style */}
      <section className="bg-[var(--apple-bg-tertiary)]">
        <div className="mx-auto max-w-[var(--container-wide)] px-[var(--space-page-x)] py-16 md:py-24">
          <p className="apple-caption text-center font-semibold uppercase tracking-wider text-[var(--apple-text-secondary)]">
            From the blog
          </p>
          {latestPost ? (
            <div className="mx-auto mt-6 max-w-[720px] text-center">
              <Link href={`/blog/${latestPost.slug}`} className="block group">
                <h3 className="apple-headline text-[var(--apple-text)] group-hover:text-[var(--apple-link)]">
                  {latestPost.title}
                </h3>
              </Link>
              {latestPost.excerpt && (
                <p className="apple-body mt-3 text-[var(--apple-text-secondary)]">
                  {latestPost.excerpt}
                </p>
              )}
              <p className="apple-caption mt-3 text-[var(--apple-text-secondary)]">
                {latestPost.publishedAt
                  ? new Date(latestPost.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : ""}
              </p>
              <p className="mt-4">
                <Link href={`/blog/${latestPost.slug}`} className="link-apple apple-body">
                  Read more →
                </Link>
              </p>
            </div>
          ) : (
            <div className="mx-auto mt-6 max-w-[720px] text-center">
              <p className="apple-body text-[var(--apple-text-secondary)]">
                No posts yet. Check back later or visit the blog.
              </p>
              <p className="mt-4">
                <Link href="/blog" className="link-apple apple-body">
                  Go to blog →
                </Link>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 3. Name + tagline + CTAs — compact strip */}
      <section className="border-t border-[var(--apple-border)] bg-[var(--apple-bg)]">
        <div className="mx-auto max-w-[var(--container)] px-[var(--space-page-x)] py-14 md:py-20">
          <h1 className="apple-headline text-center text-[var(--apple-text)]">
            Rajamohan Jabbala
          </h1>
          <p className="apple-subhead mx-auto mt-3 max-w-[560px] text-center text-[var(--apple-text-secondary)]">
            AI/ML Innovation Leader. Building conversational intelligence and enterprise AI at scale.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/profile" className="btn-primary">
              View profile
            </Link>
            <Link href="/book-a-call" className="btn-secondary">
              Book a call
            </Link>
            <Link href="/blog" className="link-apple apple-body">
              Blog →
            </Link>
          </div>
        </div>
      </section>

      {/* 4. What you can do here — grid with font/color variation */}
      <section className="border-t border-[var(--apple-border)] bg-[var(--apple-bg-secondary)]">
        <div className="mx-auto max-w-[var(--container)] px-[var(--space-page-x)] py-16 md:py-20">
          <p className="apple-caption text-center font-semibold uppercase tracking-wider text-[var(--apple-text-secondary)]">
            Explore
          </p>
          <h2 className="apple-title mt-2 text-center text-[var(--apple-text)]">
            What you can do here
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Profile", desc: "Experience, education, skills.", href: "/profile" },
              { title: "Blog", desc: "Articles on AI and leadership.", href: "/blog" },
              { title: "Video resume", desc: "Watch the full video.", href: "/video-resume" },
              { title: "Book a call", desc: "Schedule a conversation.", href: "/book-a-call" },
              { title: "LinkedIn", desc: "Connect and recommendations.", href: "/linkedin" },
              { title: "Resumes", desc: "Password-protected downloads.", href: "/resumes" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group block rounded-[var(--radius)] border border-[var(--apple-border)] bg-[var(--apple-bg)] p-6 transition hover:border-[var(--apple-text-secondary)]/25"
              >
                <h3 className="text-[19px] font-semibold tracking-tight text-[var(--apple-text)] group-hover:text-[var(--apple-link)]">
                  {item.title}
                </h3>
                <p className="apple-body mt-1.5 text-[var(--apple-text-secondary)]">
                  {item.desc}
                </p>
                <span className="apple-caption mt-3 inline-block text-[var(--apple-link)] group-hover:underline">
                  Learn more →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Footer — Apple style */}
      <footer className="border-t border-[var(--apple-border)] bg-[var(--apple-bg-tertiary)]">
        <div className="mx-auto max-w-[var(--container)] px-[var(--space-page-x)] py-10">
          <p className="apple-caption text-center text-[var(--apple-text-secondary)]">
            © {new Date().getFullYear()} Rajamohan Jabbala. All rights reserved.
          </p>
          <p className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-center">
            <Link href="/blog" className="apple-caption link-apple">
              Blog
            </Link>
            <Link href="/profile" className="apple-caption link-apple">
              Profile
            </Link>
            <Link href="/book-a-call" className="apple-caption link-apple">
              Book a call
            </Link>
          </p>
        </div>
      </footer>
    </main>
  );
}
