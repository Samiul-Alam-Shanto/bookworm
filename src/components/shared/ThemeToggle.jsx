"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    Promise.resolve().then(() => setMounted(true));
  }, []);
  if (!mounted) {
    return (
      <button
        className="p-2 rounded-full text-foreground/50 cursor-default"
        aria-label="Loading Theme"
      >
        <div className="w-5 h-5" />
      </button>
    );
  }

  if (!resolvedTheme) return null;

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-foreground"
      aria-label="Toggle Theme"
    >
      {resolvedTheme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
