import { ArticleCard } from "@/components/article-card";
import { ArticleCreateButton } from "@/components/article-create-button";
import { Header } from "@/components/header";
import { ProjectSettingsDropdown } from "@/components/project-settings-dropdown";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getApiTokens } from "@/lib/models/api-token";
import { getArticlesByProject } from "@/lib/models/article";
import { getProject } from "@/lib/models/project";
import { Tabs } from "@radix-ui/react-tabs";
import { notFound } from "next/navigation";

export default async function ProjectPage({
  params,
}: {
  params: { projectId: string };
}) {
  const [project, tokens] = await Promise.all([
    getProject(params.projectId),
    getApiTokens(params.projectId),
  ]);
  if (!project) {
    notFound();
  }
  const articles = await getArticlesByProject(params.projectId);
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto lg:px-8 px-4 py-6 space-y-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/projects/${project.id}`}>
                {project.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div>
          <div className="flex gap-3 items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-foreground">
              {project.name}
            </h1>
            <ProjectSettingsDropdown projectId={project.id} tokens={tokens} />
          </div>
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col-reverse sm:flex-row gap-3 justify-between items-start sm:items-center mb-4">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="published">Published</TabsTrigger>
                <TabsTrigger value="drafts">Drafts</TabsTrigger>
              </TabsList>
              <ArticleCreateButton projectId={project.id} />
            </div>
            <TabsContent value="all">
              <div className="space-y-6">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="published">
              <div className="space-y-6">
                {articles
                  .filter((a) => a.status === "published")
                  .map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="drafts">
              <div className="space-y-6">
                {articles
                  .filter((a) => a.status === "draft")
                  .map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  );
}
