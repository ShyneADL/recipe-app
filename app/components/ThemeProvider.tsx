"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/app/store/themeStore";

/**
 * Reads the Zustand theme store and applies the `dark` class to <html>.
 * Must be rendered inside <Providers> so it can access the hydrated store.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore();

  // Apply / remove the "dark" class on <html> whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return <>{children}</>;
}
