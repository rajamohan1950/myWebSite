export default function Profile() {
  return (
    <main className="mx-auto max-w-[var(--container)] px-[var(--space-page-x)] py-[var(--space-page-y)]">
      <div className="card max-w-3xl rounded-2xl p-8 sm:p-10">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          <span className="text-accent">Profile</span>
        </h1>
        <p className="mt-2 max-w-2xl text-muted">
          A detailed profile will be editable from the dashboard and synced from
          LinkedIn later. For now, here is a manual placeholder.
        </p>

        <section className="mt-12 space-y-10" aria-labelledby="about-heading">
          <div className="card-accent-border rounded-r-lg border-l-4 border-accent bg-[var(--accent-light)]/30 p-4 dark:bg-[var(--accent-light)]/10">
            <h2 id="about-heading" className="text-lg font-semibold text-foreground">
              About
            </h2>
            <p className="mt-2 leading-relaxed text-muted">
              Add your bio, headline, and key highlights here. This section will
              be managed via the dashboard and can be pulled from LinkedIn.
            </p>
          </div>

          <div className="rounded-xl border border-[var(--card-border)] bg-card p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">
              Experience
            </h2>
            <p className="mt-2 leading-relaxed text-muted">
              Your experience, education, and skills will appear here once
              configured in the dashboard or imported from LinkedIn.
            </p>
          </div>

          <div className="rounded-xl border border-[var(--card-border)] bg-card p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">
              Links
            </h2>
            <ul className="mt-2 list-inside list-disc space-y-1 text-muted">
              <li>LinkedIn (to be added)</li>
              <li>Medium (to be added)</li>
              <li>GitHub / other (to be added)</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
