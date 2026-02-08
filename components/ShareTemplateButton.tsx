"use client";

import { useState } from "react";

type Props = { slug: string; className?: string; children?: React.ReactNode };

export function ShareTemplateButton({ slug, className, children }: Props) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await fetch(`/api/templates/${encodeURIComponent(slug)}/share`, { method: "POST" });
      const url =
        typeof window !== "undefined"
          ? `${window.location.origin}/templates/${encodeURIComponent(slug)}`
          : "";
      if (url && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className={className}
      aria-label="Share template link"
    >
      {copied ? "Copied!" : children ?? "Share"}
    </button>
  );
}
