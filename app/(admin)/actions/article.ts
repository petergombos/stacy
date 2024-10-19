"use server";

import {
  addMessageToArticle,
  createArticle,
  requireArticleAccess,
  requireArticleContentAccess,
  updateArticleHtml,
  updateArticleMetadata,
  updateArticleStatus,
} from "@/lib/models/article";
import { requireProjectAccess } from "@/lib/models/project";
import { authActionClient } from "@/lib/safe-action";
import { articleMetadataSchema } from "@/schemas/article";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export const createArticleAction = authActionClient
  .schema(
    z.object({
      projectId: z.string().min(1),
    })
  )
  .action(async ({ parsedInput: { projectId }, ctx: { userId } }) => {
    await requireProjectAccess(projectId, userId);
    const article = await createArticle({ projectId });
    revalidatePath("/");
    redirect(`/projects/${projectId}/articles/composer/${article.id}`);
  });

export const addMessageToArticleAction = authActionClient
  .schema(
    z.object({
      articleId: z.string(),
      role: z.enum(["user", "system", "assistant"]),
      content: z.string(),
    })
  )
  .action(async ({ parsedInput, ctx: { userId } }) => {
    await requireArticleAccess(parsedInput.articleId, userId);
    const result = await addMessageToArticle(parsedInput);
    revalidatePath("/");
    return result;
  });

export const updateArticleHtmlAction = authActionClient
  .schema(z.object({ articleHTMLId: z.string(), html: z.string() }))
  .action(async ({ parsedInput, ctx: { userId } }) => {
    await requireArticleContentAccess(parsedInput.articleHTMLId, userId);
    const result = await updateArticleHtml(
      parsedInput.articleHTMLId,
      parsedInput.html
    );
    revalidatePath("/");
    return result;
  });

export const updateArticleMetadataAction = authActionClient
  .schema(
    z.object({
      articleId: z.string().min(10),
      metadata: articleMetadataSchema,
    })
  )
  .action(async ({ parsedInput, ctx: { userId } }) => {
    await requireArticleAccess(parsedInput.articleId, userId);
    const result = await updateArticleMetadata(
      parsedInput.articleId,
      parsedInput.metadata
    );
    revalidatePath("/");
    return result;
  });

export const updateArticleStatusAction = authActionClient
  .schema(
    z.object({
      articleId: z.string().min(10),
      status: z.enum(["draft", "published"]),
    })
  )
  .action(async ({ parsedInput, ctx: { userId } }) => {
    await requireArticleAccess(parsedInput.articleId, userId);
    const result = await updateArticleStatus(
      parsedInput.articleId,
      parsedInput.status
    );
    revalidatePath("/");
    return result;
  });
