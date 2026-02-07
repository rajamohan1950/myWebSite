import Link from "next/link";

export default function BookACall() {
  const calendlyUrl = "https://calendly.com/jabbalarajamohan/55-min-meetup";

  return (
    <main className="mx-auto max-w-[var(--container)] px-[var(--space-page-x)] py-[var(--space-page-y)]">
      <div className="card max-w-2xl rounded-2xl p-8 sm:p-10">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          <span className="text-accent">Book a Call</span>
        </h1>
        <p className="mt-2 text-muted">
          Schedule a meeting at a time that works for you. You&apos;ll get a calendar
          invite after booking.
        </p>

        <div className="card-accent-border mt-10 rounded-xl border border-[var(--card-border)] bg-card p-6 shadow-sm">
          <p className="text-muted">
            Click the button below to open the booking page and pick a time.
          </p>
          <a
            href={calendlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex min-h-[44px] items-center rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-95 hover:shadow-lg focus-visible:outline-offset-2"
          >
            Open Calendly — Book 55 min
          </a>
        </div>

        <p className="mt-6 text-sm text-muted">
          You&apos;ll get a calendar invite after booking.
        </p>

        <Link
          href="/"
          className="mt-8 inline-block text-sm font-semibold text-accent transition hover:underline focus-visible:rounded-md focus-visible:outline-offset-2"
        >
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
