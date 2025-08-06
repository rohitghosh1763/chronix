"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "motion/react";


export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);

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
    if (buttonRef.current) {
      // Get button position for ripple origin
      const rect = buttonRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      
      // Pass the target theme (opposite of current)
      const nextTheme = isDark ? "light" : "dark";
    
    }
    
    console.log("Current theme:", theme, "Resolved theme:", resolvedTheme);
    const newTheme = isDark ? "light" : "dark";
    console.log("Setting theme to:", newTheme);
    setTheme(newTheme);
  };

  return (
    <motion.button
      ref={buttonRef}
      onClick={toggleTheme}
      className="relative w-12 h-6 rounded-full p-0.5 focus:outline-none focus:ring-2 focus:ring-white/50"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      initial={false}
    >
      {/* Animated Background */}
      <motion.div 
        className="w-full h-full rounded-full relative overflow-hidden"
        animate={{
          backgroundColor: isDark ? "#334155" : "#3b82f6",
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        {/* Background Gradient Animation */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            background: isDark 
              ? "linear-gradient(45deg, #1e293b, #475569, #64748b)"
              : "linear-gradient(45deg, #3b82f6, #60a5fa, #93c5fd)",
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
        
        {/* Moving Toggle Circle */}
        <motion.div
          className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-lg flex items-center justify-center z-10"
          animate={{
            x: isDark ? 24 : 2,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
        >
          {/* Animated Icons */}
          <AnimatePresence mode="wait">
            {isDark ? (
              <motion.div
                key="moon"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.2 }}
              >
                <svg
                  className="w-2.5 h-2.5 text-slate-700"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.div>
            ) : (
              <motion.div
                key="sun"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.2 }}
              >
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
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Glowing Effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: isDark
              ? "inset 0 1px 3px rgba(0, 0, 0, 0.3), 0 0 8px rgba(59, 130, 246, 0.3)"
              : "inset 0 1px 3px rgba(0, 0, 0, 0.2), 0 0 8px rgba(251, 191, 36, 0.4)",
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.button>
  );
}
