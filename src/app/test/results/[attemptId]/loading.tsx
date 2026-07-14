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

        {/* CSS Loading Spinner */}
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <svg className="animate-spin h-8 w-8 text-brand-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.001 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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