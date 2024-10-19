import BlogEditorClient from "@/components/blog-editor-client";
import { Header } from "@/components/header";
import { requireUser } from "@/lib/lucia/utils";
import { getArticle, requireArticleAccess } from "@/lib/models/article";
import { notFound } from "next/navigation";

export const revalidate = 0;

export default async function BlogEditorPage({
  params,
}: {
  params: { articleId: string };
}) {
  const { user } = await requireUser();
  await requireArticleAccess(params.articleId, user.id);
  const article = await getArticle(params.articleId);

  const latesContent = article?.html.at(-1);

  if (!article || !latesContent) {
    notFound();
  }

  return (
    <>
      <Header />
      <BlogEditorClient
        article={article}
        initialContentHTML={latesContent}
        initialMessages={article.messages}
      />
    </>
  );
}
