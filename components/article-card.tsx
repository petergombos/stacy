import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Article, Project } from "@/lib/db/schema";
import { CalendarIcon, Edit, Eye, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function ArticleCard({
  article,
  project,
}: {
  article: Article;
  project: Project;
}) {
  return (
    <Card className="overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      <div className="md:flex">
        <div className="md:flex-shrink-0">
          <Image
            width={256}
            height={256}
            src={article.image}
            alt={article.title || "Article Image"}
            className="h-48 w-full object-cover md:h-full md:w-64"
          />
        </div>

        <CardContent className="p-8 flex flex-col justify-between w-full">
          <div>
            <div className="flex flex-col md:flex-row md:items-start justify-between mb-2 gap-3">
              <h2 className="text-2xl font-semibold">
                {article.title || "Untitled"}
              </h2>
              <span
                className={`mt-2 md:mt-0 self-start md:self-auto px-2 py-1 rounded-full text-xs font-semibold capitalize ${
                  article.status === "published"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {article.status}
              </span>
            </div>
            <p className="text-neutral-600 mb-4">
              {article.description || "No description"}
            </p>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between">
            <div className="space-y-2 flex flex-col">
              <div className="flex items-center text-sm text-neutral-500">
                <User className="w-4 h-4 mr-1" />
                {article.authorName || "Unknown Author"}
              </div>
              <div className="flex items-center text-sm text-neutral-500">
                <CalendarIcon className="w-4 h-4 mr-1" />
                {article.status === "published"
                  ? `Published: ${new Date(
                      article.publishedAt!
                    ).toLocaleDateString()}`
                  : `Created: ${new Date(
                      article.createdAt
                    ).toLocaleDateString()}`}
              </div>
            </div>
            <div className="flex mt-4 md:mt-0 gap-2">
              {article.slug && article.publishedAt && (
                <Link
                  href={`/${project.slug}/${article.slug}`}
                  className={buttonVariants({
                    variant: "outline",
                    size: "sm",
                    className: "flex-1 md:flex-none",
                  })}
                  target="_blank"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Link>
              )}
              <Link
                className={buttonVariants({
                  variant: "outline",
                  size: "sm",
                  className: "flex-1 md:flex-none",
                })}
                href={`/projects/${article.projectId}/articles/composer/${article.id}`}
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Link>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
