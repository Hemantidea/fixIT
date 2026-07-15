"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function HeroSection() {
  const [typedText, setTypedText] = useState("");
  const [tiltStyle, setTiltStyle] = useState({});
  const editorRef = useRef<HTMLDivElement | null>(null);

  const schemaJson = `{
  "schemaVersion": "1.0.0",
  "testTitle": "C Memory Assessment",
  "testTime": 20,
  "questions": [
    {
      "id": "c-q1",
      "type": "MCQ",
      "text": "What is malloc() return type?",
      "options": ["int*", "char*", "void*", "size_t"],
      "correctAnswer": ["void*"]
    }
  ]
}`;

  // 1. Live Typewriter effect
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText((prev) => prev + schemaJson[index]);
      index++;
      if (index >= schemaJson.length - 1) {
        clearInterval(interval);
      }
    }, 24);
    return () => clearInterval(interval);
  }, []);

  // 2. Hardware-accelerated 3D Perspective Tilt on Mouse Move
  const handleMouseMove = (e: React.MouseEvent) => {
    const card = editorRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = ((y - rect.height / 2) / rect.height) * -8; // Max 8 deg slant
    const rotateY = ((x - rect.width / 2) / rect.width) * 8;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`,
      transition: "transform 100ms ease-out",
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
      transition: "transform 250ms ease-out",
    });
  };

  const scrollToPortal = () => {
    const portal = document.getElementById("portal-card");
    if (portal) portal.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToFeatures = () => {
    const section = document.getElementById("features");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
      
      {/* Left Column */}
      <div className="lg:col-span-6 space-y-6">

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-brand-navy dark:text-white">
          Evaluate your <br className="hidden sm:inline" />
          knowledge{" "}
          <span className="bg-gradient-to-r from-brand-orange via-orange-500 to-brand-blue bg-clip-text text-transparent">
            cleanly.
          </span>
        </h1>
        <p className="text-muted-foreground leading-relaxed text-sm sm:text-base max-w-lg">
          An offline-first, local testing environment designed for developers who prompt AI systems to create educational problems. No embedded trackers. Bring your generated JSON and start testing.
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={scrollToPortal}
            className="bg-brand-blue hover:bg-blue-600 text-white font-semibold text-xs px-5 py-3 rounded-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            Start assessment
          </button>
          <button
            onClick={scrollToFeatures}
            className="border border-border bg-card/40 hover:bg-muted text-foreground font-semibold text-xs px-5 py-3 rounded-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            View documentation
          </button>
        </div>
      </div>

      {/* Right Column: 3D Tilt Code Playground */}
      <div className="lg:col-span-6 w-full">
        <div
          ref={editorRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={tiltStyle}
          className="border border-border/80 dark:border-border/40 rounded-sm bg-[#0B0F17] overflow-hidden text-left flex flex-col justify-between h-[450px] shadow-xl relative"
        >
          {/* macOS controls header */}
          <div className="flex items-center justify-between border-b border-border bg-[#111827] px-4 py-3 select-none">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-[10px] font-mono text-slate-500 font-semibold uppercase pl-2 border-l border-border/60">
                fixit-template.json
              </span>
            </div>
            <span className="text-[9px] font-mono text-emerald-400 border border-emerald-400/20 px-1.5 py-0.5 rounded-sm bg-emerald-400/5">
              Live Typing
            </span>
          </div>

          {/* Typewriter Code Terminal */}
          <div className="p-5 font-mono text-xs overflow-y-auto flex-1 leading-relaxed text-slate-300">
            <code className="whitespace-pre-wrap block">
              {typedText}
              <span className="inline-block w-1.5 h-4 bg-emerald-400 ml-0.5 animate-pulse" />
            </code>
          </div>

          <div className="border-t border-border bg-[#111827] px-4 py-2.5 flex items-center justify-between text-xs text-slate-400 select-none">
            <span className="font-mono">JSON</span>
            <button
              onClick={() => navigator.clipboard.writeText(schemaJson)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1 rounded-sm transition-colors font-semibold cursor-pointer"
            >
              Copy boilerplate
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}