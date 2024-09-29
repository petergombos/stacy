import { db } from "@/lib/db";
import {
  articleHTML,
  articles,
  messages,
  NewArticle,
  NewMessage,
} from "@/lib/db/schema";
import { welcomeAssistantMessage } from "@/static/messages";
import { eq } from "drizzle-orm";
import { generateIdFromEntropySize } from "lucia";

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
  const articles = await db.query.articles.findMany({
    with: {
      messages: options.with?.messages ? true : undefined,
      html: options.with?.html ? true : undefined,
    },
  });
  return articles;
};

export const createArticle = async (article?: Omit<NewArticle, "id">) => {
  const id = generateIdFromEntropySize(10);
  const [newArticle] = await db
    .insert(articles)
    .values({
      ...article,
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
