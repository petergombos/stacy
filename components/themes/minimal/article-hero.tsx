"use client";

import { Article } from "@/lib/db/schema";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      <AnimatePresence>
        {mounted && (
          <motion.button
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/10 backdrop-blur-sm transition-colors duration-200 hover:bg-white/20"
            onClick={cycleTheme}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            title={
              mounted
                ? `Current theme: ${theme}. Click to change.`
                : "Theme toggle"
            }
          >
            {theme === "dark" ? (
              <Moon className="w-6 h-6 text-neutral-300" />
            ) : theme === "light" ? (
              <Sun className="w-6 h-6 text-neutral-300" />
            ) : (
              <Monitor className="w-6 h-6 text-neutral-300" />
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
