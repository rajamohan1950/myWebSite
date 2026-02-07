#!/usr/bin/env node
/**
 * Test resume upload: auth then POST one file and multiple files.
 * Run: node scripts/test-resume-upload.mjs
 * Requires: server running on http://localhost:5001, RESUMES_PASSWORD in .env
 */
const BASE = "http://localhost:5001";

async function main() {
  const password = process.env.RESUMES_PASSWORD || "123456";

  // 1. Auth
  const authRes = await fetch(`${BASE}/api/resumes/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
    redirect: "manual",
  });
  if (!authRes.ok) {
    console.error("Auth failed:", authRes.status, await authRes.text());
    process.exit(1);
  }
  const cookies = authRes.headers.get("set-cookie") || "";
  console.log("Auth OK");

  // 2. Upload single file
  const single = new Blob(["%PDF-1.4 minimal"], { type: "application/pdf" });
  const singleFd = new FormData();
  singleFd.append("file", single, "test-single.pdf");

  const upload1 = await fetch(`${BASE}/api/resumes`, {
    method: "POST",
    body: singleFd,
    headers: { Cookie: cookies.split(";")[0] },
  });
  if (!upload1.ok) {
    console.error("Single upload failed:", upload1.status, await upload1.text());
    process.exit(1);
  }
  const data1 = await upload1.json();
  console.log("Single upload OK:", data1.displayName || data1.added?.[0]?.displayName);

  // 3. Upload multiple files
  const multiFd = new FormData();
  multiFd.append("file", new Blob(["%PDF-1.4 multi1"], { type: "application/pdf" }), "test-multi-1.pdf");
  multiFd.append("file", new Blob(["%PDF-1.4 multi2"], { type: "application/pdf" }), "test-multi-2.pdf");

  const upload2 = await fetch(`${BASE}/api/resumes`, {
    method: "POST",
    body: multiFd,
    headers: { Cookie: cookies.split(";")[0] },
  });
  if (!upload2.ok) {
    console.error("Multi upload failed:", upload2.status, await upload2.text());
    process.exit(1);
  }
  const data2 = await upload2.json();
  const added = data2.added || [data2];
  console.log("Multi upload OK:", added.length, "files:", added.map((a) => a.displayName).join(", "));
  console.log("All resume upload tests passed.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
