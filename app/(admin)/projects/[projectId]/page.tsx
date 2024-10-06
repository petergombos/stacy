import { ArticleCard } from "@/components/article-card";
import { ArticleCreateButton } from "@/components/article-create-button";
import { Header } from "@/components/header";
import { getArticlesByProject } from "@/lib/models/article";
import { getProject } from "@/lib/models/project";
import { notFound } from "next/navigation";

export default async function ProjectPage({
  params,
}: {
  params: { projectId: string };
}) {
  const project = await getProject(params.projectId);
  if (!project) {
    notFound();
  }

  const articles = await getArticlesByProject(params.projectId);

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-foreground">
              {project.name}
            </h1>
            <ArticleCreateButton projectId={project.id} />
          </div>
          <div className="space-y-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
