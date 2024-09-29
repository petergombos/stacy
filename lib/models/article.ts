import { db } from "@/lib/db";
import { articles, NewArticle } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { generateIdFromEntropySize } from "lucia";

interface GetArticleOptions {
  with?: {
    messages?: boolean;
    html?: boolean;
  };
}

export const getArticle = async (
  articleId: string,
  options: GetArticleOptions = {}
) => {
  const article = await db.query.articles.findFirst({
    where: eq(articles.id, articleId),
    with: {
      messages: options.with?.messages ? true : undefined,
      html: options.with?.html ? true : undefined,
    },
  });
  return article;
};

export const getArticles = async (options: GetArticleOptions = {}) => {
  const articles = await db.query.articles.findMany({
    with: {
      messages: options.with?.messages ? true : undefined,
      html: options.with?.html ? true : undefined,
    },
  });
  return articles;
};

export const createArticle = async (article?: Partial<NewArticle>) => {
  const id = generateIdFromEntropySize(10);
  const [newArticle] = await db
    .insert(articles)
    .values({
      ...article,
      id,
    })
    .returning();
  return newArticle;
};
