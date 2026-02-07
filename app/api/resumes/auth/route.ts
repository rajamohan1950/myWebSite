import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  COOKIE_NAME,
  getExpectedToken,
  tokenFromPassword,
} from "@/lib/resumes-auth";

export async function POST(request: NextRequest) {
  const password = process.env.RESUMES_PASSWORD;
  if (!password) {
    return NextResponse.json(
      { error: "Resumes not configured (missing RESUMES_PASSWORD)" },
      { status: 503 }
    );
  }

  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const submitted = body.password;
  if (typeof submitted !== "string" || submitted.trim() === "") {
    return NextResponse.json({ error: "Password required" }, { status: 400 });
  }

  const expected = getExpectedToken();
  const token = tokenFromPassword(submitted);
  if (token !== expected) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return NextResponse.json({ ok: true });
}
