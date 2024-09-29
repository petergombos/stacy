"use server";

import { createArticle } from "@/lib/models/article";
import { actionClient } from "@/lib/safe-action";
import { redirect } from "next/navigation";

export const createArticleAction = actionClient.action(async () => {
  const article = await createArticle();
  redirect(`/editor/${article.id}`);
});
