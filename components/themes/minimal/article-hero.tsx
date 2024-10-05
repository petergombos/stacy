"use client";

import { Article } from "@/lib/db/schema";
import { motion, useScroll, useTransform } from "framer-motion";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRef } from "react";

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

  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  return (
    <motion.div
      ref={ref}
      className="relative aspect-video flex items-center justify-center overflow-hidden w-full h-[60vh] sm:h-[70vh]"
    >
      <motion.div style={{ y, opacity }} className="absolute inset-0">
        <Image
          src={article.image}
          alt={article.title ?? "Featured Image"}
          layout="fill"
          objectFit="cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60 multiply" />
      </motion.div>
      <motion.div
        className="prose prose-sm md:prose-lg xl:prose-2xl p-6 sm:p-10 relative z-10"
        style={{ opacity }}
      >
        <h1 className="text-white text-center text-balance">{article.title}</h1>
      </motion.div>
      <motion.button
        className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/10 backdrop-blur-sm transition-colors duration-200 hover:bg-white/20"
        onClick={cycleTheme}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={`Current theme: ${theme}. Click to change.`}
      >
        {theme === "dark" ? (
          <Moon className="w-6 h-6 text-slate-800" />
        ) : theme === "light" ? (
          <Sun className="w-6 h-6 text-slate-800" />
        ) : (
          <Monitor className="w-6 h-6 text-slate-800" />
        )}
      </motion.button>
    </motion.div>
  );
}
