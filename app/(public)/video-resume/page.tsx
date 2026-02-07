export default function VideoResume() {
  return (
    <main className="mx-auto max-w-[var(--container)] px-[var(--space-page-x)] py-[var(--space-page-y)]">
      <div className="card max-w-3xl rounded-2xl p-8 sm:p-10">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          <span className="text-accent">Video Resume</span>
        </h1>
        <p className="mt-2 text-muted">
          A short video introduction.
        </p>

        <div className="mt-10 aspect-video w-full overflow-hidden rounded-xl border-2 border-[var(--card-border)] bg-black/5 shadow-lg dark:bg-white/5">
          <iframe
            src="https://www.youtube.com/embed/k2tL1DBVmPs"
            title="Video resume — Rajamohan Jabbala"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      </div>
    </main>
  );
}
