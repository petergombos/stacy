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
import { requireUser } from "@/lib/lucia/utils";
import { getApiTokens } from "@/lib/models/api-token";
import { getArticlesByProjectId } from "@/lib/models/article";
import { getProject, requireProjectAccess } from "@/lib/models/project";
import { Tabs } from "@radix-ui/react-tabs";
import { notFound } from "next/navigation";

export default async function ProjectPage({
  params,
}: {
  params: { projectId: string };
}) {
  const { user } = await requireUser();
  await requireProjectAccess(params.projectId, user.id);
  const [project, tokens] = await Promise.all([
    getProject(params.projectId),
    getApiTokens(params.projectId),
  ]);
  if (!project) {
    notFound();
  }
  const articles = await getArticlesByProjectId(params.projectId);
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
            <ProjectSettingsDropdown project={project} tokens={tokens} />
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
                  <ArticleCard
                    key={article.id}
                    article={article}
                    project={project}
                  />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="published">
              <div className="space-y-6">
                {articles
                  .filter((a) => a.status === "published")
                  .map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      project={project}
                    />
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="drafts">
              <div className="space-y-6">
                {articles
                  .filter((a) => a.status === "draft")
                  .map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      project={project}
                    />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  );
}
