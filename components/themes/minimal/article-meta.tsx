import { Article } from "@/lib/db/schema";
import { formatDate } from "@/lib/utils";
import { Clock, User } from "lucide-react";

interface ArticleMetaProps {
  article: Article;
}

export function ArticleMeta({ article }: ArticleMetaProps) {
  return (
    <div className="flex justify-start items-center flex-wrap pb-6 sm:pb-10 border-b border-gray-200 gap-4">
      <div className="flex items-center">
        <User className="w-5 h-5 mr-2 text-gray-500" />
        <span className="text-sm text-gray-600">
          {article.authorName || "Unknown author"}
        </span>
      </div>
      {article.publishedAt && (
        <div className="flex items-center">
          <Clock className="w-5 h-5 mr-2 text-gray-500" />
          <time
            className="text-sm text-gray-600"
            dateTime={formatDate(article.publishedAt)}
          >
            {formatDate(article.publishedAt)}
          </time>
        </div>
      )}
    </div>
  );
}
