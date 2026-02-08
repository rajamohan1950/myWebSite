/**
 * Resume file storage: Vercel Blob when BLOB_READ_WRITE_TOKEN is set, else local filesystem.
 */

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN?.trim() || undefined;

/** Throw a clear error when on Vercel but Blob is not configured. */
function ensureStorageConfigured(): void {
  if (process.env.VERCEL && !BLOB_TOKEN) {
    throw new Error(
      "Resume storage on Vercel requires BLOB_READ_WRITE_TOKEN. In Vercel Dashboard: Project → Storage → Create Database → Blob → copy the token → Project → Settings → Environment Variables → add BLOB_READ_WRITE_TOKEN, then redeploy."
    );
  }
}

export async function putResume(key: string, data: Buffer): Promise<void> {
  ensureStorageConfigured();
  if (BLOB_TOKEN) {
    const { put } = await import("@vercel/blob");
    await put(`resumes/${key}`, data, {
      access: "public",
      addRandomSuffix: false,
    });
    return;
  }
  const { mkdir, writeFile } = await import("fs/promises");
  const path = await import("path");
  const dir = process.env.UPLOADS_DIR
    ? path.join(process.env.UPLOADS_DIR, "uploads", "resumes")
    : path.join(process.cwd(), "uploads", "resumes");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, key), data);
}

export async function getResumeStream(
  key: string
): Promise<ReadableStream<Uint8Array> | null> {
  if (BLOB_TOKEN) {
    const { list } = await import("@vercel/blob");
    const prefix = "resumes/";
    const blobs = await list({ prefix, limit: 1000 });
    const match = blobs.blobs.find((b) => b.pathname === `resumes/${key}`);
    if (!match?.url) return null;
    const r = await fetch(match.url);
    if (!r.body) return null;
    return r.body;
  }
  const { createReadStream, existsSync } = await import("fs");
  const path = await import("path");
  const { Readable } = await import("stream");
  const dir = process.env.UPLOADS_DIR
    ? path.join(process.env.UPLOADS_DIR, "uploads", "resumes")
    : path.join(process.cwd(), "uploads", "resumes");
  const filePath = path.join(dir, key);
  if (!existsSync(filePath)) return null;
  const nodeStream = createReadStream(filePath);
  return Readable.toWeb(nodeStream) as ReadableStream<Uint8Array>;
}

export async function deleteResume(key: string): Promise<void> {
  if (BLOB_TOKEN) {
    const { list, del } = await import("@vercel/blob");
    const blobs = await list({ prefix: "resumes/", limit: 1000 });
    const match = blobs.blobs.find((b) => b.pathname === `resumes/${key}`);
    if (match?.url) await del(match.url);
    return;
  }
  const { unlink } = await import("fs/promises");
  const path = await import("path");
  const dir = process.env.UPLOADS_DIR
    ? path.join(process.env.UPLOADS_DIR, "uploads", "resumes")
    : path.join(process.cwd(), "uploads", "resumes");
  await unlink(path.join(dir, key)).catch(() => {});
}

export async function resumeExists(key: string): Promise<boolean> {
  if (BLOB_TOKEN) {
    const { list } = await import("@vercel/blob");
    const blobs = await list({ prefix: "resumes/", limit: 1000 });
    return blobs.blobs.some((b) => b.pathname === `resumes/${key}`);
  }
  const { existsSync } = await import("fs");
  const path = await import("path");
  const dir = process.env.UPLOADS_DIR
    ? path.join(process.env.UPLOADS_DIR, "uploads", "resumes")
    : path.join(process.cwd(), "uploads", "resumes");
  return existsSync(path.join(dir, key));
}

// --- Templates (separate blob store: BLOB_TEMPLATES_READ_WRITE_TOKEN) ---
const BLOB_TEMPLATES_TOKEN = process.env.BLOB_TEMPLATES_READ_WRITE_TOKEN?.trim() || undefined;

function ensureTemplatesStorageConfigured(): void {
  if (process.env.VERCEL && !BLOB_TEMPLATES_TOKEN) {
    throw new Error(
      "Template storage on Vercel requires BLOB_TEMPLATES_READ_WRITE_TOKEN. In Vercel Dashboard: Storage → your Templates Blob store → copy token → Settings → Environment Variables → add BLOB_TEMPLATES_READ_WRITE_TOKEN, then redeploy."
    );
  }
}

export async function putTemplate(key: string, data: Buffer): Promise<void> {
  ensureTemplatesStorageConfigured();
  if (BLOB_TEMPLATES_TOKEN) {
    const { put } = await import("@vercel/blob");
    await put(key, data, {
      access: "public",
      addRandomSuffix: false,
      token: BLOB_TEMPLATES_TOKEN,
    });
    return;
  }
  const { mkdir, writeFile } = await import("fs/promises");
  const path = await import("path");
  const dir = process.env.UPLOADS_DIR
    ? path.join(process.env.UPLOADS_DIR, "uploads", "templates")
    : path.join(process.cwd(), "uploads", "templates");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, key), data);
}

export async function getTemplateStream(
  key: string
): Promise<ReadableStream<Uint8Array> | null> {
  if (BLOB_TEMPLATES_TOKEN) {
    const { list } = await import("@vercel/blob");
    const blobs = await list({
      limit: 1000,
      token: BLOB_TEMPLATES_TOKEN,
    });
    const match = blobs.blobs.find((b) => b.pathname === key);
    if (!match?.url) return null;
    const r = await fetch(match.url);
    if (!r.body) return null;
    return r.body;
  }
  const { createReadStream, existsSync } = await import("fs");
  const path = await import("path");
  const { Readable } = await import("stream");
  const dir = process.env.UPLOADS_DIR
    ? path.join(process.env.UPLOADS_DIR, "uploads", "templates")
    : path.join(process.cwd(), "uploads", "templates");
  const filePath = path.join(dir, key);
  if (!existsSync(filePath)) return null;
  const nodeStream = createReadStream(filePath);
  return Readable.toWeb(nodeStream) as ReadableStream<Uint8Array>;
}

export async function deleteTemplate(key: string): Promise<void> {
  if (BLOB_TEMPLATES_TOKEN) {
    const { list, del } = await import("@vercel/blob");
    const blobs = await list({
      limit: 1000,
      token: BLOB_TEMPLATES_TOKEN,
    });
    const match = blobs.blobs.find((b) => b.pathname === key);
    if (match?.url) await del(match.url);
    return;
  }
  const { unlink } = await import("fs/promises");
  const path = await import("path");
  const dir = process.env.UPLOADS_DIR
    ? path.join(process.env.UPLOADS_DIR, "uploads", "templates")
    : path.join(process.cwd(), "uploads", "templates");
  await unlink(path.join(dir, key)).catch(() => {});
}
