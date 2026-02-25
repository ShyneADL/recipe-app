"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/app/store/themeStore";

/**
 * Reads the Zustand theme store and applies the `dark` class to <html>.
 * Must be rendered inside <Providers> so it can access the hydrated store.
 *
 * On first mount it also checks the OS/browser system preference and
 * adopts it if the user has never explicitly set a preference (i.e. the
 * persisted store still shows the default "light").
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useThemeStore();

  // Sync system preference on very first visit (no stored preference yet)
  useEffect(() => {
    const stored = localStorage.getItem("ketohub-theme");
    if (!stored) {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      if (prefersDark) setTheme("dark");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
