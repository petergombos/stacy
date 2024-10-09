import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const projects = sqliteTable("projects", {
  name: text("name").notNull(),
  niche: text("niche").notNull(),
  shortDescription: text("short_description").notNull(),
  fullContext: text("full_context").notNull(),
  slug: text("slug"),
  domain: text("domain"),

  // Meta
  id: text("id").primaryKey(),
  createdAt: integer("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: integer("updated_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export const projectRelations = relations(projects, ({ many }) => ({
  articles: many(articles),
  apiTokens: many(apiTokens),
}));

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export const articles = sqliteTable("articles", {
  title: text("title"),
  description: text("description"),
  slug: text("slug").unique(),
  keywords: text("keywords"),
  status: text("status", { enum: ["draft", "published"] })
    .default("draft")
    .notNull(),
  authorName: text("author_name"),
  image: text("image").default("").notNull(),
  publishedAt: integer("published_at", { mode: "timestamp" }),

  // Meta
  id: text("id").primaryKey(),
  updatedAt: integer("updated_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull()
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
  createdAt: integer("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),

  // Relations
  projectId: text("project_id").references(() => projects.id, {
    onDelete: "cascade",
  }),
});

export const articleRelations = relations(articles, ({ many, one }) => ({
  messages: many(messages),
  html: many(articleHTML),
  project: one(projects, {
    fields: [articles.projectId],
    references: [projects.id],
  }),
}));

export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;

export const articleHTML = sqliteTable("article_html", {
  html: text("html").notNull().default(""),

  // Meta
  id: text("id").primaryKey(),
  createdAt: integer("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: integer("updated_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
    .notNull(),

  // Relations
  articleId: text("article_id").references(() => articles.id, {
    onDelete: "cascade",
  }),
});

export const articleHTMLRelations = relations(articleHTML, ({ one }) => ({
  article: one(articles, {
    fields: [articleHTML.articleId],
    references: [articles.id],
  }),
}));

export type ArticleHTML = typeof articleHTML.$inferSelect;
export type NewArticleHTML = typeof articleHTML.$inferInsert;

export const messages = sqliteTable("messages", {
  content: text("content").default("").notNull(),
  role: text("role", { enum: ["user", "assistant", "system"] })
    .default("user")
    .notNull(),

  // Meta
  id: text("id").primaryKey(),
  createdAt: integer("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: integer("updated_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
    .notNull(),

  // Relations
  articleId: text("article_id").references(() => articles.id, {
    onDelete: "cascade",
  }),
});

export const messageRelations = relations(messages, ({ one }) => ({
  article: one(articles, {
    fields: [messages.articleId],
    references: [articles.id],
  }),
}));

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;

export const apiTokens = sqliteTable("api_tokens", {
  token: text("token").primaryKey(),
  projectId: text("project_id")
    .references(() => projects.id, {
      onDelete: "cascade",
    })
    .notNull(),
  isValid: integer("is_valid", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: integer("updated_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export const apiTokenRelations = relations(apiTokens, ({ one }) => ({
  project: one(projects, {
    fields: [apiTokens.projectId],
    references: [projects.id],
  }),
}));

export type ApiToken = typeof apiTokens.$inferSelect;
export type NewApiToken = typeof apiTokens.$inferInsert;
