"use client";

import { Article, Project } from "@/lib/db/schema";
import { formatDate } from "@/lib/utils";
import { motion, useScroll, useTransform } from "framer-motion";
import { CalendarDays, UserRoundPen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

export function HomeArticleListItem({
  article,
  project,
}: {
  article: Article;
  project: Project;
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <div
      ref={ref}
      className="group relative overflow-hidden shadow-2xl rounded-sm"
    >
      <Link href={`/${project.slug}/${article.slug}`} className="block">
        <div className="relative min-h-[300px] aspect-square md:aspect-video">
          <motion.div style={{ y }} className="absolute inset-0">
            <Image
              src={article.image || ""}
              alt={article.title || ""}
              fill
              className="object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
          <div className="relative z-10 p-6 flex flex-col justify-end h-full">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-4 text-balance sm:max-w-4xl">
              {article.title}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-white mb-2 sm:mb-4 line-clamp-3 lg:max-w-2xl">
              {article.description}
            </p>
            <div className="flex flex-wrap items-center text-white text-xs sm:text-sm space-x-4">
              {article.publishedAt && (
                <div className="flex items-center">
                  <CalendarDays className="w-4 h-4 mr-1" />
                  <time dateTime={formatDate(article.publishedAt)}>
                    {formatDate(article.publishedAt)}
                  </time>
                </div>
              )}
              {article.authorName && (
                <div className="flex items-center">
                  <UserRoundPen className="w-4 h-4 mr-1" />
                  <span>{article.authorName}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
