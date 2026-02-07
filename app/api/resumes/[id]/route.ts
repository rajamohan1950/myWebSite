import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { resumes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { isAuthenticated, COOKIE_NAME } from "@/lib/resumes-auth";
import { createReadStream, existsSync, unlink } from "fs";
import path from "path";
import { Readable } from "stream";
import { promisify } from "util";

const unlinkAsync = promisify(unlink);
const UPLOAD_DIR = process.env.UPLOADS_DIR
  ? path.join(process.env.UPLOADS_DIR, "uploads", "resumes")
  : path.join(process.cwd(), "uploads", "resumes");

async function requireAuth() {
  const password = process.env.RESUMES_PASSWORD;
  if (!password) return { error: NextResponse.json({ error: "Resumes not configured" }, { status: 503 }) };
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!isAuthenticated(token)) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  return {};
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

  const { id } = await params;
  const idNum = parseInt(id, 10);
  if (Number.isNaN(idNum)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const [row] = await db
    .select()
    .from(resumes)
    .where(eq(resumes.id, idNum));

  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const filePath = path.join(UPLOAD_DIR, row.storedFileName);
  if (!existsSync(filePath)) {
    return NextResponse.json({ error: "File not found on disk" }, { status: 404 });
  }

  const viewOnline = request.nextUrl.searchParams.get("view") === "1";
  const disposition = viewOnline
    ? `inline; filename="${encodeURIComponent(row.displayName)}"`
    : `attachment; filename="${encodeURIComponent(row.displayName)}"`;

  const nodeStream = createReadStream(filePath);
  const webStream = Readable.toWeb(nodeStream) as ReadableStream;
  const contentType = row.mimeType || "application/octet-stream";

  return new NextResponse(webStream, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": disposition,
    },
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { id } = await params;
  const idNum = parseInt(id, 10);
  if (Number.isNaN(idNum)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  let body: { displayName?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const displayName = typeof body.displayName === "string" ? body.displayName.trim() : null;
  if (!displayName) {
    return NextResponse.json({ error: "displayName required" }, { status: 400 });
  }

  const [updated] = await db
    .update(resumes)
    .set({ displayName })
    .where(eq(resumes.id, idNum))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { id } = await params;
  const idNum = parseInt(id, 10);
  if (Number.isNaN(idNum)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const [row] = await db.select().from(resumes).where(eq(resumes.id, idNum));
  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const filePath = path.join(UPLOAD_DIR, row.storedFileName);
  if (existsSync(filePath)) {
    await unlinkAsync(filePath).catch(() => {});
  }

  await db.delete(resumes).where(eq(resumes.id, idNum));
  return NextResponse.json({ ok: true });
}
