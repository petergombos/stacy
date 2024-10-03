import { cn } from "@/lib/utils";

interface CircularProgressProps {
  value: number;
  size?: "sm" | "md" | "lg";
  theme?: "light" | "dark";
  className?: string;
  children?: React.ReactNode;
}

export function CircularProgress({
  value,
  size = "md",
  theme = "light",
  className,
  children,
}: CircularProgressProps) {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const themeClasses = {
    light: {
      background: "text-muted-foreground",
      progress: "text-background",
    },
    dark: {
      background: "text-muted-foreground",
      progress: "text-foreground",
    },
  };

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden rounded-full",
        sizeClasses[size],
        className
      )}
    >
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle
          className={cn(themeClasses[theme].background)}
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r="44"
          cx="50"
          cy="50"
        />
        <circle
          className={cn(
            "transition-all duration-300 ease-in-out",
            themeClasses[theme].progress
          )}
          strokeWidth="8"
          strokeDasharray={276.46}
          strokeDashoffset={276.46 * ((100 - value) / 100)}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="44"
          cx="50"
          cy="50"
          transform="rotate(-90 50 50)"
        />
      </svg>
      <span
        className={cn(
          "absolute font-semibold",
          textSizeClasses[size],
          themeClasses[theme].progress
        )}
      >
        {children}
      </span>
    </div>
  );
}
