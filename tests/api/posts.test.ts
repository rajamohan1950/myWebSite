/**
 * Posts API tests. Uses test.db (see TESTING.md).
 * Run: npm test
 */
import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/posts/route";
import { PATCH, DELETE } from "@/app/api/posts/[id]/route";

const BASE = "http://localhost:5001";

function nextRequest(url: string, init?: { method?: string; body?: string }) {
  return new NextRequest(url, {
    method: init?.method ?? "GET",
    body: init?.body,
    headers: init?.body ? { "Content-Type": "application/json" } : undefined,
  });
}

describe("Posts API", () => {
  const slug = `test-${Date.now()}`;
  let createdId: number;

  describe("POST /api/posts", () => {
    it("returns 400 when title is missing", async () => {
      const res = await POST(
        nextRequest(`${BASE}/api/posts`, {
          method: "POST",
          body: JSON.stringify({ content: "x" }),
        })
      );
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toMatch(/title/i);
    });

    it("creates a draft post and returns it", async () => {
      const res = await POST(
        nextRequest(`${BASE}/api/posts`, {
          method: "POST",
          body: JSON.stringify({
            title: "Test Post",
            slug,
            excerpt: "Test excerpt",
            content: "Hello **world**",
            category: "Testing",
          }),
        })
      );
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.title).toBe("Test Post");
      expect(data.slug).toBe(slug);
      expect(data.excerpt).toBe("Test excerpt");
      expect(data.content).toBe("Hello **world**");
      expect(data.category).toBe("Testing");
      expect(data.publishedAt).toBeNull();
      expect(data.id).toBeDefined();
      createdId = data.id;
    });

    it("creates a published post when publishedAt is set", async () => {
      const slug2 = `test-pub-${Date.now()}`;
      const res = await POST(
        nextRequest(`${BASE}/api/posts`, {
          method: "POST",
          body: JSON.stringify({
            title: "Published Post",
            slug: slug2,
            content: "Published content",
            publishedAt: new Date().toISOString(),
          }),
        })
      );
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.publishedAt).not.toBeNull();
    });
  });

  describe("GET /api/posts?id=", () => {
    it("returns post by id", async () => {
      const res = await GET(nextRequest(`${BASE}/api/posts?id=${createdId}`));
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.id).toBe(createdId);
      expect(data.slug).toBe(slug);
    });

    it("returns 400 for invalid id", async () => {
      const res = await GET(nextRequest(`${BASE}/api/posts?id=abc`));
      expect(res.status).toBe(400);
    });

    it("returns 404 for non-existent id", async () => {
      const res = await GET(nextRequest(`${BASE}/api/posts?id=999999`));
      expect(res.status).toBe(404);
    });
  });

  describe("GET /api/posts?slug=", () => {
    it("returns post by slug", async () => {
      const res = await GET(nextRequest(`${BASE}/api/posts?slug=${slug}`));
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.slug).toBe(slug);
      expect(data.title).toBe("Test Post");
    });

    it("returns 404 for non-existent slug", async () => {
      const res = await GET(nextRequest(`${BASE}/api/posts?slug=no-such-slug`));
      expect(res.status).toBe(404);
    });
  });

  describe("GET /api/posts (list)", () => {
    it("returns all posts", async () => {
      const res = await GET(nextRequest(`${BASE}/api/posts`));
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThanOrEqual(1);
    });

    it("returns only published when publishedOnly=1", async () => {
      const res = await GET(nextRequest(`${BASE}/api/posts?publishedOnly=1`));
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(Array.isArray(data)).toBe(true);
      data.forEach((p: { publishedAt: unknown }) => expect(p.publishedAt).not.toBeNull());
    });
  });

  describe("PATCH /api/posts/[id]", () => {
    it("updates post and returns it", async () => {
      const res = await PATCH(
        nextRequest(`${BASE}/api/posts/${createdId}`, {
          method: "PATCH",
          body: JSON.stringify({
            title: "Updated Title",
            content: "Updated content",
            publishedAt: new Date().toISOString(),
          }),
        }),
        { params: Promise.resolve({ id: String(createdId) }) }
      );
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.title).toBe("Updated Title");
      expect(data.content).toBe("Updated content");
      expect(data.publishedAt).not.toBeNull();
    });

    it("returns 404 for non-existent id", async () => {
      const res = await PATCH(
        nextRequest(`${BASE}/api/posts/999999`, {
          method: "PATCH",
          body: JSON.stringify({ title: "X" }),
        }),
        { params: Promise.resolve({ id: "999999" }) }
      );
      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /api/posts/[id]", () => {
    it("deletes post and returns ok", async () => {
      const res = await DELETE(
        nextRequest(`${BASE}/api/posts/${createdId}`, { method: "DELETE" }),
        { params: Promise.resolve({ id: String(createdId) }) }
      );
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.ok).toBe(true);
    });

    it("returns 404 when deleting again", async () => {
      const res = await DELETE(
        nextRequest(`${BASE}/api/posts/${createdId}`, { method: "DELETE" }),
        { params: Promise.resolve({ id: String(createdId) }) }
      );
      expect(res.status).toBe(404);
    });
  });
});
