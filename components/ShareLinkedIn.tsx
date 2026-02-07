"use client";

import { linkedInShareUrl } from "@/lib/linkedin-share";

type Props = {
  url: string;
  label?: string;
  className?: string;
};

export function ShareLinkedIn({ url, label = "Share on LinkedIn", className }: Props) {
  const shareUrl = linkedInShareUrl(url);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <a
      href={shareUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={label}
      title="Opens LinkedIn so you can add a comment and post"
      onClick={handleClick}
    >
      {label}
    </a>
  );
}
