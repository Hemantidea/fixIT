"use client";

import React, { useEffect, useRef } from "react";

export default function BackgroundEffects() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const pointer = { x: -1000, y: -1000 };

    const handleResize = () => {
      if (!canvas) return;
      width = (canvas.width = window.innerWidth);
      height = (canvas.height = window.innerHeight);
      generateDots();
    };

    const handlePointerMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    };

    const handlePointerLeave = () => {
      pointer.x = -1000;
      pointer.y = -1000;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);

    const dots: { x: number; y: number; baseSize: number }[] = [];
    const spacing = 28;

    const generateDots = () => {
      dots.length = 0;
      for (let x = spacing / 2; x < width; x += spacing) {
        for (let y = spacing / 2; y < height; y += spacing) {
          dots.push({ x, y, baseSize: 1.1 });
        }
      }
    };

    generateDots();

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains("dark");
      const dotColor = isDark ? "rgba(148, 163, 184, 0.08)" : "rgba(71, 85, 105, 0.05)";
      const activeColor = isDark ? "rgba(59, 130, 246, 0.28)" : "rgba(0, 112, 243, 0.12)";

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        const dx = pointer.x - dot.x;
        const dy = pointer.y - dot.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let size = dot.baseSize;
        let color = dotColor;

        if (dist < 130) {
          const factor = 1 - dist / 130;
          size = dot.baseSize + factor * 2.2;
          color = activeColor;
        }

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 -z-10 pointer-events-none select-none"
      />
      {/* Central-dimming radial mask: Fades background waves out under text columns for 100% legibility */}
      <div 
        className="absolute inset-0 -z-15 pointer-events-none select-none bg-[radial-gradient(circle_at_center,var(--background)_25%,transparent_100%)] opacity-80" 
      />
    </>
  );
}