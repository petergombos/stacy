import { ArticleHtmlContent } from "@/components/article-html-content";
import { ArticleContainer } from "@/components/themes/minimal/article-container";
import { ArticleHero } from "@/components/themes/minimal/article-hero";
import { ArticleMeta } from "@/components/themes/minimal/article-meta";
import { Footer } from "@/components/themes/minimal/footer";
import { RecentArticles } from "@/components/themes/minimal/recent-articles";
import { getArticleBySlug, getRecentArticles } from "@/lib/models/article";
import { getProjectBySlug } from "@/lib/models/project";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: { articleSlug: string };
}) {
  const article = await getArticleBySlug(params.articleSlug);
  return {
    title: article?.title,
    description: article?.description,
    keywords: article?.keywords,
  };
}

// Next.js will invalidate the cache when a
// request comes in, at most once every 60 seconds.
// export const revalidate = 60;

// We'll prerender only the params from `generateStaticParams` at build time.
// If a request comes in for a path that hasn't been generated,
// Next.js will server-render the page on-demand.
// export const dynamicParams = true; // or false, to 404 on unknown paths

// export async function generateStaticParams() {
//   const articles = await getArticles();
//   return articles
//     .filter((article) => article.publishedAt)
//     .map((article) => ({
//       articleSlug: article.articleSlug,
//     }));
// }

export default async function Article({
  params,
}: {
  params: { articleSlug: string; projectSlug: string };
}) {
  const [project, article] = await Promise.all([
    getProjectBySlug(params.projectSlug),
    getArticleBySlug(params.articleSlug),
  ]);

  const content = article?.html.at(-1);

  if (
    !article ||
    !article.publishedAt ||
    !content?.html ||
    !article.projectId ||
    !project
  ) {
    notFound();
  }

  const recentArticles = await getRecentArticles(article.id, article.projectId);

  return (
    <>
      <ArticleHero article={article} />
      <ArticleContainer>
        <ArticleMeta article={article} articleHTML={content.html} />
        <ArticleHtmlContent content={content.html} />
      </ArticleContainer>
      {!!recentArticles.length && (
        <RecentArticles articles={recentArticles} project={project} />
      )}
      <Footer />
    </>
  );
}
