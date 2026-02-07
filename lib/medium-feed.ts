import Parser from "rss-parser";

const parser = new Parser({
  timeout: 10000,
  headers: {
    "User-Agent": "Mozilla/5.0 (compatible; PersonalSite/1.0)",
  },
});

export type MediumFeedItem = {
  mediumId: string;
  title: string;
  link: string;
  excerpt: string | null;
  publishedAt: Date;
};

/**
 * Fetch Medium RSS feed and return normalized items.
 * @param feedUrl - Full RSS URL (e.g. https://medium.com/feed/@username) or username (e.g. @username or username)
 */
export async function fetchMediumFeed(
  feedUrlOrUsername: string
): Promise<MediumFeedItem[]> {
  const url = feedUrlOrUsername.startsWith("http")
    ? feedUrlOrUsername
    : `https://medium.com/feed/@${feedUrlOrUsername.replace(/^@/, "")}`;

  const feed = await parser.parseURL(url);
  const items: MediumFeedItem[] = [];

  for (const item of feed.items) {
    const link = item.link ?? item.guid;
    if (!link) continue;

    const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();
    const excerpt =
      item.contentSnippet?.trim().slice(0, 300) ||
      (typeof item.content === "string"
        ? item.content.replace(/<[^>]+>/g, "").trim().slice(0, 300)
        : null) ||
      null;

    items.push({
      mediumId: link,
      title: item.title?.trim() ?? "Untitled",
      link,
      excerpt: excerpt ? `${excerpt}${excerpt.length >= 300 ? "…" : ""}` : null,
      publishedAt: pubDate,
    });
  }

  return items;
}
