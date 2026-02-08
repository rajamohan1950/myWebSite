import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const profile = sqliteTable("profile", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  headline: text("headline"),
  bio: text("bio"),
  imageUrl: text("image_url"),
  linkedinUrl: text("linkedin_url"),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

export type Profile = typeof profile.$inferSelect;
export type NewProfile = typeof profile.$inferInsert;

export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  category: text("category"),
  publishedAt: integer("published_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;

export const mediumArticles = sqliteTable("medium_articles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  mediumId: text("medium_id").notNull().unique(),
  title: text("title").notNull(),
  link: text("link").notNull(),
  excerpt: text("excerpt"),
  category: text("category"),
  publishedAt: integer("published_at", { mode: "timestamp" }).notNull(),
  syncedAt: integer("synced_at", { mode: "timestamp" }).notNull(),
});

export type MediumArticle = typeof mediumArticles.$inferSelect;
export type NewMediumArticle = typeof mediumArticles.$inferInsert;

export const resumes = sqliteTable("resumes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  displayName: text("display_name").notNull(),
  storedFileName: text("stored_file_name").notNull(),
  mimeType: text("mime_type"),
  uploadedAt: integer("uploaded_at", { mode: "timestamp" }).notNull(),
});

export type Resume = typeof resumes.$inferSelect;
export type NewResume = typeof resumes.$inferInsert;

export const templates = sqliteTable("templates", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  displayName: text("display_name").notNull(),
  storedFileName: text("stored_file_name").notNull(),
  mimeType: text("mime_type"),
  uploadedAt: integer("uploaded_at", { mode: "timestamp" }).notNull(),
  viewCount: integer("view_count").default(0).notNull(),
  downloadCount: integer("download_count").default(0).notNull(),
  shareCount: integer("share_count").default(0).notNull(),
});

export type Template = typeof templates.$inferSelect;
export type NewTemplate = typeof templates.$inferInsert;
