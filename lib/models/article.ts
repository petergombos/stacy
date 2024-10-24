import { db } from "@/lib/db";
import {
  Article,
  articleHTML,
  articles,
  messages,
  NewArticle,
  NewMessage,
} from "@/lib/db/schema";
import { ArticleMetadata } from "@/schemas/article";
import { welcomeAssistantMessage } from "@/static/messages";
import { desc, eq, ne } from "drizzle-orm";
import { generateIdFromEntropySize } from "lucia";
import { requireProjectAccess } from "./project";

export const getArticle = async (articleId: string) => {
  const article = await db.query.articles.findFirst({
    where: eq(articles.id, articleId),
    with: {
      messages: {
        orderBy: messages.createdAt,
      },
      html: {
        orderBy: articleHTML.createdAt,
      },
      project: true,
    },
  });
  return article;
};

interface GetArticleOptions {
  with?: {
    messages?: boolean;
    html?: boolean;
  };
}

export const getArticles = async (options: GetArticleOptions = {}) => {
  const items = await db.query.articles.findMany({
    with: {
      messages: options.with?.messages ? true : undefined,
      html: options.with?.html ? true : undefined,
    },
    orderBy: desc(articles.createdAt),
  });
  return items;
};

export const createArticle = async (article?: Omit<NewArticle, "id">) => {
  const id = generateIdFromEntropySize(10);
  const [newArticle] = await db
    .insert(articles)
    .values({
      ...article,
      image:
        article?.image ||
        "https://g-p7fbcgixbe6.vusercontent.net/placeholder.svg",
      id,
    })
    .returning();
  await Promise.all([
    // Add initial empty html
    addHtmlToArticle(id, ""),
    // Add initial welcome message
    addMessageToArticle({
      ...welcomeAssistantMessage,
      articleId: id,
    }),
  ]);

  return newArticle;
};

export const getMessagesForArticle = async (articleId: string) => {
  const articleMessages = await db.query.messages.findMany({
    where: eq(messages.articleId, articleId),
    orderBy: messages.createdAt,
  });
  return articleMessages;
};

export const addMessageToArticle = async (message: Omit<NewMessage, "id">) => {
  const id = generateIdFromEntropySize(10);
  const [newMessage] = await db
    .insert(messages)
    .values({
      ...message,
      id,
    })
    .returning();
  return newMessage;
};

export const addHtmlToArticle = async (articleId: string, html: string) => {
  const [newHtml] = await db
    .insert(articleHTML)
    .values({
      id: generateIdFromEntropySize(10),
      html,
      articleId,
    })
    .returning();

  return newHtml;
};

export const updateArticleHtml = async (htmlId: string, html: string) => {
  const [updatedHtml] = await db
    .update(articleHTML)
    .set({ html })
    .where(eq(articleHTML.id, htmlId))
    .returning();
  return updatedHtml;
};

export const updateArticle = async (article: Article) => {
  const [updatedArticle] = await db
    .update(articles)
    .set(article)
    .where(eq(articles.id, article.id))
    .returning();
  return updatedArticle;
};

export const updateArticleMetadata = async (
  articleId: string,
  article: ArticleMetadata
) => {
  const [updatedArticle] = await db
    .update(articles)
    .set(article)
    .where(eq(articles.id, articleId))
    .returning();
  return updatedArticle;
};

export const updateArticleStatus = async (
  articleId: string,
  status: "draft" | "published"
) => {
  const [updatedArticle] = await db
    .update(articles)
    .set({
      status,
      publishedAt: status === "published" ? new Date() : null,
    })
    .where(eq(articles.id, articleId))
    .returning();

  return updatedArticle;
};

export const getArticleBySlug = async (slug: string) => {
  const article = await db.query.articles.findFirst({
    where: eq(articles.slug, slug),
    with: {
      html: true,
    },
  });

  if (!article) {
    return null;
  }

  return article;
};

export const getRecentArticles = async (
  currentArticleId: string,
  projectId: string,
  limit = 4
) => {
  const recentArticles = await db.query.articles.findMany({
    where: (article, { and, eq }) =>
      and(
        ne(article.id, currentArticleId),
        eq(article.projectId, projectId),
        eq(article.status, "published")
      ),
    orderBy: desc(articles.publishedAt),
    limit: limit,
  });

  return recentArticles;
};

export const getArticlesByProjectId = async (projectId: string) => {
  const items = await db.query.articles.findMany({
    where: eq(articles.projectId, projectId),
    orderBy: desc(articles.createdAt),
  });
  return items;
};

export const requireArticleAccess = async (
  articleId: string,
  userId: string
) => {
  const article = await db.query.articles.findFirst({
    where: eq(articles.id, articleId),
  });

  if (!article) {
    throw new Error("Article not found");
  }

  const projectId = article.projectId;

  if (!projectId) {
    throw new Error("Project not found");
  }

  return requireProjectAccess(projectId, userId);
};

export const requireArticleContentAccess = async (
  articleHTMLId: string,
  userId: string
) => {
  const articleContent = await db.query.articleHTML.findFirst({
    where: eq(articleHTML.id, articleHTMLId),
  });

  if (!articleContent || !articleContent.articleId) {
    throw new Error("Article content not found");
  }

  return requireArticleAccess(articleContent.articleId, userId);
};
