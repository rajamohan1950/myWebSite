import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { templates } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getTemplateStream } from "@/lib/blob";

/** GET /api/templates/[slug] — stream file (public). ?view=1 = inline, else attachment. */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (!slug || slug.trim() === "") {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const [row] = await db
    .select()
    .from(templates)
    .where(eq(templates.slug, slug.trim()));

  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const stream = await getTemplateStream(row.storedFileName);
  if (!stream) {
    return NextResponse.json(
      { error: "File not found on storage" },
      { status: 404 }
    );
  }

  const viewOnline = request.nextUrl.searchParams.get("view") === "1";
  const disposition = viewOnline
    ? `inline; filename="${encodeURIComponent(row.displayName)}"`
    : `attachment; filename="${encodeURIComponent(row.displayName)}"`;

  const contentType = row.mimeType || "application/octet-stream";

  return new NextResponse(stream, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": disposition,
    },
  });
}
