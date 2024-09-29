import BlogEditorClient from "@/components/BlogEditorClient";
import { getArticle } from "@/lib/models/article";
import { notFound } from "next/navigation";

export default async function BlogEditorPage({
  params,
}: {
  params: { articleId: string };
}) {
  const article = await getArticle(params.articleId, {
    with: {
      html: true,
    },
  });

  console.log(article);

  if (!article) {
    notFound();
  }

  return (
    <div className="flex h-screen">
      <BlogEditorClient />
    </div>
  );
}
