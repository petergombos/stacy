"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  addMessageToArticle,
  createArticle,
  updateArticleHtml,
  updateArticleMetadata,
  updateArticleStatus,
} from "~/lib/models/article";
import { actionClient } from "~/lib/safe-action";
import { articleMetadataSchema } from "~/schemas/article";

export const createArticleAction = actionClient.action(async () => {
  const article = await createArticle();
  revalidatePath("/");
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
    const result = await addMessageToArticle(parsedInput);
    revalidatePath("/");
    return result;
  });

export const updateArticleHtmlAction = actionClient
  .schema(z.object({ articleHTMLId: z.string(), html: z.string() }))
  .action(async ({ parsedInput }) => {
    const result = await updateArticleHtml(
      parsedInput.articleHTMLId,
      parsedInput.html
    );
    revalidatePath("/");
    return result;
  });

export const updateArticleMetadataAction = actionClient
  .schema(
    z.object({
      articleId: z.string().min(10),
      metadata: articleMetadataSchema,
    })
  )
  .action(async ({ parsedInput }) => {
    const result = await updateArticleMetadata(
      parsedInput.articleId,
      parsedInput.metadata
    );
    revalidatePath("/");
    return result;
  });

export const updateArticleStatusAction = actionClient
  .schema(
    z.object({
      articleId: z.string().min(10),
      status: z.enum(["draft", "published"]),
    })
  )
  .action(async ({ parsedInput }) => {
    const result = await updateArticleStatus(
      parsedInput.articleId,
      parsedInput.status
    );
    revalidatePath("/");
    return result;
  });
