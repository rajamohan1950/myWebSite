import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { resumes } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { isAuthenticated, COOKIE_NAME } from "@/lib/resumes-auth";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const UPLOAD_DIR = process.env.UPLOADS_DIR
  ? path.join(process.env.UPLOADS_DIR, "uploads", "resumes")
  : path.join(process.cwd(), "uploads", "resumes");

async function ensureUploadDir() {
  await mkdir(UPLOAD_DIR, { recursive: true });
}

export async function GET() {
  const password = process.env.RESUMES_PASSWORD;
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
  const password = process.env.RESUMES_PASSWORD;
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
  } catch {
    return NextResponse.json({ error: "Invalid form" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { error: "No file uploaded (use field name 'file')" },
      { status: 400 }
    );
  }

  const name = file.name.trim() || "resume";
  const ext = path.extname(name) || ".pdf";
  const allowed = [".pdf", ".doc", ".docx"];
  if (!allowed.includes(ext.toLowerCase())) {
    return NextResponse.json(
      { error: "Only PDF and Word documents allowed" },
      { status: 400 }
    );
  }

  await ensureUploadDir();
  const storedFileName = `${randomUUID()}${ext}`;
  const filePath = path.join(UPLOAD_DIR, storedFileName);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  const [inserted] = await db
    .insert(resumes)
    .values({
      displayName: name,
      storedFileName,
      mimeType: file.type || null,
      uploadedAt: new Date(),
    })
    .returning();

  return NextResponse.json(inserted, { status: 201 });
}
