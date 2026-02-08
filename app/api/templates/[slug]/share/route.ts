import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { templates } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

/** POST /api/templates/[slug]/share — increment share count, return public URL (no auth). */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const s = slug?.trim();
  if (!s) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const [row] = await db
    .select({ id: templates.id })
    .from(templates)
    .where(eq(templates.slug, s));

  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db
    .update(templates)
    .set({ shareCount: sql`coalesce(share_count, 0) + 1` })
    .where(eq(templates.slug, s));

  const base = process.env.NEXT_PUBLIC_SITE_URL || "";
  const url = base ? `${base.replace(/\/$/, "")}/templates/${encodeURIComponent(s)}` : "";

  return NextResponse.json({ url });
}
