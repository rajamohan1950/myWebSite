export default function VideoResume() {
  return (
    <main className="w-full px-[var(--space-page-x)] py-[var(--space-page-y)]">
      <div className="mx-auto w-full max-w-[var(--container)]">
        <h1 className="text-[clamp(1.75rem,4vw,2.25rem)] font-semibold tracking-tight text-[var(--apple-text)]">
          Video Resume
        </h1>
        <p className="mt-2 text-[var(--apple-text-secondary)]">
          A short video introduction.
        </p>

        <div className="mt-10 w-full aspect-video overflow-hidden rounded-[var(--radius-lg)] border border-[var(--apple-border)] bg-[var(--apple-bg-tertiary)]">
          <iframe
            src="https://www.youtube.com/embed/k2tL1DBVmPs"
            title="Video resume — Rajamohan Jabbala"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="h-full w-full min-w-0 block"
          />
        </div>
      </div>
    </main>
  );
}
