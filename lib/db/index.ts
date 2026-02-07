import * as schema from "./schema";

// Use Turso on Vercel (TURSO_* set); otherwise SQLite (local/Railway/Render).
const rawUrl = process.env.TURSO_DATABASE_URL ?? "";
const rawToken = process.env.TURSO_AUTH_TOKEN ?? "";
const tursoUrl = rawUrl.replace(/\\n\s*$|\s+$/g, "").trim();
const tursoToken = rawToken.replace(/\\n\s*$|\s+$/g, "").trim();
const useTurso =
  typeof tursoUrl === "string" &&
  tursoUrl.length > 0 &&
  typeof tursoToken === "string" &&
  tursoToken.length > 0;

function createDb() {
  if (useTurso) {
    const { createClient } = require("@libsql/client");
    const { drizzle } = require("drizzle-orm/libsql");
    const client = createClient({
      url: tursoUrl!,
      authToken: tursoToken!,
    });
    return drizzle({ client, schema });
  }
  const Database = require("better-sqlite3");
  const { drizzle } = require("drizzle-orm/better-sqlite3");
  const sqlite = new Database(process.env.DATABASE_URL ?? "local.db");
  return drizzle(sqlite, { schema });
}

export const db = createDb();
