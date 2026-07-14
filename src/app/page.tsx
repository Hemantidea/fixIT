"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import CodePlayground from "../components/CodePlayground";
import { sendOtpAction } from "./actions/auth";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    if (email) {
      await signIn("credentials", { email, callbackUrl: "/dashboard" });
    }
  };
const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    if (email) {
      const res = await sendOtpAction(email);
      setIsPending(false);

      if (res.success) {
        // 100% reliable native browser redirect - bypasses all Next.js router compilation bugs
        window.location.href = `/verify-otp?email=${encodeURIComponent(email)}`;
      } else {
        setError(res.error || "Failed to transmit access code.");
      }
    } else {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-border bg-background py-4 px-4 sm:px-6 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
{/* Unified Inline SVG Logo (Bypasses Next.js Optimization entirely) */}
            <div className="flex items-center space-x-3">
              <svg 
                className="w-8 h-8 flex-shrink-0" 
                viewBox="0 0 100 100" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Diagonal Gradient matching the Outer Frame */}
                  <linearGradient id="frameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF6B00" />
                    <stop offset="35%" stopColor="#FF8C00" />
                    <stop offset="65%" stopColor="#0070F3" />
                    <stop offset="100%" stopColor="#0056B3" />
                  </linearGradient>

                  {/* Gradient for central checkmark */}
                  <linearGradient id="checkGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FF6B00" />
                    <stop offset="100%" stopColor="#FFA600" />
                  </linearGradient>
                </defs>

                {/* 1. Main Document Outline Frame */}
                <path 
                  d="M 58 15 L 38 15 C 28 15 23 23 23 35 L 23 68 C 23 80 28 85 38 85 L 62 85 C 72 85 77 80 77 68 L 77 34" 
                  stroke="url(#frameGrad)" 
                  strokeWidth="9" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />

                {/* 2. Folded Corner (Top Right) */}
                <path 
                  d="M 64 15 L 75 26 C 76 27 76 28 75 28 L 65 28 C 64 28 64 27 64 26 Z" 
                  fill="#FFB800" 
                />

                {/* 3. Central Checkmark */}
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
          </div>
        </div>
      </header>

      {/* Main Content (Split Grid Layout matching Node.js) */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 md:py-16 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Side: Brand Text & Interactive Portal */}
        <div className="lg:col-span-6 space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-brand-navy dark:text-white leading-tight">
              Evaluate your knowledge cleanly.
            </h1>
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              An offline-first, local testing environment designed for developers who prompt AI systems to create educational problems. No embedded trackers. Bring your generated JSON and start testing.
            </p>
          </div>

          {/* Secure Access Portal Card */}
          <div className="border border-border p-5 rounded-sm bg-card space-y-4 max-w-md">
            <h2 className="text-xs font-bold tracking-wide uppercase text-brand-blue">
              Sign In / Access Portal
            </h2>
            
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="w-full border border-border bg-background hover:bg-muted text-foreground font-semibold text-xs py-2.5 rounded-sm transition-colors cursor-pointer flex items-center justify-center space-x-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.94 5.94 0 0 1 8 12.5a5.94 5.94 0 0 1 5.99-6.014c1.55 0 2.902.59 3.93 1.556l3.14-3.14C19.11 3.01 16.746 2 13.99 2 8.196 2 3.5 6.7 3.5 12.5S8.196 23 13.99 23c5.34 0 9.87-3.79 9.87-10.3 0-.745-.078-1.3-.22-1.84L12.24 10.285z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative flex py-1 items-center select-none">
              <div className="flex-grow border-t border-border"></div>
              <span className="flex-shrink mx-4 text-[9px] text-muted-foreground uppercase font-bold">Or use email</span>
              <div className="flex-grow border-t border-border"></div>
            </div>

            {/* Form 2: Traditional Portal Credentials */}
            <form onSubmit={handleEmailSubmit} className="space-y-3">
              <div>
                <label htmlFor="email" className="block text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="name@domain.com"
                  disabled={isPending}
                  className="w-full px-3 py-2 border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue bg-background disabled:opacity-50"
                />
              </div>

              {error && (
                <p className="text-xs font-semibold text-red-500 text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-brand-navy dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700 font-semibold text-xs py-2.5 rounded-sm transition-colors cursor-pointer text-center disabled:opacity-50"
              >
                {isPending ? "Sending Code..." : "Access via Email"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Tabbed Code Playground (Node.js style) */}
        <div className="lg:col-span-6 w-full">
          <CodePlayground />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-4 text-center text-xs text-muted-foreground">
        <p>© 2026 fixIT. No external telemetry.</p>
      </footer>
    </div>
  );
}