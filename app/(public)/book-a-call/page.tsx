import Link from "next/link";

export default function BookACall() {
  const calendlyUrl = "https://calendly.com/jabbalarajamohan/55-min-meetup";

  return (
    <main className="mx-auto max-w-[var(--container)] px-[var(--space-page-x)] py-[var(--space-page-y)]">
      <div className="max-w-2xl rounded-[var(--radius-lg)] border border-[var(--apple-border)] bg-[var(--apple-bg)] p-8 sm:p-10">
        <h1 className="text-[clamp(1.75rem,4vw,2.25rem)] font-semibold tracking-tight text-[var(--apple-text)]">
          Book a Call
        </h1>
        <p className="mt-2 text-[var(--apple-text-secondary)]">
          Schedule a meeting at a time that works for you. You&apos;ll get a calendar
          invite after booking.
        </p>

        <div className="mt-10 rounded-[var(--radius)] border border-[var(--apple-border)] bg-[var(--apple-bg-secondary)] p-6">
          <p className="text-[var(--apple-text-secondary)]">
            Click the button below to open the booking page and pick a time.
          </p>
          <a
            href={calendlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex btn-primary"
          >
            Open Calendly — Book 55 min
          </a>
        </div>

        <p className="mt-6 text-sm text-[var(--apple-text-secondary)]">
          You&apos;ll get a calendar invite after booking.
        </p>

        <Link href="/" className="mt-8 inline-block text-sm link-apple">
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
