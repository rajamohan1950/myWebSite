import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { mediumArticles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { fetchMediumFeed } from "@/lib/medium-feed";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username") ?? process.env.MEDIUM_USERNAME;
  const feedUrl = searchParams.get("feedUrl") ?? process.env.MEDIUM_FEED_URL;
  const source = feedUrl ?? username;

  if (!source) {
    return NextResponse.json(
      { error: "Provide ?username= or ?feedUrl= or set MEDIUM_USERNAME / MEDIUM_FEED_URL" },
      { status: 400 }
    );
  }

  try {
    const items = await fetchMediumFeed(source);
    const now = new Date();
    let created = 0;
    let updated = 0;

    for (const item of items) {
      const [existing] = await db
        .select()
        .from(mediumArticles)
        .where(eq(mediumArticles.mediumId, item.mediumId));

      if (existing) {
        await db
          .update(mediumArticles)
          .set({
            title: item.title,
            link: item.link,
            excerpt: item.excerpt,
            category: "Medium",
            publishedAt: item.publishedAt,
            syncedAt: now,
          })
          .where(eq(mediumArticles.mediumId, item.mediumId));
        updated++;
      } else {
        await db.insert(mediumArticles).values({
          mediumId: item.mediumId,
          title: item.title,
          link: item.link,
          excerpt: item.excerpt,
          category: "Medium",
          publishedAt: item.publishedAt,
          syncedAt: now,
        });
        created++;
      }
    }

    return NextResponse.json({
      ok: true,
      total: items.length,
      created,
      updated,
    });
  } catch (e) {
    console.error("Medium sync error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to fetch Medium feed" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  let body: { username?: string; feedUrl?: string } = {};
  try {
    body = await request.json();
  } catch {
    // no body
  }
  const username =
    body.username ?? request.nextUrl.searchParams.get("username") ?? process.env.MEDIUM_USERNAME;
  const feedUrl =
    body.feedUrl ?? request.nextUrl.searchParams.get("feedUrl") ?? process.env.MEDIUM_FEED_URL;
  const source = feedUrl ?? username;

  if (!source) {
    return NextResponse.json(
      { error: "Provide username or feedUrl in body/query or set MEDIUM_USERNAME / MEDIUM_FEED_URL" },
      { status: 400 }
    );
  }

  try {
    const items = await fetchMediumFeed(source);
    const now = new Date();
    let created = 0;
    let updated = 0;

    for (const item of items) {
      const [existing] = await db
        .select()
        .from(mediumArticles)
        .where(eq(mediumArticles.mediumId, item.mediumId));

      if (existing) {
        await db
          .update(mediumArticles)
          .set({
            title: item.title,
            link: item.link,
            excerpt: item.excerpt,
            category: "Medium",
            publishedAt: item.publishedAt,
            syncedAt: now,
          })
          .where(eq(mediumArticles.mediumId, item.mediumId));
        updated++;
      } else {
        await db.insert(mediumArticles).values({
          mediumId: item.mediumId,
          title: item.title,
          link: item.link,
          excerpt: item.excerpt,
          category: "Medium",
          publishedAt: item.publishedAt,
          syncedAt: now,
        });
        created++;
      }
    }

    return NextResponse.json({
      ok: true,
      total: items.length,
      created,
      updated,
    });
  } catch (e) {
    console.error("Medium sync error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to fetch Medium feed" },
      { status: 500 }
    );
  }
}
