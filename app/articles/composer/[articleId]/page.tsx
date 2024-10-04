import { notFound } from "next/navigation";
import BlogEditorClient from "~/components/blog-editor-client";
import { Header } from "~/components/header";
import { getArticle } from "~/lib/models/article";

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
