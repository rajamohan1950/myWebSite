/**
 * Templates API tests. GET list (public), GET by slug (stream).
 * Run: npm test
 */
import { NextRequest } from "next/server";
import { GET as getList } from "@/app/api/templates/route";
import { GET as getSlug } from "@/app/api/templates/[slug]/route";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { templates } from "@/lib/db/schema";

jest.mock("@/lib/blob", () => ({
  getTemplateStream: jest.fn(),
}));

const { getTemplateStream } = require("@/lib/blob") as { getTemplateStream: jest.Mock };

describe("Templates API", () => {
  describe("GET /api/templates", () => {
    it("returns 200 and array (empty or with items)", async () => {
      const res = await getList();
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(Array.isArray(data)).toBe(true);
    });
  });

  describe("GET /api/templates/[slug]", () => {
    it("returns 400 for empty slug", async () => {
      const req = new NextRequest("http://localhost/api/templates/");
      const res = await getSlug(req, { params: Promise.resolve({ slug: "" }) });
      expect(res.status).toBe(400);
    });

    it("returns 404 for unknown slug", async () => {
      const req = new NextRequest("http://localhost/api/templates/no-such-slug");
      const res = await getSlug(req, { params: Promise.resolve({ slug: "no-such-slug" }) });
      expect(res.status).toBe(404);
    });

    it("returns 200 with stream when slug exists and blob has file", async () => {
      const slug = `cv-en-${Date.now()}`;
      await db.insert(templates).values({
        slug,
        displayName: "CV.pdf",
        storedFileName: "test-uuid.pdf",
        mimeType: "application/pdf",
        uploadedAt: new Date(),
      });
      getTemplateStream.mockResolvedValueOnce(
        new ReadableStream({ start(c) { c.close(); } })
      );
      const req = new NextRequest(`http://localhost/api/templates/${slug}`);
      const res = await getSlug(req, { params: Promise.resolve({ slug }) });
      expect(res.status).toBe(200);
      expect(res.headers.get("Content-Type")).toBeTruthy();
      expect(res.headers.get("Content-Disposition")).toMatch(/inline|attachment/);
      await db.delete(templates).where(eq(templates.slug, slug));
    });
  });
});
