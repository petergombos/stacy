import { ArticleHtmlContent } from "@/components/article-html-content";
import { ArticleHero } from "@/components/themes/minimal/article-hero";
import { ArticleMeta } from "@/components/themes/minimal/article-meta";
import { getArticleBySlug, getArticles } from "@/lib/models/article";
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

// Next.js will invalidate the cache when a
// request comes in, at most once every 60 seconds.
export const revalidate = 60;

// We'll prerender only the params from `generateStaticParams` at build time.
// If a request comes in for a path that hasn't been generated,
// Next.js will server-render the page on-demand.
export const dynamicParams = true; // or false, to 404 on unknown paths

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
  const content = article?.html.at(-1);

  if (!article || !article.publishedAt || !content?.html) {
    notFound();
  }

  return (
    <>
      <ArticleHero article={article} />
      <div className="container prose xl:prose-lg dark:prose-invert mx-auto max-w-screen-md p-5 sm:p-10 [&>img]:-mx-5 [&>img]:sm:-mx-10 [&>img]:w-[calc(100%+2.5rem)] [&>img]:sm:w-[calc(100%+5rem)] [&>img]:max-w-none">
        <ArticleMeta article={article} />
        <ArticleHtmlContent content={content.html} />
      </div>
    </>
  );
}
