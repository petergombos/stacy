import { Article, Project } from "@/lib/db/schema";
import { HomeArticleListItem } from "./home-article-list-item";

export const Home = ({
  project,
  articles,
}: {
  project: Project;
  articles: Article[];
}) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 sm:px-8 py-12 sm:py-24 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 sm:mb-6 tracking-tight">
          {project.name}
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
          {project.shortDescription}
        </p>
      </div>

      <main className="container mx-auto px-4 sm:px-8 py-8 sm:py-16 space-y-8 sm:space-y-16">
        {articles.map((article) => (
          <HomeArticleListItem
            key={article.id}
            article={article}
            project={project}
          />
        ))}
      </main>
    </div>
  );
};
