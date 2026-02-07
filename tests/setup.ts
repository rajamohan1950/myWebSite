// Ensure test DB is used (also set via npm script DATABASE_URL=test.db)
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "test.db";
}
