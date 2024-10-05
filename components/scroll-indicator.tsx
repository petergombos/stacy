"use client";

import { motion, useScroll } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function ScrollIndicator() {
  const [isVisible, setIsVisible] = useState(false);
  const articleRef = useRef<HTMLElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: articleRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const article = document.querySelector("article");
    const hero = document.getElementById("article-hero");
    if (article) articleRef.current = article;
    if (hero) heroRef.current = hero;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-muted-foreground z-50"
      style={{ scaleX: scrollYProgress, transformOrigin: "0%" }}
    />
  );
}
