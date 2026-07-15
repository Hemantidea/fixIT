"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { sendOtpAction } from "../../app/actions/auth";

export default function PortalAccess() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  
  // Dedicated state to track Google hand-shake transition latency
  const [isGooglePending, setIsGooglePending] = useState(false);

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsGooglePending(true);
    try {
      // Trigger OAuth handshake redirect
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (err) {
      console.error("Google sign-in hand-shake failed:", err);
      setError("Failed to connect with Google. Please retry.");
      setIsGooglePending(false);
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
        window.location.href = `/verify-otp?email=${encodeURIComponent(email)}`;
      } else {
        setError(res.error || "Failed to transmit access code.");
      }
    } else {
      setIsPending(false);
    }
  };

  return (
    <div className="border border-border/80 dark:border-border/40 p-6 rounded-[10px] bg-card/60 backdrop-blur-sm hover:border-brand-blue/30 hover:shadow-lg hover:shadow-brand-blue/5 transition-all duration-300 space-y-4 max-w-md shadow-sm">
      <h2 className="text-xs font-bold tracking-wide uppercase text-brand-blue">
        Sign In / Access Portal
      </h2>
      
      {/* Form 1: Google OAuth Button (Now with active state loader) */}
      <button
        onClick={handleGoogleSignIn}
        disabled={isGooglePending || isPending}
        className="w-full border border-border bg-background hover:bg-muted text-foreground font-semibold text-xs py-2.5 rounded-sm transition-all active:scale-[0.99] cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50 select-none"
      >
        {isGooglePending ? (
          // Rotating Inline SVG Spinner
          <svg className="animate-spin h-4 w-4 text-brand-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.001 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : (
          // Standard Google Icon
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.94 5.94 0 0 1 8 12.5a5.94 5.94 0 0 1 5.99-6.014c1.55 0 2.902.59 3.93 1.556l3.14-3.14C19.11 3.01 16.746 2 13.99 2 8.196 2 3.5 6.7 3.5 12.5S8.196 23 13.99 23c5.34 0 9.87-3.79 9.87-10.3 0-.745-.078-1.3-.22-1.84L12.24 10.285z"
            />
          </svg>
        )}
        <span>{isGooglePending ? "Connecting to Google..." : "Continue with Google"}</span>
      </button>

      <div className="relative flex py-1 items-center select-none">
        <div className="flex-grow border-t border-border"></div>
        <span className="flex-shrink mx-4 text-[9px] text-muted-foreground uppercase font-bold">Or use email</span>
        <div className="flex-grow border-t border-border"></div>
      </div>

      {/* Form 2: OTP Verification Sign-In */}
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
            disabled={isPending || isGooglePending}
            className="w-full px-3 py-2 border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue bg-background disabled:opacity-50"
          />
        </div>

        {error && (
          <p className="text-xs font-semibold text-red-500 text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={isPending || isGooglePending}
          className="w-full bg-brand-navy dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700 font-semibold text-xs py-2.5 rounded-sm transition-all active:scale-[0.99] cursor-pointer text-center disabled:opacity-50"
        >
          {isPending ? "Sending Code..." : "Access via Email"}
        </button>
      </form>
    </div>
  );
}