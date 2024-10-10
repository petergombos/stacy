"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="inline-flex items-center bg-black/10 dark:bg-white/10 rounded-full p-1">
      <button
        onClick={() => setTheme("light")}
        className={`p-2 rounded-full transition-colors duration-200 ${
          theme === "light" ? "bg-white text-black" : "text-gray-400"
        }`}
        aria-label="Light mode"
      >
        <Sun className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`p-2 rounded-full transition-colors duration-200 ${
          theme === "dark" ? "bg-white text-black" : "text-gray-400"
        }`}
        aria-label="Dark mode"
      >
        <Moon className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`p-2 rounded-full transition-colors duration-200 ${
          theme === "system" ? "bg-white text-black" : "text-gray-400"
        }`}
        aria-label="System theme"
      >
        <Monitor className="w-4 h-4" />
      </button>
    </div>
  );
}
