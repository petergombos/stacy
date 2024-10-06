import { ArticleCard } from "@/components/article-card";
import { ArticleCreateButton } from "@/components/article-create-button";
import { Header } from "@/components/header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getArticles } from "@/lib/models/article";

export const revalidate = 0;

export default async function ArticlesPage({
  params,
}: {
  params: {
    projectId: string;
  };
}) {
  const articles = await getArticles();

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-foreground mb-6">
            Your Articles
          </h1>
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="published">Published</TabsTrigger>
                <TabsTrigger value="drafts">Drafts</TabsTrigger>
              </TabsList>
              <ArticleCreateButton projectId={params.projectId} />
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
