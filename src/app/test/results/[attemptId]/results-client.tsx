"use client";

import React, { useState } from "react";
import Link from "next/link";

interface AttemptHistoryItem {
  id: string;
  score: number;
  timeSpent: number;
  completedAt: string;
}

interface ResultsClientProps {
  attempt: {
    id: string;
    score: number;
    totalQuestions: number;
    correctCount: number;
    incorrectCount: number;
    timeSpent: number;
    completedAt: string;
    test: {
      id: string;
      title: string;
      rawJson: any;
    };
    responses: Array<{
      id: string;
      questionId: string;
      selected: string[];
      timeSpent: number;
      isCorrect: boolean;
    }>;
  };
  history: AttemptHistoryItem[];
}

export default function ResultsClient({ attempt, history }: ResultsClientProps) {
  const [filter, setFilter] = useState<"ALL" | "CORRECT" | "INCORRECT" | "UNATTEMPTED">("ALL");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Sync active theme state on mount
  React.useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const questions = attempt.test.rawJson.questions || [];
  
  const totalMaxMarks = questions.reduce((sum: number, q: any) => sum + (q.marks ?? 1), 0);

  const totalQuestionsCount = questions.length;
  const unattemptedCount = totalQuestionsCount - attempt.correctCount - attempt.incorrectCount;

  const topicStats: Record<string, { total: number; correct: number }> = {};
  questions.forEach((q: any) => {
    if (!topicStats[q.topic]) {
      topicStats[q.topic] = { total: 0, correct: 0 };
    }
    topicStats[q.topic].total += q.marks || 1;

    const userResponse = attempt.responses.find((r) => r.questionId === q.id);
    if (userResponse && userResponse.isCorrect) {
      topicStats[q.topic].correct += q.marks || 1;
    }
  });

  const accuracyPercentage = totalQuestionsCount > 0
    ? Math.round((attempt.correctCount / totalQuestionsCount) * 100)
    : 0;

  const formatSeconds = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}m ${secs}s`;
  };

  const filteredQuestions = questions.filter((q: any) => {
    const userResponse = attempt.responses.find((r) => r.questionId === q.id);
    const hasResponse = userResponse && userResponse.selected.length > 0;

    if (filter === "CORRECT") return userResponse?.isCorrect === true;
    if (filter === "INCORRECT") return userResponse?.isCorrect === false && hasResponse;
    if (filter === "UNATTEMPTED") return !hasResponse;
    return true;
  });

  const exportToCSV = () => {
    const headers = ["Question Number", "Category", "Status", "Time Spent (Seconds)"];
    
    const rows: string[][] = questions.map((q: any, idx: number) => {
      const userResponse = attempt.responses.find((r) => r.questionId === q.id);
      
      // Defensively fallback to empty array if JSON value is non-array or null
      const selectedArray = userResponse && Array.isArray(userResponse.selected)
        ? userResponse.selected
        : [];

      let status = "Unattempted";
      if (selectedArray.length > 0) {
        status = userResponse?.isCorrect ? "Correct" : "Incorrect";
      }
      return [
        `Question ${idx + 1}`,
        q.topic,
        status,
        String(userResponse?.timeSpent || 0),
      ];
    });
    const csvContent = [headers.join(","), ...rows.map((e: string[]) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `fixit_attempt_analysis_${attempt.id}.csv`);
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between print:bg-white print:text-black">
      {/* Header */}
      {/* Unified Global Navigation Bar */}
      <header className="border-b border-border bg-background py-4 px-4 sm:px-6 sticky top-0 z-10 print:hidden">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-8">
            {/* Unified Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 border-2 border-brand-orange flex items-center justify-center relative rounded-sm">
                <span className="text-brand-blue font-bold text-sm">IT</span>
                <div className="absolute top-0 right-0 w-2 h-2 bg-brand-orange" />
              </div>
              <span className="text-xl font-bold tracking-tight text-brand-navy dark:text-white">
                fix<span className="text-brand-blue">IT</span>
              </span>
            </div>

            {/* Unified Nav Links */}
            <nav className="hidden md:flex space-x-6 text-sm font-semibold">
              <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <Link href="/history" className="text-muted-foreground hover:text-foreground transition-colors">
                History
              </Link>
            </nav>
          </div>

          {/* Action Controllers */}
          <div className="flex items-center space-x-3">
            <button
              onClick={exportToCSV}
              className="px-2.5 py-1.5 border border-border text-xs rounded-sm hover:bg-muted text-muted-foreground transition-colors cursor-pointer font-medium"
            >
              Export CSV
            </button>
            <button
              onClick={() => window.print()}
              className="px-2.5 py-1.5 border border-border text-xs rounded-sm hover:bg-muted text-muted-foreground transition-colors cursor-pointer font-medium"
            >
              Print Report
            </button>

            {/* Theme Toggle icon */}
            <button
              onClick={toggleTheme}
              className="p-2 border border-border rounded-sm hover:bg-muted transition-colors cursor-pointer"
              title="Toggle Theme"
            >
              {theme === "light" ? (
                <svg className="w-4 h-4 text-brand-blue" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.301-2.6.841-3.738A9.716 9.716 0 003 11.25C3 16.635 7.365 21 12.75 21a9.716 9.716 0 009.002-5.998z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21M4.22 4.22l1.59 1.59m12.38 12.38l1.59 1.59M3 12h2.25m13.5 0H21m-16.78 6.18l1.59-1.59M17.78 5.64l1.59 1.59M12 7.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl w-full mx-auto px-6 py-12 flex-1 space-y-12">
        <div className="space-y-1">
          <p className="text-xs font-bold text-brand-orange uppercase tracking-wider">Performance Report</p>
          <h1 className="text-3xl font-extrabold tracking-tight">{attempt.test.title}</h1>
        </div>

        {/* Scorecard Metrics */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="border border-border p-5 rounded-sm bg-card flex flex-col justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Final Score</span>
            <span className="text-3xl font-extrabold mt-2 text-brand-blue">
              {attempt.score}pts/{totalMaxMarks}pts
            </span>
          </div>
          <div className="border border-border p-5 rounded-sm bg-card flex flex-col justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Accuracy</span>
            <span className="text-3xl font-extrabold mt-2 text-brand-navy dark:text-emerald-500">{accuracyPercentage}%</span>
          </div>
          <div className="border border-border p-5 rounded-sm bg-card flex flex-col justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Time Taken</span>
            <span className="text-3xl font-extrabold mt-2 font-mono">{formatSeconds(attempt.timeSpent)}</span>
          </div>
          <div className="border border-border p-5 rounded-sm bg-card flex flex-col justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Ratio (C/I/U)</span>
            <span className="text-2xl font-extrabold mt-2 font-mono text-muted-foreground">
              {attempt.correctCount} / {attempt.incorrectCount} / {unattemptedCount}
            </span>
          </div>
        </section>

        {/* Attempt Comparison Progress Timeline */}
        {history.length > 1 && (
          <section className="border border-border p-6 rounded-sm bg-card space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wide border-b border-border pb-3 text-muted-foreground">
              Attempt Comparison & Progress History
            </h3>
            <div className="space-y-3">
              {history.map((h, index) => {
                const isCurrent = h.id === attempt.id;
                const formattedDate = new Date(h.completedAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                });
                return (
                  <div key={h.id} className="flex items-center justify-between text-xs py-1 border-b border-border/40 last:border-0">
                    <div className="flex items-center space-x-3">
                      <span className={`w-5 h-5 flex items-center justify-center rounded-full font-bold text-[10px] ${
                        isCurrent ? "bg-brand-blue text-white" : "bg-muted text-muted-foreground"
                      }`}>
                        {index + 1}
                      </span>
                      <span className={isCurrent ? "font-bold text-foreground" : "text-muted-foreground"}>
                        Attempt on {formattedDate} {isCurrent && "(Current Attempt)"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 font-mono">
                      <span className={isCurrent ? "font-bold text-brand-blue" : "text-muted-foreground"}>
                        Score: {h.score} pts
                      </span>
                      <span className="text-muted-foreground">
                        Time: {formatSeconds(h.timeSpent)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Charts & Graphs Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 border border-border p-6 rounded-sm bg-card space-y-6">
            <h3 className="font-bold text-sm uppercase tracking-wide border-b border-border pb-3 text-muted-foreground">
              Topic Breakdown
            </h3>
            <div className="space-y-4">
              {Object.entries(topicStats).map(([topic, stats]) => {
                const percentage = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
                return (
                  <div key={topic} className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-foreground">{topic}</span>
                      <span className="text-muted-foreground font-mono">{stats.correct}/{stats.total} Marks ({percentage}%)</span>
                    </div>
                    <div className="w-full h-2 bg-border rounded-sm overflow-hidden">
                      <div 
                        className="bg-brand-blue h-full transition-all duration-300 rounded-sm"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-6 border border-border p-6 rounded-sm bg-card space-y-6">
            <h3 className="font-bold text-sm uppercase tracking-wide border-b border-border pb-3 text-muted-foreground">
              Question Distribution
            </h3>
            <div className="flex items-center space-x-6">
              <svg width="120" height="120" viewBox="0 0 36 36" className="flex-shrink-0">
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="var(--border)" strokeWidth="4" />
                {totalQuestionsCount > 0 && (
                  <circle
                    cx="18"
                    cy="18"
                    r="15.915"
                    fill="transparent"
                    stroke="var(--color-brand-blue)"
                    strokeWidth="4"
                    strokeDasharray={`${(attempt.correctCount / totalQuestionsCount) * 100} ${100 - (attempt.correctCount / totalQuestionsCount) * 100}`}
                    strokeDashoffset="25"
                  />
                )}
              </svg>
              <div className="space-y-3 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-brand-blue rounded-sm" />
                  <span>Correct: {attempt.correctCount} answers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-red-500 rounded-sm" />
                  <span>Incorrect: {attempt.incorrectCount} answers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-border rounded-sm" />
                  <span>Unattempted: {unattemptedCount} questions</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Questions Analysis */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4 print:hidden">
            <h3 className="font-bold text-sm uppercase tracking-wide text-muted-foreground">
              Detailed Question Analysis
            </h3>
            <div className="flex flex-wrap gap-2">
              {(["ALL", "CORRECT", "INCORRECT", "UNATTEMPTED"] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setFilter(opt)}
                  className={`text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 border rounded-sm transition-colors cursor-pointer ${
                    filter === opt
                      ? "bg-brand-navy dark:bg-slate-800 border-brand-navy dark:border-slate-800 text-white"
                      : "border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {filteredQuestions.length === 0 ? (
              <div className="border border-border p-12 rounded-sm text-center bg-card text-muted-foreground text-sm">
                No {filter.toLowerCase()} questions found in this assessment attempt.
              </div>
            ) : (
              filteredQuestions.map((q: any, idx: number) => {
                const userResponse = attempt.responses.find((r) => r.questionId === q.id);
                
                // Guard selected JSON value securely
                const selectedArray = userResponse && Array.isArray(userResponse.selected)
                  ? userResponse.selected
                  : [];

                const hasResponse = selectedArray.length > 0;
                const isCorrect = userResponse?.isCorrect === true;

                let cardBorderClass = "border-border";
                let statusLabel = "Unattempted";
                let statusColor = "text-muted-foreground";

                if (hasResponse) {
                  if (isCorrect) {
                    cardBorderClass = "border-emerald-500/30";
                    statusLabel = "Correct";
                    statusColor = "text-emerald-600 dark:text-emerald-500";
                  } else {
                    cardBorderClass = "border-red-500/30";
                    statusLabel = "Incorrect";
                    statusColor = "text-red-600 dark:text-red-500";
                  }
                }

                return (
                  <div 
                    key={q.id} 
                    className={`border ${cardBorderClass} p-6 bg-card rounded-sm space-y-4`}
                  >
                    <div className="flex items-center justify-between border-b border-border pb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      <span>Question {idx + 1} ({q.topic})</span>
                      <span className={`${statusColor}`}>{statusLabel} • {userResponse?.timeSpent || 0}s spent</span>
                    </div>

                    <p className="text-sm font-medium leading-relaxed">{q.text}</p>

                    <div className="space-y-2 text-xs">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-sm">
                        <div>
                          <p className="font-semibold text-[10px] uppercase text-muted-foreground tracking-wide mb-1">Your Response</p>
                          <p className="font-mono">
                            {hasResponse ? selectedArray.join(", ") : "None"}
                          </p>
                        </div>
                        <div>
                          <p className="font-semibold text-[10px] uppercase text-muted-foreground tracking-wide mb-1">Correct Solution</p>
                          <p className="font-mono">
                            {q.type === "NUMERICAL" && q.range 
                              ? `Accepted Range: ${q.range.min} to ${q.range.max}` 
                              : q.correctAnswer?.join(", ")}
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 space-y-1">
                        <p className="font-bold text-[10px] uppercase text-brand-orange tracking-wide">Explanation</p>
                        <p className="text-muted-foreground leading-relaxed">
                          {q.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-6 text-center text-xs text-muted-foreground print:hidden">
        <p>© 2026 fixIT. Local compilation sandbox.</p>
      </footer>
    </div>
  );
}