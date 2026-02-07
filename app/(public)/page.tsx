import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-[var(--container)] px-[var(--space-page-x)] py-[var(--space-page-y)]">
      {/* Hero */}
      <section className="card card-accent-border max-w-2xl rounded-2xl p-8 sm:p-10">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Hi, I&apos;m{" "}
          <span className="text-accent">Rajamohan Jabbala</span>
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted">
          Welcome to my personal site. Here you can learn about my work, watch my
          video resume, and book a call with me.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/profile"
            className="inline-flex min-h-[44px] items-center rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-95 hover:shadow-lg focus-visible:outline-offset-2"
          >
            View profile
          </Link>
          <Link
            href="/video-resume"
            className="inline-flex min-h-[44px] items-center rounded-xl border-2 border-[var(--accent)] bg-[var(--accent-light)] px-5 py-2.5 text-sm font-semibold text-accent transition hover:opacity-90 focus-visible:outline-offset-2 dark:bg-[var(--accent-light)] dark:text-accent"
          >
            Video resume
          </Link>
          <Link
            href="/book-a-call"
            className="inline-flex min-h-[44px] items-center rounded-xl border-2 border-[var(--secondary)] bg-[var(--secondary-light)] px-5 py-2.5 text-sm font-semibold text-[var(--secondary)] transition hover:opacity-90 focus-visible:outline-offset-2 dark:bg-[var(--secondary-light)]"
          >
            Book a call
          </Link>
        </div>
      </section>
    </main>
  );
}
