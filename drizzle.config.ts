import { defineConfig } from "drizzle-kit";

const useTurso =
  process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN;

export default defineConfig(
  useTurso
    ? {
        schema: "./lib/db/schema.ts",
        out: "./drizzle",
        dialect: "turso",
        dbCredentials: {
          url: process.env.TURSO_DATABASE_URL!,
          authToken: process.env.TURSO_AUTH_TOKEN!,
        },
      }
    : {
        schema: "./lib/db/schema.ts",
        out: "./drizzle",
        dialect: "sqlite",
        dbCredentials: {
          url: process.env.DATABASE_URL ?? "local.db",
        },
      }
);
