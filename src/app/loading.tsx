import React from "react";

export default function GlobalLoader() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 select-none">
      <div className="flex flex-col items-center justify-center space-y-5">
        
        {/* Vector representation of your actual logo with an animated, pulsing checkmark */}
        <svg 
          className="w-16 h-16 flex-shrink-0" 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Diagonal Gradient matching the Outer Frame */}
            <linearGradient id="loadFrameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF6B00" />
              <stop offset="35%" stopColor="#FF8C00" />
              <stop offset="65%" stopColor="#0070F3" />
              <stop offset="100%" stopColor="#0056B3" />
            </linearGradient>

            {/* Orange-Yellow Gradient for central checkmark */}
            <linearGradient id="loadCheckGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF6B00" />
              <stop offset="100%" stopColor="#FFA600" />
            </linearGradient>
          </defs>

          {/* 1. Main Document Outline Frame (Lower opacity to highlight the checkmark) */}
          <path 
            d="M 58 15 L 38 15 C 28 15 23 23 23 35 L 23 68 C 23 80 28 85 38 85 L 62 85 C 72 85 77 80 77 68 L 77 34" 
            stroke="url(#loadFrameGrad)" 
            strokeWidth="9" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="opacity-30"
          />

          {/* 2. Folded Corner (Top Right) */}
          <path 
            d="M 64 15 L 75 26 C 76 27 76 28 75 28 L 65 28 C 64 28 64 27 64 26 Z" 
            fill="#FFB800" 
            className="opacity-30"
          />

          {/* 3. Central Checkmark (Pulsing animation) */}
          <path 
            d="M 36 53 L 47 64 L 68 39" 
            stroke="url(#loadCheckGrad)" 
            strokeWidth="9" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="animate-pulse"
            style={{
              animationDuration: "1.2s"
            }}
          />
        </svg>

        <div className="text-center space-y-1">
          <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest block">
            Loading Portal
          </span>
          <span className="text-[9px] text-muted-foreground/60 font-mono block">
            Compiling workspace components...
          </span>
        </div>
      </div>
    </div>
  );
}