import React from "react";

export default function HeroContent() {
  return (
    <div className="space-y-6">
      {/* Muted structural border badge */}
      <div 
        className="inline-flex items-center space-x-2 border border-border/80 dark:border-border/40 bg-card/40 px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold tracking-wide text-brand-orange select-none"
      >
        <span>Offline-first diagnostic platform</span>
        <span>🚀</span>
      </div>

      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.12] text-brand-navy dark:text-white">
        Evaluate your <br className="hidden sm:inline" />
        knowledge cleanly.
      </h1>
      <p className="text-muted-foreground leading-relaxed text-sm sm:text-base max-w-lg font-normal">
        An offline-first, local testing environment designed for developers who prompt AI systems to create educational problems. No embedded trackers. Bring your generated JSON and start testing.
      </p>
    </div>
  );
}