"use client";

import { ShareLinkedIn } from "./ShareLinkedIn";

type Props = {
  slug: string;
  basePath?: string;
  /** Pass from server so the link works before hydration (e.g. process.env.NEXT_PUBLIC_SITE_URL or request origin). */
  baseUrl?: string;
  className?: string;
};

const defaultBaseUrl =
  typeof window !== "undefined"
    ? window.location.origin
    : process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:5001";

/**
 * Share button. Use baseUrl from server so the link works immediately (no flash of missing button).
 */
export function ShareLinkedInButton({
  slug,
  basePath = "/blog",
  baseUrl,
  className,
}: Props) {
  const url = `${baseUrl ?? defaultBaseUrl}${basePath}/${slug}`;

  return (
    <ShareLinkedIn
      url={url}
      label="Share on LinkedIn"
      className={
        className ??
        "inline-flex items-center gap-2 rounded-[var(--radius)] border border-[var(--apple-border)] bg-[var(--apple-bg)] px-3 py-2 text-sm font-normal text-[var(--apple-link)] transition hover:bg-[var(--apple-bg-tertiary)] focus-visible:outline-offset-2"
      }
    />
  );
}
