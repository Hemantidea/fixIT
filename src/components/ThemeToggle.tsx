"use client";

import React, { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-1.5 sm:p-2 border border-border rounded-sm hover:bg-muted transition-colors cursor-pointer"
      title="Toggle Theme"
      type="button"
    >
      {theme === "light" ? (
        // Clean SVG Moon
        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-blue" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.301-2.6.841-3.738A9.716 9.716 0 003 11.25C3 16.635 7.365 21 12.75 21a9.716 9.716 0 009.002-5.998z" />
        </svg>
      ) : (
        // Clean SVG Sun
        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21M4.22 4.22l1.59 1.59m12.38 12.38l1.59 1.59M3 12h2.25m13.5 0H21m-16.78 6.18l1.59-1.59M17.78 5.64l1.59 1.59M12 7.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9z" />
        </svg>
      )}
    </button>
  );
}