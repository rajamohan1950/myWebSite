import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const CUSTOM_DOMAIN = "https://www.rajamohanjabbala.com";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  if (host.endsWith(".vercel.app")) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.host = "www.rajamohanjabbala.com";
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}
