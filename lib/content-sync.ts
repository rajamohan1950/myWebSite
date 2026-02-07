import { writeFile, mkdir } from "fs/promises";
import path from "path";
import type { Post } from "@/lib/db/schema";

const CONTENT_DIR = "content/posts";

function slugToFilename(slug: string) {
  return `${slug}.md`;
}

function frontmatter(post: Post): string {
  const lines = [
    "---",
    `title: "${post.title.replace(/"/g, '\\"')}"`,
    `slug: "${post.slug}"`,
    `excerpt: "${(post.excerpt ?? "").replace(/"/g, '\\"')}"`,
    `category: "${(post.category ?? "").replace(/"/g, '\\"')}"`,
    `publishedAt: ${post.publishedAt ? `"${new Date(post.publishedAt).toISOString()}"` : "null"}`,
    `createdAt: "${new Date(post.createdAt).toISOString()}"`,
    `updatedAt: "${new Date(post.updatedAt).toISOString()}"`,
    "---",
    "",
  ];
  return lines.join("\n");
}

/**
 * Write a post to content/posts/{slug}.md (optional archive for version control).
 * No-op if content dir is disabled or write fails (e.g. read-only in serverless).
 */
export async function syncPostToContent(post: Post): Promise<void> {
  try {
    const dir = path.join(process.cwd(), CONTENT_DIR);
    await mkdir(dir, { recursive: true });
    const filePath = path.join(dir, slugToFilename(post.slug));
    const body = frontmatter(post) + (post.content || "");
    await writeFile(filePath, body, "utf-8");
  } catch {
    // Ignore (e.g. Vercel read-only filesystem)
  }
}
