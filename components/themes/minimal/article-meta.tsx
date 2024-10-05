"use client";

import { Article } from "@/lib/db/schema";
import { calculateReadTime, cn, formatDate } from "@/lib/utils";
import { BookOpen, CalendarDays, UserRoundPen } from "lucide-react";
import { HTMLAttributes } from "react";

interface ArticleMetaProps extends HTMLAttributes<HTMLDivElement> {
  article: Article;
  articleHTML: string;
}

export function ArticleMeta({
  article,
  articleHTML,
  className,
  ...rest
}: ArticleMetaProps) {
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const shareOnX = () => {
    const text = encodeURIComponent(article.title || "");
    const url = encodeURIComponent(currentUrl);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      "_blank"
    );
  };

  const shareOnFacebook = () => {
    const url = encodeURIComponent(currentUrl);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      "_blank"
    );
  };

  const readTime = calculateReadTime(articleHTML);

  return (
    <div
      className={cn(
        "flex justify-between items-center flex-wrap pb-6 sm:pb-10 border-b gap-4",
        className
      )}
      {...rest}
    >
      <div className="flex justify-start items-center gap-5 flex-wrap">
        {article.publishedAt && (
          <div className="flex items-center">
            <CalendarDays className="w-5 h-5 mr-2 text-muted-foreground" />
            <time
              className="text-sm text-muted-foreground"
              dateTime={formatDate(article.publishedAt)}
            >
              {formatDate(article.publishedAt)}
            </time>
          </div>
        )}
        <div className="flex items-center">
          <BookOpen className="w-5 h-5 mr-2 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {readTime} min read
          </span>
        </div>
        {article.authorName && (
          <div className="flex items-center">
            <UserRoundPen className="w-5 h-5 mr-2 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {article.authorName}
            </span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={shareOnX}
          className="text-muted-foreground hover:text-foreground transition-colors duration-200"
          aria-label="Share on X"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </button>
        <button
          onClick={shareOnFacebook}
          className="text-muted-foreground hover:text-foreground transition-colors duration-200"
          aria-label="Share on Facebook"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
