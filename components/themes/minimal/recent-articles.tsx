import { Article, Project } from "@/lib/db/schema";
import Image from "next/image";
import Link from "next/link";

interface RecentArticlesProps {
  articles: Article[];
  project: Project;
}

export function RecentArticles({ articles, project }: RecentArticlesProps) {
  return (
    <div className="bg-muted-foreground/10">
      <section className="container max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-16">
        <h2 className="text-2xl font-bold mb-6">Recent Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/${project.slug}/${article.slug}`}
              className="group"
            >
              <div className="bg-background border rounded-sm overflow-hidden shadow-sm transition-shadow duration-300 group-hover:shadow-md h-full">
                <Image
                  src={article.image}
                  alt={article.title || "Article image"}
                  width={400}
                  height={225}
                  className="w-full h-52 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {article.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
