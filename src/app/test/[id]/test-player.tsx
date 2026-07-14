"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
import { submitTestAttempt } from "@/app/actions/attempt";
import { useRouter } from "next/navigation";

interface Question {
  id: string;
  type: "MCQ" | "MSQ" | "NUMERICAL";
  text: string;
  topic: string;
  subtopic?: string;
  difficulty?: "easy" | "medium" | "hard";
  marks?: number;
  negativeMarks?: number;
  options?: string[];
  correctAnswer?: string[];
  range?: { min: number; max: number };
  explanation: string;
  referenceUrl?: string;
}

interface TestPlayerProps {
  test: {
    id: string;
    title: string;
    rawJson: any;
  };
  initialBookmarks: string[];
}

export default function TestPlayer({ test, initialBookmarks }: TestPlayerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const questions: Question[] = test.rawJson.questions || [];
  const testTimeLimitSeconds = test.rawJson.testTime * 60;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string[]>>({});
  const [questionTimes, setQuestionTimes] = useState<Record<string, number>>({});
  const [bookmarks, setBookmarks] = useState<string[]>(initialBookmarks);
  const [markedForReview, setMarkedForReview] = useState<string[]>([]);
  const [overallTimeLeft, setOverallTimeLeft] = useState(testTimeLimitSeconds);
  const [isClientLoaded, setIsClientLoaded] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const [isStarted, setIsStarted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const activeQuestion = questions[currentIndex];
  const [numericalInput, setNumericalInput] = useState("");
  const [isNumericalSaved, setIsNumericalSaved] = useState(false);

  const overallTimerRef = useRef<NodeJS.Timeout | null>(null);
  const activeQuestionTimerRef = useRef<NodeJS.Timeout | null>(null);

  const cacheKey = `test-autosave-${test.id}`;

  useEffect(() => {
    const savedState = localStorage.getItem(cacheKey);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setResponses(parsed.responses || {});
        setQuestionTimes(parsed.questionTimes || {});
        setBookmarks(parsed.bookmarks || initialBookmarks);
        setMarkedForReview(parsed.markedForReview || []);
        setOverallTimeLeft(parsed.overallTimeLeft ?? testTimeLimitSeconds);
        setCurrentIndex(parsed.currentIndex || 0);
        setIsStarted(true);
      } catch (err) {
        console.error("Failed to restore state", err);
      }
    }
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
    setIsClientLoaded(true);

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
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

  const handleStartTestInFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      }
    } catch (err) {
      console.error("Browser restricted fullscreen invocation:", err);
    }
    setIsStarted(true);
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
          setIsFullscreen(false);
        }
      }
    } catch (err) {
      console.error("Fullscreen toggle failed:", err);
    }
  };

  // 1. Decoupled Timer Interval (Strictly modifies state only)
  useEffect(() => {
    if (!isClientLoaded || !isStarted) return;

    overallTimerRef.current = setInterval(() => {
      setOverallTimeLeft((prev) => {
        if (prev <= 1) {
          if (overallTimerRef.current) clearInterval(overallTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    activeQuestionTimerRef.current = setInterval(() => {
      setQuestionTimes((prev) => {
        const currentActiveId = questions[currentIndex]?.id;
        if (!currentActiveId) return prev;
        return {
          ...prev,
          [currentActiveId]: (prev[currentActiveId] || 0) + 1,
        };
      });
    }, 1000);

    return () => {
      if (overallTimerRef.current) clearInterval(overallTimerRef.current);
      if (activeQuestionTimerRef.current) clearInterval(activeQuestionTimerRef.current);
    };
  }, [currentIndex, isClientLoaded, isStarted]);

  // 2. Safe Submission Effect (Triggered cleanly in the React lifecycle when timer reaches 0)
  useEffect(() => {
    if (isClientLoaded && isStarted && overallTimeLeft === 0) {
      handleForceSubmission();
    }
  }, [overallTimeLeft, isClientLoaded, isStarted]);

  useEffect(() => {
    if (!isClientLoaded) return;
    const stateToSave = {
      responses,
      questionTimes,
      bookmarks,
      markedForReview,
      overallTimeLeft,
      currentIndex,
    };
    localStorage.setItem(cacheKey, JSON.stringify(stateToSave));
  }, [responses, questionTimes, bookmarks, markedForReview, overallTimeLeft, currentIndex, isClientLoaded]);

  useEffect(() => {
    if (activeQuestion && activeQuestion.type === "NUMERICAL") {
      const activeAns = responses[activeQuestion.id];
      const val = activeAns ? activeAns[0] : "";
      setNumericalInput(val);
      setIsNumericalSaved(!!val);
    }
  }, [currentIndex, activeQuestion]);

  const handleForceSubmission = async () => {
    const payload = Object.entries(responses).map(([qId, ans]) => ({
      questionId: qId,
      selected: ans,
      timeSpent: questionTimes[qId] || 0,
    }));
    
    const totalSpent = testTimeLimitSeconds - overallTimeLeft;
    const res = await submitTestAttempt(test.id, payload, totalSpent, bookmarks);
    if (res.success) {
      if (document.fullscreenElement) {
        await document.exitFullscreen().catch(() => {});
      }
      localStorage.removeItem(cacheKey);
      router.push(`/test/results/${res.attemptId}`);
    }
  };

  const handleManualSubmission = () => {
    const unansweredCount = questions.filter((q: Question) => !responses[q.id] || responses[q.id].length === 0).length;
    const confirmMsg = unansweredCount > 0 
      ? `You have ${unansweredCount} unanswered questions. Submit the assessment?` 
      : "Confirm submission of your assessment?";

    if (window.confirm(confirmMsg)) {
      startTransition(async () => {
        const payload = questions.map((q: Question) => ({
          questionId: q.id,
          selected: responses[q.id] || [],
          timeSpent: questionTimes[q.id] || 0,
        }));
        
        const totalSpent = testTimeLimitSeconds - overallTimeLeft;
        const res = await submitTestAttempt(test.id, payload, totalSpent, bookmarks);
        if (res.success) {
          if (document.fullscreenElement) {
            await document.exitFullscreen().catch(() => {});
          }
          localStorage.removeItem(cacheKey);
          router.push(`/test/results/${res.attemptId}`);
        }
      });
    }
  };

  const handleOptionSelect = (option: string) => {
    const qId = activeQuestion.id;
    if (activeQuestion.type === "MCQ") {
      setResponses((prev) => ({ ...prev, [qId]: [option] }));
    } else {
      const currentSelections = responses[qId] || [];
      if (currentSelections.includes(option)) {
        setResponses((prev) => ({
          ...prev,
          [qId]: currentSelections.filter((x) => x !== option),
        }));
      } else {
        setResponses((prev) => ({
          ...prev,
          [qId]: [...currentSelections, option],
        }));
      }
    }
  };

  const handleNumericalSave = () => {
    if (!numericalInput.trim()) return;
    setResponses((prev) => ({
      ...prev,
      [activeQuestion.id]: [numericalInput.trim()],
    }));
    setIsNumericalSaved(true);
  };

  const handleClearResponse = () => {
    setResponses((prev) => {
      const copy = { ...prev };
      delete copy[activeQuestion.id];
      return copy;
    });
    setNumericalInput("");
    setIsNumericalSaved(false);
  };

  const toggleBookmark = () => {
    const qId = activeQuestion.id;
    if (bookmarks.includes(qId)) {
      setBookmarks((prev) => prev.filter((id) => id !== qId));
    } else {
      setBookmarks((prev) => [...prev, qId]);
    }
  };

  const toggleMarkedForReview = () => {
    const qId = activeQuestion.id;
    if (markedForReview.includes(qId)) {
      setMarkedForReview((prev) => prev.filter((id) => id !== qId));
    } else {
      setMarkedForReview((prev) => [...prev, qId]);
    }
  };

  const formatSeconds = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!isClientLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-semibold text-sm">
        Resuming assessment state...
      </div>
    );
  }

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <div className="max-w-md w-full border border-border bg-card p-8 rounded-sm space-y-6 text-center">
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-brand-orange uppercase tracking-wider">Assessment Setup</p>
            <h2 className="text-xl font-bold tracking-tight">{test.title}</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              To proceed, this assessment must launch in dedicated, distraction-free Fullscreen mode. Exiting fullscreen or closing windows is monitored.
            </p>
          </div>
          <button
            onClick={handleStartTestInFullscreen}
            className="w-full bg-brand-blue hover:bg-blue-600 text-white font-bold text-sm py-2.5 rounded-sm transition-colors cursor-pointer"
          >
            Start Assessment & Enter Fullscreen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      {/* OT Header */}
      <header className="border-b border-border py-4 px-4 sm:px-6 bg-card sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="space-y-0.5 truncate">
            <h1 className="font-bold text-xs sm:text-sm truncate">{test.title}</h1>
            <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-wide">
              Question {currentIndex + 1} of {questions.length}
            </p>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            {/* Collapsible Panel Button on Mobile */}
            <button
              onClick={() => setShowMobileSidebar(!showMobileSidebar)}
              className="lg:hidden border border-border px-2 py-1.5 rounded-sm text-[10px] uppercase font-bold text-muted-foreground hover:bg-muted cursor-pointer"
            >
              {showMobileSidebar ? "Hide Grid ▴" : "Show Grid ▾"}
            </button>

            {/* Manual Fullscreen Toggle Button */}
            <button
              onClick={toggleFullscreen}
              className="p-2 border border-border rounded-sm hover:bg-muted text-muted-foreground transition-colors cursor-pointer"
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullscreen ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 9L3 3m0 0l3.5 0M3 3v3.5M15 9l6-6m0 0h-3.5M21 3v3.5M9 15l-6 6m0 0h3.5M3 21v-3.5M15 15l6 6m0 0h-3.5M21 21v-3.5" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75h4.5m0-4.5v4.5m0-4.5L3.75 3.75M20.25 3.75h-4.5m0 0v-4.5m0 4.5l4.5-4.5M3.75 20.25h4.5m0 0v4.5m0-4.5L3.75 20.25M20.25 20.25h-4.5m0 0v4.5m0-4.5l4.5 4.5" />
                </svg>
              )}
            </button>

            {/* Sun / Moon Theme Switcher */}
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

            <div className="text-right">
              <p className="text-[8px] sm:text-[10px] uppercase text-muted-foreground font-semibold">Time</p>
              <p className="font-mono text-base sm:text-lg font-bold text-brand-orange">
                {formatSeconds(overallTimeLeft)}
              </p>
            </div>

            {/* Red Submit Button Added Back Here */}
            <button
              onClick={handleManualSubmission}
              disabled={isPending}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] sm:text-xs px-3 sm:px-4 py-2 rounded-sm cursor-pointer disabled:opacity-50"
            >
              {isPending ? "..." : "Submit"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      {/* Collapsible Questions Grid (Vertical Accordion Flow - Zero Horizontal Shift) */}
      {showMobileSidebar && (
        <div className="border-b border-border bg-card p-4 sm:p-6 lg:hidden">
          <div className="max-w-7xl mx-auto space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Assessment Overview
              </span>
              <button
                onClick={() => setShowMobileSidebar(false)}
                className="text-xs font-bold text-brand-blue cursor-pointer"
              >
                Close [×]
              </button>
            </div>

            {/* Grid of numbers */}
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
              {questions.map((q: Question, idx: number) => {
                const isCurrent = idx === currentIndex;
                const hasAnswer = responses[q.id] && responses[q.id].length > 0;
                const isMarked = markedForReview.includes(q.id);
                const isBookmarked = bookmarks.includes(q.id);

                let cellClass = "border border-border text-muted-foreground hover:bg-muted";
                if (isCurrent) {
                  cellClass = "border-2 border-brand-blue text-brand-blue font-bold";
                } else if (isMarked) {
                  cellClass = "bg-amber-500 text-white border-amber-500";
                } else if (hasAnswer) {
                  cellClass = "bg-emerald-600 text-white border-emerald-600";
                }

return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setShowMobileSidebar(false);
                    }}
                    className={`h-10 rounded-sm text-xs flex flex-col items-center justify-center relative cursor-pointer font-medium ${cellClass}`}
                  >
                    <span>{idx + 1}</span>
                    {isCurrent && hasAnswer && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-0.5" />
                    )}
                    {/* Corner Diagonal Striped Ribbon */}
                    {isBookmarked && (
                      <div className="absolute top-0 right-0 w-3.5 h-3.5 overflow-hidden pointer-events-none">
                        <svg className="w-full h-full text-purple-500" viewBox="0 0 10 10" preserveAspectRatio="none">
                          <polygon points="0,0 10,0 10,10" fill="currentColor" />
                          <line x1="3" y1="0" x2="10" y2="7" stroke="var(--background)" strokeWidth="1.1" />
                          <line x1="6" y1="0" x2="10" y2="4" stroke="var(--background)" strokeWidth="1.1" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Grid Legend */}
            <div className="flex flex-wrap gap-4 text-[10px] text-muted-foreground pt-1">
              <div className="flex items-center space-x-1.5">
                <span className="w-3.5 h-3.5 bg-emerald-600 rounded-sm" />
                <span>Answered</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3.5 h-3.5 bg-amber-500 rounded-sm" />
                <span>Review</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3.5 h-3.5 border border-border bg-card rounded-sm" />
                <span>Unattempted</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3.5 h-3.5 border border-border bg-card rounded-sm relative overflow-hidden flex-shrink-0">
                  <div className="absolute top-0 right-0 w-full h-full pointer-events-none">
                    <svg className="w-full h-full text-purple-500" viewBox="0 0 10 10" preserveAspectRatio="none">
                      <polygon points="0,0 10,0 10,10" fill="currentColor" />
                      <line x1="3" y1="0" x2="10" y2="7" stroke="var(--background)" strokeWidth="1.1" />
                      <line x1="6" y1="0" x2="10" y2="4" stroke="var(--background)" strokeWidth="1.1" />
                    </svg>
                  </div>
                </div>
                <span>Bookmarked</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Workstation */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        
        {/* Left Section: Active Question Card (Spans full width on mobile, 8 columns on desktop) */}
        <div className="lg:col-span-8 flex flex-col justify-between border border-border bg-card rounded-sm p-4 sm:p-6 space-y-6 sm:space-y-8">
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-muted-foreground truncate">
                Category: {activeQuestion.topic}
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-muted-foreground flex-shrink-0">
                +{activeQuestion.marks ?? 1} / -{activeQuestion.negativeMarks ?? 0}
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-medium leading-relaxed">
              {activeQuestion.text}
            </h2>

            <div className="space-y-2 sm:space-y-3">
              {activeQuestion.type === "NUMERICAL" ? (
                <div className="space-y-3 max-w-sm">
                  <input
                    type="number"
                    step="any"
                    value={numericalInput}
                    onChange={(e) => {
                      setNumericalInput(e.target.value);
                      setIsNumericalSaved(false);
                    }}
                    placeholder="Type numerical answer..."
                    className="w-full px-3 py-2 border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue bg-background font-mono"
                  />
                  <button
                    onClick={handleNumericalSave}
                    className={`px-4 py-1.5 rounded-sm text-xs font-semibold cursor-pointer border transition-colors ${
                      isNumericalSaved
                        ? "bg-emerald-600 border-emerald-600 text-white"
                        : "bg-brand-blue border-brand-blue text-white"
                    }`}
                  >
                    {isNumericalSaved ? "Saved ✓" : "Save Response"}
                  </button>
                </div>
              ) : (
                activeQuestion.options?.map((option: string, optIdx: number) => {
                  const letter = String.fromCharCode(65 + optIdx);
                  const isSelected = responses[activeQuestion.id]?.includes(option) ?? false;
                  return (
                    <div
                      key={optIdx}
                      onClick={() => handleOptionSelect(option)}
                      className={`flex items-center space-x-3 p-3 sm:p-3.5 border rounded-sm cursor-pointer transition-colors text-xs sm:text-sm ${
                        isSelected ? "border-brand-blue bg-blue-50/10" : "border-border hover:bg-muted"
                      }`}
                    >
                      <span className={`w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center font-bold text-[10px] sm:text-xs rounded-sm border ${
                        isSelected ? "bg-brand-blue text-white border-brand-blue" : "border-border text-muted-foreground bg-background"
                      }`}>
                        {letter}
                      </span>
                      <span>{option}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border pt-5">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleClearResponse}
                className="border border-border text-muted-foreground hover:bg-muted text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-2 rounded-sm cursor-pointer"
              >
                Clear
              </button>
              <button
                onClick={toggleMarkedForReview}
                className={`text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-2 rounded-sm cursor-pointer border ${
                  markedForReview.includes(activeQuestion.id)
                    ? "bg-amber-500/15 border-amber-500 text-amber-500"
                    : "border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                Review
              </button>
              <button
                onClick={toggleBookmark}
                className={`text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-2 rounded-sm cursor-pointer border ${
                  bookmarks.includes(activeQuestion.id)
                    ? "bg-purple-500/15 border-purple-500 text-purple-500"
                    : "border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                Bookmark
              </button>
            </div>

            <div className="flex justify-between sm:justify-end gap-2 w-full sm:w-auto">
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => prev - 1)}
                className="flex-1 sm:flex-none border border-border hover:bg-muted text-[10px] sm:text-xs font-bold px-4 py-2 rounded-sm disabled:opacity-50 cursor-pointer"
              >
                Previous
              </button>
              <button
                disabled={currentIndex === questions.length - 1}
                onClick={() => setCurrentIndex((prev) => prev + 1)}
                className="flex-1 sm:flex-none bg-brand-navy dark:bg-slate-800 text-white hover:bg-slate-800 font-bold text-[10px] sm:text-xs px-4 py-2 rounded-sm disabled:opacity-50 cursor-pointer"
              >
                Save & Next
              </button>
            </div>
          </div>
        </div>

        {/* Right Section: Static Desktop Sidebar (Completely hidden on mobile viewports) */}
        <div className="hidden lg:flex lg:col-span-4 border border-border bg-card rounded-sm p-5 flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wide border-b border-border pb-3 text-muted-foreground">
              Overview
            </h3>

            {/* Nav Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3 max-h-[300px] lg:max-h-none overflow-y-auto pr-1">
              {questions.map((q: Question, idx: number) => {
                const isCurrent = idx === currentIndex;
                const hasAnswer = responses[q.id] && responses[q.id].length > 0;
                const isMarked = markedForReview.includes(q.id);
                const isBookmarked = bookmarks.includes(q.id);

                let cellClass = "border border-border text-muted-foreground hover:bg-muted";

                if (isCurrent) {
                  cellClass = "border-2 border-brand-blue text-brand-blue font-bold";
                } else if (isMarked) {
                  cellClass = "bg-amber-500 text-white border-amber-500";
                } else if (hasAnswer) {
                  cellClass = "bg-emerald-600 text-white border-emerald-600";
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-10 rounded-sm text-xs flex flex-col items-center justify-center relative cursor-pointer font-medium ${cellClass}`}
                  >
                    <span>{idx + 1}</span>
                    {isCurrent && hasAnswer && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-0.5" />
                    )}
                    {isBookmarked && (
                      <span className="absolute top-1 right-1 w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-purple-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-border pt-4 space-y-3">
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Legend</h4>
            <div className="grid grid-cols-2 gap-3 text-[10px] sm:text-xs text-muted-foreground">
              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 bg-emerald-600 border border-emerald-600 rounded-sm" />
                <span>Answered</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 bg-amber-500 border border-amber-500 rounded-sm" />
                <span>For Review</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 border border-border bg-card rounded-sm" />
                <span>Unattempted</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 border border-border bg-card rounded-sm relative">
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-purple-500" />
                </span>
                <span>Bookmarked</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4 px-4 text-center text-[9px] text-muted-foreground">
        Active tracking interval active. Closing or reloading preserves latest responses locally.
      </footer>
    </div>
  );
}