import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { resumes } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { isAuthenticated, COOKIE_NAME, normalizeEnvPassword } from "@/lib/resumes-auth";
import { putResume } from "@/lib/blob";
import { randomUUID } from "crypto";
import path from "path";

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
  if (value instanceof File) return value.name?.trim() || "resume";
  return (value as Blob & { name?: string }).name?.trim() || "resume";
}

export async function GET() {
  const password = normalizeEnvPassword(process.env.RESUMES_PASSWORD);
  if (!password) {
    return NextResponse.json(
      { error: "Resumes not configured" },
      { status: 503 }
    );
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!isAuthenticated(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const list = await db
    .select({
      id: resumes.id,
      displayName: resumes.displayName,
      uploadedAt: resumes.uploadedAt,
    })
    .from(resumes)
    .orderBy(desc(resumes.uploadedAt));

  return NextResponse.json(list);
}

export async function POST(request: NextRequest) {
  const password = normalizeEnvPassword(process.env.RESUMES_PASSWORD);
  if (!password) {
    return NextResponse.json(
      { error: "Resumes not configured" },
      { status: 503 }
    );
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!isAuthenticated(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch (e) {
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

  const allowed = [".pdf", ".doc", ".docx"];
  const inserted: { id: number; displayName: string; uploadedAt: string }[] = [];

  for (const file of files) {
    const name = getFileName(file) || "resume";
    const ext = path.extname(name) || ".pdf";
    if (!allowed.includes(ext.toLowerCase())) continue;

    const storedFileName = `${randomUUID()}${ext}`;
    let buffer: Buffer;
    try {
      buffer = Buffer.from(await (file as File | Blob).arrayBuffer());
    } catch {
      continue;
    }
    try {
      await putResume(storedFileName, buffer);
    } catch (err) {
      console.error("putResume error:", err);
      return NextResponse.json(
        { error: "Storage failed. Check BLOB_READ_WRITE_TOKEN or UPLOADS_DIR." },
        { status: 500 }
      );
    }

    const [row] = await db
      .insert(resumes)
      .values({
        displayName: name,
        storedFileName,
        mimeType: file.type || null,
        uploadedAt: new Date(),
      })
      .returning();

    if (row) {
      inserted.push({
        id: row.id,
        displayName: row.displayName,
        uploadedAt: row.uploadedAt instanceof Date ? row.uploadedAt.toISOString() : String(row.uploadedAt),
      });
    }
  }

  if (inserted.length === 0) {
    return NextResponse.json(
      { error: "Only PDF and Word documents allowed" },
      { status: 400 }
    );
  }

  return NextResponse.json(inserted.length === 1 ? inserted[0] : { added: inserted }, { status: 201 });
}
