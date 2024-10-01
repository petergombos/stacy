"use server";

import {
  addMessageToArticle,
  createArticle,
  updateArticleHtml,
  updateArticleMetadata,
} from "@/lib/models/article";
import { actionClient } from "@/lib/safe-action";
import { articleMetadataSchema } from "@/schemas/article";
import { redirect } from "next/navigation";
import { z } from "zod";

export const createArticleAction = actionClient.action(async () => {
  const article = await createArticle();
  redirect(`/articles/composer/${article.id}`);
});

export const addMessageToArticleAction = actionClient
  .schema(
    z.object({
      articleId: z.string(),
      role: z.enum(["user", "system", "assistant"]),
      content: z.string(),
    })
  )
  .action(async ({ parsedInput }) => {
    await addMessageToArticle(parsedInput);
  });

export const updateArticleHtmlAction = actionClient
  .schema(z.object({ articleHTMLId: z.string(), html: z.string() }))
  .action(async ({ parsedInput }) => {
    await updateArticleHtml(parsedInput.articleHTMLId, parsedInput.html);
  });

export const updateArticleMetadataAction = actionClient
  .schema(
    z.object({
      articleId: z.string().min(10),
      metadata: articleMetadataSchema,
    })
  )
  .action(async ({ parsedInput }) => {
    await updateArticleMetadata(parsedInput.articleId, parsedInput.metadata);
  });
