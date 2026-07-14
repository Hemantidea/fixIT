"use client";

import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { sendOtpAction } from "../actions/auth";
import Image from "next/image";

export default function VerifyOtpPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  // 1. Manage countdown timer interval
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit code.");
      return;
    }

    setIsPending(true);
    setError(null);

    try {
      const res = await signIn("credentials", {
        email,
        otp,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid or expired verification code.");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An unexpected network error occurred.");
    } finally {
      setIsPending(false);
    }
  };

  const handleResend = async () => {
    setIsPending(true);
    setError(null);
    setResendStatus(null);
    const res = await sendOtpAction(email);
    setIsPending(false);
    
    if (res.success) {
      setTimeLeft(300); // Reset timer to 5 minutes
      setOtp("");
      setResendStatus("A new verification code has been sent to your email.");
      setTimeout(() => setResendStatus(null), 3000);
    } else {
      setError(res.error || "Failed to resend access code.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-border bg-background py-4 px-4 sm:px-6">
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

      {/* Verification Card */}
      <main className="max-w-md w-full mx-auto px-4 py-12 flex-1 flex items-center justify-center">
        <div className="border border-border p-8 rounded-sm bg-card space-y-6 w-full shadow-lg">
          <div className="space-y-1 text-center">
            <p className="text-[10px] font-bold text-brand-orange uppercase tracking-wider">Access Verification</p>
            <h2 className="text-xl font-bold tracking-tight">Enter Verification Code</h2>
            <p className="text-xs text-muted-foreground truncate">Sent to {email}</p>
          </div>

          <form onSubmit={handleVerifySubmit} className="space-y-4">
            <div>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                disabled={timeLeft === 0 || isPending}
                className="w-full px-4 py-3 border border-border rounded-sm bg-background font-mono text-2xl text-center tracking-[12px] focus:outline-none focus:ring-1 focus:ring-brand-blue disabled:opacity-50"
              />
            </div>

            {error && (
              <p className="text-xs font-semibold text-red-500 text-center">{error}</p>
            )}

            {resendStatus && (
              <p className="text-xs font-semibold text-green-600 text-center">{resendStatus}</p>
            )}

            <button
              type="submit"
              disabled={timeLeft === 0 || isPending || otp.length !== 6}
              className="w-full bg-brand-navy dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700 font-semibold text-xs py-2.5 rounded-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              {isPending ? "Verifying..." : "Verify & Access Portal"}
            </button>
          </form>

          {/* Countdown & Resend Option */}
          <div className="text-center space-y-3">
            {timeLeft > 0 ? (
              <p className="text-xs text-muted-foreground">
                Code expires in <span className="font-mono font-bold text-brand-orange">{formatTime(timeLeft)}</span>
              </p>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-red-500 font-semibold">Your verification code has expired.</p>
                <button
                  onClick={handleResend}
                  disabled={isPending}
                  className="text-xs font-bold text-brand-blue hover:underline cursor-pointer"
                >
                  Request a New Code
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-4 text-center text-xs text-muted-foreground">
        <p>© 2026 fixIT. No external telemetry.</p>
      </footer>
    </div>
  );
}