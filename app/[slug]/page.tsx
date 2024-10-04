import { getArticleBySlug, getArticles } from "@/lib/models/article";
import Image from "next/image";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getArticleBySlug(params.slug);
  return {
    title: article?.title,
    description: article?.description,
    keywords: article?.keywords,
  };
}

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function Article({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getArticleBySlug(params.slug);

  if (!article || !article.publishedAt) {
    notFound();
  }

  return (
    <>
      <div className="relative aspect-video flex items-center justify-center p-10">
        <Image
          src={article.image}
          alt={article.title ?? "Featured Image"}
          width={1800}
          height={1800}
          className="inset-0 absolute object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/50" />
        <h1 className="text-white text-7xl text-center  text-balance font-bold relative z-10">
          {article.title}
        </h1>
      </div>
      <div className="container prose xl:prose-lg mx-auto max-w-screen-md">
        <article dangerouslySetInnerHTML={{ __html: article.html[0].html }} />
      </div>
    </>
  );
}
