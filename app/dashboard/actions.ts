"use server";

import {
  addMessageToArticle,
  createArticle,
  updateArticleHtml,
} from "@/lib/models/article";
import { actionClient } from "@/lib/safe-action";
import { redirect } from "next/navigation";
import { z } from "zod";

export const createArticleAction = actionClient.action(async () => {
  const article = await createArticle();
  redirect(`/editor/${article.id}`);
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
