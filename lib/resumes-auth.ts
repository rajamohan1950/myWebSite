import { createHash } from "crypto";

const COOKIE_NAME = "resumes_access";
const SALT = "resumes-private-folder";

export function normalizeEnvPassword(raw: string | undefined): string {
  if (raw == null) return "";
  let s = raw.trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1).trim();
  }
  return s;
}

export function getExpectedToken(): string {
  const password = normalizeEnvPassword(process.env.RESUMES_PASSWORD);
  if (!password) return "";
  return createHash("sha256").update(password + SALT).digest("hex");
}

export function tokenFromPassword(password: string): string {
  return createHash("sha256").update(password + SALT).digest("hex");
}

export function isAuthenticated(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false;
  return cookieValue === getExpectedToken() && getExpectedToken() !== "";
}

export { COOKIE_NAME };
