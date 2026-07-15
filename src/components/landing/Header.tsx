"use client";

import React, { useEffect, useState } from "react";

export default function Header() {
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
    <header className="border-b border-border bg-background/80 backdrop-blur-md py-4 px-4 sm:px-6 sticky top-0 z-20">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <svg 
            className="w-8 h-8 flex-shrink-0" 
            viewBox="0 0 100 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="frameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF6B00" />
                <stop offset="35%" stopColor="#FF8C00" />
                <stop offset="65%" stopColor="#0070F3" />
                <stop offset="100%" stopColor="#0056B3" />
              </linearGradient>
              <linearGradient id="checkGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FF6B00" />
                <stop offset="100%" stopColor="#FFA600" />
              </linearGradient>
            </defs>
            <path 
              d="M 58 15 L 38 15 C 28 15 23 23 23 35 L 23 68 C 23 80 28 85 38 85 L 62 85 C 72 85 77 80 77 68 L 77 34" 
              stroke="url(#frameGrad)" 
              strokeWidth="9" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M 64 15 L 75 26 C 76 27 76 28 75 28 L 65 28 C 64 28 64 27 64 26 Z" 
              fill="#FFB800" 
            />
            <path 
              d="M 36 53 L 47 64 L 68 39" 
              stroke="url(#checkGrad)" 
              strokeWidth="9" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-xl font-bold tracking-tight text-brand-navy dark:text-white">
            fix<span className="text-brand-blue">IT</span>
          </span>
        </div>

        <button
          onClick={toggleTheme}
          className="p-2 border border-border rounded-sm hover:bg-muted transition-colors cursor-pointer"
          title="Toggle Theme"
        >
          {theme === "light" ? (
            <svg className="w-4 h-4 text-brand-blue" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.301-2.6.841-3.738A9.716 9.716 0 003 11.25C3 16.635 7.365 21 12.75 21a9.716 9.716 0 009.002-5.998z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21M4.22 4.22l1.59 1.59m12.38 12.38l1.59 1.59M3 12h2.25m13.5 0H21m-16.78 6.18l1.59-1.59M17.78 5.64l1.59 1.59M12 7.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}