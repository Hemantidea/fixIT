import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between select-none">
      {/* Header */}
      <header className="border-b border-border bg-background py-4 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <svg 
              className="w-8 h-8 flex-shrink-0" 
              viewBox="0 0 100 100" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="nfFrameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF6B00" />
                  <stop offset="35%" stopColor="#FF8C00" />
                  <stop offset="65%" stopColor="#0070F3" />
                  <stop offset="100%" stopColor="#0056B3" />
                </linearGradient>
                <linearGradient id="nfCheckGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FF6B00" />
                  <stop offset="100%" stopColor="#FFA600" />
                </linearGradient>
              </defs>
              <path 
                d="M 58 15 L 38 15 C 28 15 23 23 23 35 L 23 68 C 23 80 28 85 38 85 L 62 85 C 72 85 77 80 77 68 L 77 34" 
                stroke="url(#nfFrameGrad)" 
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
                stroke="url(#nfCheckGrad)" 
                strokeWidth="9" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-xl font-bold tracking-tight text-brand-navy dark:text-white">
              fix<span className="text-brand-blue">IT</span>
            </span>
          </div>
        </div>
      </header>

      {/* Centered Content (Sentence Case heading weight 500) */}
      <main className="max-w-md w-full mx-auto px-4 py-12 flex-1 flex flex-col items-center justify-center text-center space-y-6">
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-brand-orange uppercase tracking-wider">Error 404</p>
          <h2 className="text-3xl font-medium tracking-tight leading-tight">Page not found</h2>
          <p className="text-xs text-muted-foreground leading-relaxed font-normal">
            The requested page could not be located. It may have been moved, deleted, or the URL path contains a typo.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="bg-brand-navy dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700 font-semibold text-xs px-5 py-3 rounded-sm transition-colors cursor-pointer inline-block"
        >
          Return to dashboard
        </Link>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-4 text-center text-xs text-muted-foreground">
        <p>© 2026 fixIT. Local compilation sandbox.</p>
      </footer>
    </div>
  );
}