import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { desc, eq, isNotNull } from "drizzle-orm";
import { syncPostToContent } from "@/lib/content-sync";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const id = searchParams.get("id");
    const publishedOnly = searchParams.get("publishedOnly") === "1";

    if (id) {
      const idNum = parseInt(id, 10);
      if (Number.isNaN(idNum)) {
        return NextResponse.json({ error: "Invalid id" }, { status: 400 });
      }
      const [post] = await db.select().from(posts).where(eq(posts.id, idNum));
      if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(post);
    }

    if (slug) {
      const [post] = await db.select().from(posts).where(eq(posts.slug, slug));
      if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(post);
    }

    if (publishedOnly) {
      const published = await db
        .select()
        .from(posts)
        .where(isNotNull(posts.publishedAt))
        .orderBy(desc(posts.publishedAt));
      return NextResponse.json(published);
    }

    const allPosts = await db
      .select()
      .from(posts)
      .orderBy(desc(posts.publishedAt ?? posts.createdAt));
    return NextResponse.json(allPosts);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, slug: rawSlug, excerpt, content, category, publishedAt } = body as {
      title?: string;
      slug?: string;
      excerpt?: string;
      content?: string;
      category?: string;
      publishedAt?: string | null;
    };

    if (!title || typeof title !== "string" || title.trim() === "") {
      return NextResponse.json({ error: "title required" }, { status: 400 });
    }

    const slug =
      typeof rawSlug === "string" && rawSlug.trim() !== ""
        ? rawSlug.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
        : title.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    const now = new Date();
    const published = publishedAt ? new Date(publishedAt) : null;

    const [inserted] = await db
      .insert(posts)
      .values({
        slug,
        title: title.trim(),
        excerpt: typeof excerpt === "string" ? excerpt.trim() : null,
        content: typeof content === "string" ? content : "",
        category: typeof category === "string" && category.trim() ? category.trim() : null,
        publishedAt: published,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    await syncPostToContent(inserted);
    return NextResponse.json(inserted);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
