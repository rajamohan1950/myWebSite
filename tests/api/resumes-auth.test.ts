/**
 * Resumes auth API tests. Mocks next/headers cookies.
 * Run: npm test
 */
import { NextRequest } from "next/server";
import { POST } from "@/app/api/resumes/auth/route";

const mockSet = jest.fn();
jest.mock("next/headers", () => ({
  cookies: jest.fn(() => Promise.resolve({ set: mockSet })),
}));

function nextRequest(body: object) {
  return new NextRequest("http://localhost:5001/api/resumes/auth", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("Resumes auth API", () => {
  const origEnv = process.env.RESUMES_PASSWORD;

  afterEach(() => {
    process.env.RESUMES_PASSWORD = origEnv;
    mockSet.mockClear();
  });

  it("returns 503 when RESUMES_PASSWORD is not set", async () => {
    delete process.env.RESUMES_PASSWORD;
    const res = await POST(nextRequest({ password: "123456" }));
    expect(res.status).toBe(503);
    const data = await res.json();
    expect(data.error).toMatch(/not configured|missing/i);
  });

  it("returns 400 when password is missing", async () => {
    process.env.RESUMES_PASSWORD = "123456";
    const res = await POST(nextRequest({}));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/required|password/i);
  });

  it("returns 401 for wrong password", async () => {
    process.env.RESUMES_PASSWORD = "123456";
    const res = await POST(nextRequest({ password: "wrong" }));
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toMatch(/invalid|password/i);
  });

  it("returns 200 and sets cookie for correct password", async () => {
    process.env.RESUMES_PASSWORD = "123456";
    const res = await POST(nextRequest({ password: "123456" }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(mockSet).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.objectContaining({ path: "/", maxAge: 60 * 60 * 24 * 7 })
    );
  });

  it("accepts password with leading/trailing spaces when env matches trim", async () => {
    process.env.RESUMES_PASSWORD = "  123456  ";
    const res = await POST(nextRequest({ password: "123456" }));
    expect(res.status).toBe(200);
    expect((await res.json()).ok).toBe(true);
  });
});
