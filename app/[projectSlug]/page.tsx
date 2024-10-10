import { Footer } from "@/components/themes/minimal/footer";
import { Home } from "@/components/themes/minimal/home";
import { getArticlesByProjectId } from "@/lib/models/article";
import { getProjectBySlug } from "@/lib/models/project";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: { projectSlug: string };
}) {
  const project = await getProjectBySlug(params.projectSlug);
  if (!project) {
    return;
  }
  return {
    title: project.name,
    description: project.shortDescription,
    keywords: project.niche,
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
//       projectSlug: article.projectSlug,
//     }));
// }

export default async function HomePage({
  params,
}: {
  params: { projectSlug: string };
}) {
  const project = await getProjectBySlug(params.projectSlug);

  if (!project) {
    notFound();
  }

  const articles = await getArticlesByProjectId(project.id);
  const publishedArticles = articles.filter((article) => article.publishedAt);

  return (
    <>
      <Home project={project} articles={publishedArticles} />
      <Footer />
    </>
  );
}
