import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const articles = sqliteTable("articles", {
  id: text("id").primaryKey(),
  title: text("title"),
  description: text("description"),
  slug: text("slug").unique(),
  keywords: text("keywords"),
  status: text("status", { enum: ["draft", "published"] })
    .default("draft")
    .notNull(),
  authorName: text("author_name"),
  image: text("image")
    .default("https://g-p7fbcgixbe6.vusercontent.net/placeholder.svg")
    .notNull(),
  publishedAt: integer("published_at", { mode: "timestamp_ms" }),
  updatedAt: integer("last_updated_at", { mode: "timestamp_ms" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull()
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),

  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const articleRelations = relations(articles, ({ many }) => ({
  messages: many(messages),
  html: many(articleHTML),
}));

export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;

export const articleHTML = sqliteTable("article_html", {
  id: text("id").primaryKey(),
  html: text("html"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
    .notNull(),

  // Relations
  // Add cascade delete
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
  id: text("id").primaryKey(),
  content: text("content"),
  role: text("role", { enum: ["user", "assistant", "system"] }).default("user"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`CURRENT_TIMESTAMP`)
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
