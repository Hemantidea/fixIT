"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { sendOtpAction } from "../../app/actions/auth";

export default function LandingAuthPortal() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

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
        // Native, reliable browser-level redirect to clear cache
        window.location.href = `/verify-otp?email=${encodeURIComponent(email)}`;
      } else {
        setError(res.error || "Failed to transmit access code.");
      }
    } else {
      setIsPending(false);
    }
  };

  return (
    <div className="border border-border p-6 sm:p-8 rounded-2xl bg-card/60 backdrop-blur-sm space-y-6 w-full max-w-md mx-auto transition-all hover:scale-[1.01] duration-300">
      <div className="space-y-1 text-center sm:text-left">
        <h2 className="text-xs font-bold tracking-widest uppercase text-brand-blue">
          Sign In / Access Portal
        </h2>
        <p className="text-[10px] text-muted-foreground">Select your preferred method to authenticate.</p>
      </div>
      
      {/* Google OAuth pill button */}
      <button
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        className="w-full border border-border bg-background hover:bg-muted text-foreground font-semibold text-xs py-3 rounded-full transition-all cursor-pointer flex items-center justify-center space-x-2.5 active:scale-[0.99]"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#EA4335"
            d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.94 5.94 0 0 1 8 12.5a5.94 5.94 0 0 1 5.99-6.014c1.55 0 2.902.59 3.93 1.556l3.14-3.14C19.11 3.01 16.746 2 13.99 2 8.196 2 3.5 6.7 3.5 12.5S8.196 23 13.99 23c5.34 0 9.87-3.79 9.87-10.3 0-.745-.078-1.3-.22-1.84L12.24 10.285z"
          />
        </svg>
        <span>Continue with Google</span>
      </button>

      {/* Divider */}
      <div className="relative flex py-1 items-center select-none">
        <div className="flex-grow border-t border-border/60"></div>
        <span className="flex-shrink mx-4 text-[8px] text-muted-foreground uppercase font-bold tracking-wider">Or use email</span>
        <div className="flex-grow border-t border-border/60"></div>
      </div>

      {/* SMTP Email input pill form */}
      <form onSubmit={handleEmailSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 pl-1">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="name@domain.com"
            disabled={isPending}
            className="w-full px-4 py-2.5 border border-border rounded-full text-xs focus:outline-none focus:ring-1 focus:ring-brand-blue bg-background disabled:opacity-50"
          />
        </div>

        {error && (
          <p className="text-xs font-semibold text-red-500 text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-brand-navy dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700 font-semibold text-xs py-2.5 rounded-full transition-all cursor-pointer text-center disabled:opacity-50 active:scale-[0.99]"
        >
          {isPending ? "Sending Code..." : "Access via Email"}
        </button>
      </form>
    </div>
  );
}