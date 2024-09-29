import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const articles = sqliteTable("articles", {
  id: text("id").primaryKey(),
  title: text("title"),
  description: text("description"),
  slug: text("slug").unique(),
  keywords: text("keywords"),
  status: text("status", { enum: ["draft", "published"] }).default("draft"),
  authorName: text("author_name"),
  publishedAt: integer("published_at", { mode: "timestamp_ms" }),
  updatedAt: integer("last_updated_at", { mode: "timestamp_ms" }).default(
    sql`CURRENT_TIMESTAMP`
  ),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).default(
    sql`CURRENT_TIMESTAMP`
  ),

  // Relations
  html: text("html").references(() => articleHTML.id),
});

export const articleRelations = relations(articles, ({ one }) => ({
  html: one(articleHTML, {
    fields: [articles.html],
    references: [articleHTML.id],
  }),
}));

export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;

export const articleHTML = sqliteTable("article_html", {
  id: text("id").primaryKey(),
  html: text("html"),
  version: integer("version").default(1),
});

export const articleHTMLRelations = relations(articleHTML, ({ one }) => ({
  article: one(articles, {
    fields: [articleHTML.id],
    references: [articles.html],
  }),
}));

export type ArticleHTML = typeof articleHTML.$inferSelect;
export type NewArticleHTML = typeof articleHTML.$inferInsert;
