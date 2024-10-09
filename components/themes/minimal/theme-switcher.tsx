"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSwitcher({
  variant = "light",
  className,
}: {
  variant?: "light" | "dark";
  className?: string;
}) {
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

  const themeVariants = {
    light: {
      text: "text-muted-foreground",
      background: "bg-foreground/5",
      hover: "hover:bg-foreground/10",
    },
    dark: {
      text: "text-gray-200",
      background: "bg-white/10",
      hover: "hover:bg-white/20",
    },
  };

  const themeVariant = themeVariants[variant];

  return (
    <AnimatePresence>
      {mounted && (
        <motion.button
          className={cn(
            "absolute top-4 right-4 sm:right-8 z-20 p-2 rounded-full backdrop-blur-sm transition-colors duration-200",
            themeVariant.text,
            themeVariant.background,
            themeVariant.hover,
            className
          )}
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
            <Moon className="w-6 h-6" />
          ) : theme === "light" ? (
            <Sun className="w-6 h-6" />
          ) : (
            <Monitor className="w-6 h-6" />
          )}
        </motion.button>
      )}
    </AnimatePresence>
  );
}
