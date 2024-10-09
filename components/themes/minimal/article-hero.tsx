"use client";

import { Article } from "@/lib/db/schema";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { ThemeSwitcher } from "./theme-switcher";

interface HeroProps {
  article: Article;
}

export function ArticleHero({ article }: HeroProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <motion.div
      id="article-hero"
      ref={ref}
      className="relative aspect-video flex items-center justify-center overflow-hidden w-full h-[60vh] sm:h-[70vh]"
    >
      <motion.div style={{ y, opacity }} className="absolute inset-0">
        <Image
          src={article.image}
          alt={article.title ?? "Featured Image"}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60 multiply" />
      </motion.div>
      <motion.div
        className="prose prose-sm md:prose-lg xl:prose-2xl p-6 sm:p-10 relative z-10"
        style={{ opacity }}
      >
        <h1 className="text-white text-center text-balance">{article.title}</h1>
      </motion.div>
      <ThemeSwitcher variant="dark" />
    </motion.div>
  );
}
