import React from "react";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { handleSignOut } from "@/app/actions/test";

export default async function HistoryPage() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    redirect("/");
  }

  // Fetch all attempts for the current user, joining test title info
  const attempts = await prisma.attempt.findMany({
    where: { userId: session.user.id },
    orderBy: { completedAt: "desc" },
    include: {
      test: {
        select: {
          title: true,
        },
      },
    },
  });

  const formatSeconds = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      {/* Global Responsive Navigation Bar */}
      <header className="border-b border-border bg-background py-4 px-4 sm:px-6 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-8">
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
            
            {/* Nav Links */}
            <nav className="hidden md:flex space-x-6 text-sm font-semibold">
              <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <Link href="/history" className="text-brand-blue transition-colors">
                History
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-3">
            <form action={handleSignOut}>
              <button
                type="submit"
                className="bg-brand-navy dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700 font-medium text-xs px-3 py-1.5 rounded-sm transition-colors cursor-pointer"
              >
                Log Out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl w-full mx-auto px-4 sm:px-6 py-12 flex-1 space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight">Your Attempt History</h1>
          <p className="text-sm text-muted-foreground">
            A comprehensive record of all your completed test assessments.
          </p>
        </div>

        {attempts.length === 0 ? (
          <div className="border border-border p-8 rounded-sm text-center bg-card text-muted-foreground text-sm">
            You haven't completed any assessments yet.
          </div>
        ) : (
          <div className="space-y-3">
            {attempts.map((attempt) => {
              const formattedDate = new Date(attempt.completedAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              });
              const accuracy = Math.round((attempt.correctCount / attempt.totalQuestions) * 100);

              return (
                <Link
                  key={attempt.id}
                  href={`/test/results/${attempt.id}`}
                  className="block border border-border p-4 bg-card rounded-sm hover:bg-muted transition-colors cursor-pointer"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-1">
                      <h3 className="font-bold text-sm leading-snug">{attempt.test.title}</h3>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                        Completed on {formattedDate}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4 font-mono text-xs text-muted-foreground">
                      <span className="font-bold text-brand-blue">Score: {attempt.score} pts</span>
                      <span>Accuracy: {accuracy}%</span>
                      <span>Time: {formatSeconds(attempt.timeSpent)}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-4 text-center text-xs text-muted-foreground">
        <p>© 2026 fixIT. No external telemetry.</p>
      </footer>
    </div>
  );
}