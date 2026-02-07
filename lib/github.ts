/**
 * Fetch public GitHub repos for the configured user.
 * Set GITHUB_USERNAME (default rajamohan1950) and optionally GITHUB_TOKEN for higher rate limit.
 */

const GITHUB_API = "https://api.github.com";
const OWNER = (process.env.GITHUB_USERNAME ?? "rajamohan1950").trim();

function headers(): HeadersInit {
  const token = process.env.GITHUB_TOKEN?.trim();
  return {
    Accept: "application/vnd.github.v3+json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export type Repo = {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  default_branch: string;
  updated_at: string;
};

export async function getRepos(): Promise<Repo[]> {
  const res = await fetch(`${GITHUB_API}/users/${OWNER}/repos?per_page=100&sort=updated`, {
    headers: headers(),
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];
  const json = (await res.json()) as Record<string, unknown>[];
  return json
    .filter((r) => typeof r.name === "string")
    .map((r) => ({
      name: r.name as string,
      full_name: (r.full_name as string) ?? (r.name as string),
      description: (r.description as string | null) ?? null,
      html_url: (r.html_url as string) ?? "",
      homepage: (r.homepage as string | null) ?? null,
      default_branch: (r.default_branch as string) ?? "main",
      updated_at: (r.updated_at as string) ?? "",
    }));
}

export async function getRepo(repoName: string): Promise<Repo | null> {
  const res = await fetch(`${GITHUB_API}/repos/${OWNER}/${encodeURIComponent(repoName)}`, {
    headers: headers(),
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  const r = (await res.json()) as Record<string, unknown>;
  return {
    name: r.name as string,
    full_name: (r.full_name as string) ?? (r.name as string),
    description: (r.description as string | null) ?? null,
    html_url: (r.html_url as string) ?? "",
    homepage: (r.homepage as string | null) ?? null,
    default_branch: (r.default_branch as string) ?? "main",
    updated_at: (r.updated_at as string) ?? "",
  };
}

/** Raw README content (markdown). Returns null if no README. */
export async function getReadme(repoName: string): Promise<string | null> {
  const res = await fetch(
    `${GITHUB_API}/repos/${OWNER}/${encodeURIComponent(repoName)}/readme`,
    { headers: { ...headers(), Accept: "application/vnd.github.raw" }, next: { revalidate: 300 } }
  );
  if (!res.ok) return null;
  return res.text();
}

/** First ~240 chars of README, markdown stripped, for card summary. Falls back to repo description. */
export function summarizeReadme(readme: string | null, fallback: string | null): string {
  if (!readme || !readme.trim()) return fallback?.trim().slice(0, 240) || "No description.";
  const stripped = readme
    .replace(/#{1,6}\s*/g, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`[^`]+`/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const first = stripped.slice(0, 240);
  return first + (stripped.length > 240 ? "…" : "");
}

/** Repo with optional summary from README. */
export type RepoWithSummary = Repo & { summary: string };
