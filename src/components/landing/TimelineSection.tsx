import React from "react";

interface TimelineStepProps {
  num: number;
  title: string;
  desc: string;
}

function TimelineStep({ num, title, desc }: TimelineStepProps) {
  return (
    <div className="flex items-start space-x-6 relative z-10 group">
      {/* 48px circle with hover orange shadow */}
      <span className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full bg-card border border-border font-mono font-bold text-sm text-brand-navy dark:text-white group-hover:border-brand-orange group-hover:shadow-[0_0_15px_rgba(255,107,0,0.15)] transition-all duration-300 select-none">
        {num}
      </span>
      <div className="space-y-1 pt-3">
        <h4 className="text-sm font-semibold tracking-wide text-foreground">{title}</h4>
        {/* High-contrast Slate-300 body copy for optimal legibility */}
        <p className="text-xs text-muted-foreground dark:text-slate-300 leading-relaxed max-w-lg">{desc}</p>
      </div>
    </div>
  );
}

export default function TimelineSection() {
  return (
    <section id="how-it-works" className="max-w-2xl mx-auto px-4 sm:px-6 py-16 space-y-12">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight">How it works</h2>
        <p className="text-xs text-muted-foreground">From prompt to results in three steps.</p>
      </div>

      <div className="relative space-y-12">
        {/* Centered timeline connecter at exactly 23px from left */}
        <span className="absolute left-[23px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-brand-orange to-brand-blue -z-10" />

        <TimelineStep
          num={1}
          title="Generate with AI"
          desc="Prompt your favorite LLM to produce structured JSON assessments following the fixIT schema."
        />
        <TimelineStep
          num={2}
          title="Import & validate"
          desc="Drop your JSON into fixIT. Client-side Zod validation catches structural errors before any data hits storage."
        />
        <TimelineStep
          num={3}
          title="Test & analyze"
          desc="Run distraction-free assessments with real-time timers, then review SVG-powered performance analytics."
        />
      </div>
    </section>
  );
}