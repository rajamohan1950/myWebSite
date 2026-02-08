import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { templates } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { putTemplate } from "@/lib/blob";
import { randomUUID } from "crypto";
import path from "path";

const ALLOWED_EXT = [".pdf", ".doc", ".docx", ".html", ".htm"];
const MIME: Record<string, string> = {
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".html": "text/html",
  ".htm": "text/html",
};

type FileLike = File | (Blob & { name?: string });
function isFileLike(value: unknown): value is FileLike {
  return (
    value instanceof File ||
    (typeof value === "object" &&
      value !== null &&
      "arrayBuffer" in value &&
      typeof (value as Blob).arrayBuffer === "function")
  );
}
function getFileName(value: FileLike): string {
  if (value instanceof File) return value.name?.trim() || "template";
  return (value as Blob & { name?: string }).name?.trim() || "template";
}

function slugify(name: string): string {
  const base = path.basename(name, path.extname(name)) || "doc";
  return base
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "doc";
}

/** Ensure unique slug: if exists, append -2, -3, ... */
async function uniqueSlug(base: string): Promise<string> {
  let slug = base;
  let n = 2;
  while (true) {
    const [existing] = await db.select().from(templates).where(eq(templates.slug, slug));
    if (!existing) return slug;
    slug = `${base}-${n}`;
    n += 1;
  }
}

/** GET /api/templates — list all (public) */
export async function GET() {
  const list = await db
    .select({
      id: templates.id,
      slug: templates.slug,
      displayName: templates.displayName,
      mimeType: templates.mimeType,
      uploadedAt: templates.uploadedAt,
      viewCount: templates.viewCount,
      downloadCount: templates.downloadCount,
      shareCount: templates.shareCount,
    })
    .from(templates)
    .orderBy(desc(templates.uploadedAt));
  return NextResponse.json(list);
}

/** POST /api/templates — upload (public, no auth; templates are separate from resumes) */
export async function POST(request: NextRequest) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form" }, { status: 400 });
  }

  const fileList = formData.getAll("file");
  const files = fileList.filter(isFileLike) as FileLike[];
  if (files.length === 0) {
    return NextResponse.json(
      { error: "No files uploaded (use field name 'file')" },
      { status: 400 }
    );
  }

  const inserted: { id: number; slug: string; displayName: string; uploadedAt: string }[] = [];

  for (const file of files) {
    const name = getFileName(file) || "template";
    const ext = path.extname(name).toLowerCase();
    if (!ALLOWED_EXT.includes(ext)) continue;

    const baseSlug = slugify(name);
    const slug = await uniqueSlug(baseSlug);
    const storedFileName = `${randomUUID()}${ext}`;
    let buffer: Buffer;
    try {
      buffer = Buffer.from(await (file as File | Blob).arrayBuffer());
    } catch {
      continue;
    }
    try {
      await putTemplate(storedFileName, buffer);
    } catch (err) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : "Storage failed. Add BLOB_TEMPLATES_READ_WRITE_TOKEN in Vercel (Settings → Environment Variables) and redeploy.";
      console.error("putTemplate error:", err);
      return NextResponse.json({ error: message }, { status: 500 });
    }

    const [row] = await db
      .insert(templates)
      .values({
        slug,
        displayName: name,
        storedFileName,
        mimeType: MIME[ext] || null,
        uploadedAt: new Date(),
      })
      .returning();

    if (row) {
      inserted.push({
        id: row.id,
        slug: row.slug,
        displayName: row.displayName,
        uploadedAt: row.uploadedAt instanceof Date ? row.uploadedAt.toISOString() : String(row.uploadedAt),
      });
    }
  }

  if (inserted.length === 0) {
    return NextResponse.json(
      { error: "Only PDF, Word (.doc/.docx), and HTML allowed." },
      { status: 400 }
    );
  }

  return NextResponse.json(inserted.length === 1 ? inserted[0] : { added: inserted }, { status: 201 });
}
