import { ArticleCard } from "@/components/ArticleCard";
import CreateArticleButton from "@/components/CreateArticleButton";
import { Header } from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getArticles } from "@/lib/models/article";

export const revalidate = 0;

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
              Your Articles
            </h1>
            <CreateArticleButton />
          </div>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="published">Published</TabsTrigger>
              <TabsTrigger value="drafts">Drafts</TabsTrigger>
            </TabsList>
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
