import BlogEditorClient from "@/components/BlogEditorClient";
import { getArticle } from "@/lib/models/article";
import { notFound } from "next/navigation";

export const revalidate = 0;

export default async function BlogEditorPage({
  params,
}: {
  params: { articleId: string };
}) {
  const article = await getArticle(params.articleId);

  const latesContent = article?.html.at(-1);

  if (!article || !latesContent) {
    notFound();
  }

  return (
    <div className="flex h-screen">
      <BlogEditorClient
        article={article}
        initialContentHTML={latesContent}
        initialMessages={article.messages}
      />
    </div>
  );
}
