"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-12 h-6 rounded-full bg-white/20 animate-pulse" />
    );
  }

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    console.log("Current theme:", theme, "Resolved theme:", resolvedTheme);
    const newTheme = isDark ? "light" : "dark";
    console.log("Setting theme to:", newTheme);
    setTheme(newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative w-12 h-6 bg-white/20 rounded-full p-0.5 transition-all duration-300 ease-in-out hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {/* Toggle Background */}
      <div className={`w-full h-full rounded-full relative transition-colors duration-300 ${
        isDark ? "bg-slate-700" : "bg-blue-400"
      }`}>
        {/* Moving Circle */}
        <div
          className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-lg transition-transform duration-300 ease-in-out flex items-center justify-center ${
            isDark ? "translate-x-6" : "translate-x-0.5"
          }`}
        >
          {/* Sun/Moon Icon */}
          {isDark ? (
            <svg
              className="w-2.5 h-2.5 text-slate-700"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          ) : (
            <svg
              className="w-2.5 h-2.5 text-yellow-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>
    </button>
  );
}
