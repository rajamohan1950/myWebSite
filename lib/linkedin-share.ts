/**
 * LinkedIn share URL (opens their share dialog with pre-filled URL).
 * No API key required. User can add their own comment and post.
 */
export function linkedInShareUrl(postUrl: string): string {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`;
}
