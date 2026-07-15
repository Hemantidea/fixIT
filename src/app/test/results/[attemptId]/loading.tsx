import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      {/* Skeleton Navigation Header */}
      <div className="border-b border-border py-4 px-4 sm:px-6 bg-card animate-pulse">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-muted rounded-sm" />
            <div className="w-16 h-5 bg-muted rounded-sm" />
          </div>
          <div className="flex space-x-3">
            <div className="w-16 h-7 bg-muted rounded-sm" />
            <div className="w-16 h-7 bg-muted rounded-sm" />
          </div>
        </div>
      </div>

      {/* Pulsing Skeleton Dashboard */}
      <div className="max-w-6xl w-full mx-auto px-6 py-12 flex-1 space-y-12 animate-pulse">
        {/* Title */}
        <div className="space-y-2">
          <div className="w-24 h-3 bg-muted rounded-sm" />
          <div className="w-2/3 h-8 bg-muted rounded-sm" />
        </div>

        {/* Scoreboard Cards Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="border border-border p-5 rounded-sm bg-card h-24 flex flex-col justify-between">
              <div className="w-1/2 h-3 bg-muted rounded-sm" />
              <div className="w-2/3 h-6 bg-muted rounded-sm" />
            </div>
          ))}
        </div>

        {/* CSS Brand Logo Loading Spinner */}
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <svg 
            className="w-14 h-14 flex-shrink-0" 
            viewBox="0 0 100 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="resLoadFrameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF6B00" />
                <stop offset="35%" stopColor="#FF8C00" />
                <stop offset="65%" stopColor="#0070F3" />
                <stop offset="100%" stopColor="#0056B3" />
              </linearGradient>
              <linearGradient id="resLoadCheckGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FF6B00" />
                <stop offset="100%" stopColor="#FFA600" />
              </linearGradient>
            </defs>
            <path 
              d="M 58 15 L 38 15 C 28 15 23 23 23 35 L 23 68 C 23 80 28 85 38 85 L 62 85 C 72 85 77 80 77 68 L 77 34" 
              stroke="url(#resLoadFrameGrad)" 
              strokeWidth="9" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="opacity-30"
            />
            <path 
              d="M 64 15 L 75 26 C 76 27 76 28 75 28 L 65 28 C 64 28 64 27 64 26 Z" 
              fill="#FFB800" 
              className="opacity-30"
            />
            <path 
              d="M 36 53 L 47 64 L 68 39" 
              stroke="url(#resLoadCheckGrad)" 
              strokeWidth="9" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="animate-pulse"
              style={{ animationDuration: "1.2s" }}
            />
          </svg>
          <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
            Compiling performance database...
          </span>
        </div>
      </div>

      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground animate-pulse">
        <div className="w-32 h-3 bg-muted mx-auto rounded-sm" />
      </div>
    </div>
  );
}