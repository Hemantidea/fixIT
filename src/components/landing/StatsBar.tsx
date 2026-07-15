"use client";

import React, { useEffect, useState, useRef } from "react";

interface StatProps {
  target: number;
  suffix?: string;
  label: string;
}

function StatCounter({ target, suffix = "", label }: StatProps) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let active = true;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && active) {
          let start = 0;
          const duration = 1200; // 1.2 seconds count up
          const stepTime = Math.abs(Math.floor(duration / target));
          
          const timer = setInterval(() => {
            start += 1;
            setCount(start);
            if (start >= target) {
              clearInterval(timer);
            }
          }, stepTime);
          
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      active = false;
      observer.disconnect();
    };
  }, [target]);

  return (
    <div
      ref={elementRef}
      className="border border-border p-6 rounded-sm bg-card hover:border-brand-orange/30 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-28"
    >
      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
        {label}
      </span>
      <span className="text-3xl font-extrabold font-mono text-brand-navy dark:text-white">
        {count}
        {suffix}
      </span>
    </div>
  );
}

export default function StatsBar() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-6">
      <StatCounter target={100} suffix="%" label="Offline Capable" />
      <StatCounter target={3} label="Question Types" />
      <StatCounter target={0} suffix="ms" label="Report Latency" />
      <StatCounter target={1} label="JSON to Test" />
    </section>
  );
}