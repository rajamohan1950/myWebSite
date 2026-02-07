import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { syncPostToContent } from "@/lib/content-sync";

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNum = parseInt(id, 10);
    if (Number.isNaN(idNum)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const body = await _request.json();
    const { title, slug: rawSlug, excerpt, content, category, publishedAt } = body as {
      title?: string;
      slug?: string;
      excerpt?: string;
      content?: string;
      category?: string;
      publishedAt?: string | null;
    };

    const [existing] = await db.select().from(posts).where(eq(posts.id, idNum));
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const slug =
      typeof rawSlug === "string" && rawSlug.trim() !== ""
        ? rawSlug.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
        : existing.slug;

    const updated = {
      ...existing,
      title: typeof title === "string" ? title.trim() : existing.title,
      slug,
      excerpt: excerpt !== undefined ? (typeof excerpt === "string" ? excerpt.trim() : null) : existing.excerpt,
      content: typeof content === "string" ? content : existing.content,
      category: category !== undefined ? (typeof category === "string" && category.trim() ? category.trim() : null) : existing.category,
      publishedAt:
        publishedAt === null || publishedAt === ""
          ? null
          : publishedAt
            ? new Date(publishedAt)
            : existing.publishedAt,
      updatedAt: new Date(),
    };

    const [out] = await db
      .update(posts)
      .set({
        title: updated.title,
        slug: updated.slug,
        excerpt: updated.excerpt,
        content: updated.content,
        category: updated.category,
        publishedAt: updated.publishedAt,
        updatedAt: updated.updatedAt,
      })
      .where(eq(posts.id, idNum))
      .returning();

    if (out) await syncPostToContent(out);
    return NextResponse.json(out ?? updated);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNum = parseInt(id, 10);
    if (Number.isNaN(idNum)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const [deleted] = await db.delete(posts).where(eq(posts.id, idNum)).returning();
    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
