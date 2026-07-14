"use client";

import React, { useState, useEffect, useRef } from "react";
import { saveTest, getTests, handleSignOut } from "@/app/actions/test";
import Link from "next/link";
import Image from "next/image";
import CopyButton from "../../components/CopyButton";
import CodePlayground from "@/components/CodePlayground";

interface AttemptItem {
  id: string;
  score: number;
  timeSpent: number;
  completedAt: string;
}

interface TestItem {
  id: string;
  title: string;
  description: string;
  timeLimit: number;
  schemaVersion: string;
  createdAt: Date;
  attempts: AttemptItem[];
}

export default function Dashboard() {
  const [tests, setTests] = useState<TestItem[]>([]);
  const [activeTab, setActiveTab] = useState<"upload" | "paste">("upload");
  const [dragActive, setDragActive] = useState(false);
  const [pastedJson, setPastedJson] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [validationSuccess, setValidationSuccess] = useState<string | null>(null);
  const [pendingUploadJson, setPendingUploadJson] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const boilerplateJson = `{
  "schemaVersion": "1.0.0",
  "testTitle": "Assessment Title",
  "testDescription": "Short summary of evaluated concepts.",
  "testTime": 20,
  "passingPercentage": 70,
  "difficulty": "medium",
  "tags": ["ConceptTag"],
  "questions": [
    {
      "id": "q1",
      "type": "MCQ",
      "text": "Your question text here?",
      "topic": "Core Category",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": ["Option A"],
      "explanation": "Detailed explanation of correct solution."
    }
  ]
}`;

  const refreshTests = async () => {
    try {
      const data = await getTests();
      setTests(data as any);
    } catch (err) {
      console.error("Failed to load assessments", err);
    }
  };

  useEffect(() => {
    refreshTests();
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

  const handleOfflineValidation = (text: string, sourceName: string) => {
    setValidationError(null);
    setValidationSuccess(null);
    setPendingUploadJson(null);

    try {
      JSON.parse(text);
      setPendingUploadJson(text);
      setValidationSuccess(`Configuration from ${sourceName} verified. Ready to import.`);
    } catch (err: any) {
      setValidationError(`Syntax Error: ${err.message}`);
    }
  };

  const processFile = (file: File) => {
    if (file.type !== "application/json" && !file.name.endsWith(".json")) {
      setValidationError("File must be a valid .json configuration file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      handleOfflineValidation(text, `"${file.name}"`);
    };
    reader.readAsText(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleImportSubmit = async () => {
    if (!pendingUploadJson) return;

    const result = await saveTest(pendingUploadJson);
    if (result.success) {
      setValidationSuccess("Assessment imported successfully.");
      setPendingUploadJson(null);
      setPastedJson("");
      refreshTests();
      setTimeout(() => setValidationSuccess(null), 3000);
    } else {
      setValidationError(result.error || "Database import transaction failed.");
    }
  };

  const formatSeconds = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      {/* Header */}
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
              <Link href="/dashboard" className="text-brand-blue transition-colors">
                Dashboard
              </Link>
              <Link href="/history" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
                History
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-3">
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
            <button
              onClick={() => handleSignOut()}
              className="bg-brand-navy dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700 font-medium text-xs px-2.5 py-1.5 rounded-sm transition-colors cursor-pointer"
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 md:py-12 flex-1 space-y-12">
        {/* HERO SECTION */}
        <section className="border border-border p-6 rounded-sm bg-card space-y-6">
          <div className="space-y-3 text-center">
            {/* Direct Copy Option inside the Hero Section */}
            
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight">Import Assessment Configuration</h1>
              <p className="text-xs text-muted-foreground">
                Drop an AI-generated JSON file or paste it directly to validate and deploy.
              </p>
            </div>
          </div>

          {/* Toggle Tabs */}
          <div className="flex justify-center border-b border-border text-xs">
            <button
              onClick={() => {
                setActiveTab("upload");
                setValidationError(null);
                setValidationSuccess(null);
              }}
              className={`pb-2 px-6 font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === "upload" ? "border-brand-blue text-brand-blue" : "border-transparent text-muted-foreground"
              }`}
            >
              Upload File
            </button>
            <button
              onClick={() => {
                setActiveTab("paste");
                setValidationError(null);
                setValidationSuccess(null);
              }}
              className={`pb-2 px-6 font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === "paste" ? "border-brand-blue text-brand-blue" : "border-transparent text-muted-foreground"
              }`}
            >
              Paste JSON
            </button>
          </div>

          {/* Tab 1: Upload Panel */}
          {activeTab === "upload" && (
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-sm p-8 text-center cursor-pointer transition-colors ${
                dragActive ? "border-brand-blue bg-blue-50/10" : "border-border bg-card hover:bg-muted"
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => e.target.files && e.target.files[0] && processFile(e.target.files[0])}
                accept=".json"
                className="hidden"
              />
              <p className="text-sm font-medium mb-1">Browse file or drag here</p>
              <p className="text-xs text-muted-foreground">JSON configurations only</p>
            </div>
          )}

          {/* Tab 2: Paste Panel */}
          {activeTab === "paste" && (
            <div className="space-y-3">
              <textarea
                value={pastedJson}
                onChange={(e) => setPastedJson(e.target.value)}
                placeholder="Paste your JSON content here..."
                className="w-full h-44 p-3 border border-border rounded-sm bg-background text-xs font-mono focus:outline-none focus:ring-1 focus:ring-brand-blue resize-none"
              />
              <button
                onClick={() => handleOfflineValidation(pastedJson, "pasted input")}
                disabled={!pastedJson.trim()}
                className="w-full bg-brand-navy dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white py-2 rounded-sm text-xs font-semibold disabled:opacity-50 cursor-pointer"
              >
                Validate JSON Syntax
              </button>
            </div>
          )}

          {/* Error Banner */}
          {validationError && (
            <div className="p-4 border border-red-200 bg-red-50/10 rounded-sm space-y-2 text-xs">
              <p className="font-bold text-red-500">Validation Error</p>
              <pre className="font-mono overflow-x-auto text-muted-foreground whitespace-pre-wrap">
                {validationError}
              </pre>
            </div>
          )}

          {/* Success Banner */}
          {validationSuccess && (
            <div className="p-4 border border-green-200 bg-green-50/10 rounded-sm text-xs space-y-3">
              <p className="font-bold text-green-600">{validationSuccess}</p>
              {pendingUploadJson && (
                <button
                  onClick={handleImportSubmit}
                  className="w-full bg-brand-blue hover:bg-blue-600 text-white py-2 rounded-sm font-semibold cursor-pointer"
                >
                  Confirm Database Import
                </button>
              )}
            </div>
          )}
        </section>


        {/* LIST SECTION: Catalog Listings */}
        <section className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Your Assessments</h2>
            <p className="text-xs text-muted-foreground">Select an assessment to begin testing.</p>
          </div>

          {tests.length === 0 ? (
            <div className="border border-border p-8 rounded-sm text-center bg-card">
              <p className="text-sm text-muted-foreground">No assessments imported yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {tests.map((test) => {
                const visibleAttempts = test.attempts ? test.attempts.slice(0, 3) : [];
                const extraAttemptsCount = test.attempts ? Math.max(0, test.attempts.length - 3) : 0;

                return (
                  <div
                    key={test.id}
                    className="border border-border p-4 sm:p-5 bg-card rounded-sm space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-1 max-w-full sm:max-w-[70%]">
                        <h3 className="font-bold text-base leading-snug">{test.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {test.description}
                        </p>
                        <div className="flex space-x-3 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground pt-1">
                          <span>{test.timeLimit} mins</span>
                          <span>•</span>
                          <span>Schema: {test.schemaVersion}</span>
                        </div>
                      </div>
                      <Link
                        href={`/test/${test.id}`}
                        onClick={() => {
                          try {
                            localStorage.removeItem(`test-autosave-${test.id}`);
                          } catch (e) {
                            console.error(e);
                          }
                        }}
                        className="w-full sm:w-auto bg-brand-blue hover:bg-blue-600 text-white font-semibold text-xs px-4 py-2.5 rounded-sm transition-colors text-center inline-block cursor-pointer whitespace-nowrap"
                      >
                        Start Test
                      </Link>
                    </div>

                    {/* Recent history list */}
                    {test.attempts && test.attempts.length > 0 && (
                      <div className="border-t border-border pt-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                            Recent Attempts (Showing {visibleAttempts.length} of {test.attempts.length})
                          </h4>
                          {extraAttemptsCount > 0 && (
                            <Link href="/history" className="text-[10px] font-bold text-brand-blue hover:underline">
                              View all +{extraAttemptsCount} history →
                            </Link>
                          )}
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          {visibleAttempts.map((attempt, index) => {
                            const formattedDate = new Date(attempt.completedAt).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            });
                            return (
                              <Link
                                href={`/test/results/${attempt.id}`}
                                key={attempt.id}
                                className="flex items-center justify-between p-2 border border-border rounded-sm hover:bg-muted text-xs transition-colors cursor-pointer"
                              >
                                <div className="flex items-center space-x-2">
                                  <span className="text-[10px] font-bold text-muted-foreground">#{test.attempts.length - index}</span>
                                  <span>Attempted on {formattedDate}</span>
                                </div>
                                <div className="flex space-x-4 font-mono text-muted-foreground">
                                  <span className="font-bold text-brand-blue">Score: {attempt.score} pts</span>
                                  <span>Time: {formatSeconds(attempt.timeSpent)}</span>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
                              {/* QUICK PLATFORM GUIDE */}
                               <section className="border border-border p-6 rounded-sm bg-card space-y-6">
                                   <h3 className="font-bold text-sm uppercase tracking-wide border-b border-border pb-3 text-muted-foreground">
                                     Quick Platform Guide
                                   </h3>
                                 <div className="border-t border-border pt-6 space-y-3">
                                   <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">AI Generator Toolkit Reference</h4>
                                   <CodePlayground />
                                 </div>
                                 <div className="space-y-4">
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed text-muted-foreground">
                                     <div className="space-y-2">
                                       <h4 className="font-bold text-foreground text-xs">1. Generate & Import</h4>
                                       <p>
                                         Use an external LLM to generate tests matching the exact JSON schema schemaVersion 1.0.0. Drag-and-drop the generated file or paste the text directly above, validate the inputs offline, and click import to save to Neon.
                                       </p>
                                     </div>
                                     <div className="space-y-2">
                                       <h4 className="font-bold text-foreground text-xs">2. Dynamic Testing & Caching</h4>
                                       <p>
                                         Start your assessment in secure, programmatic fullscreen mode. The engine tracks overall test durations, elapsed times spent per question, active review flags, and bookmarks. Unsubmitted sessions are cached locally.
                                       </p>
                                     </div>
                                     <div className="space-y-2">
                                       <h4 className="font-bold text-foreground text-xs">3. Grading & Scoring</h4>
                                       <p>
                                         MCQs evaluate matching keys, MSQs check exact selections, and Numericals check float ranges. Point calculations process relative weight marks and negative penalties securely before saving to the database.
                                       </p>
                                     </div>
                                     <div className="space-y-2">
                                       <h4 className="font-bold text-foreground text-xs">4. Performance Reporting</h4>
                                       <p>
                                         View accuracy metrics, topic distributions, and historical attempt timelines. Export individual reports to CSV or print clean physical reports directly from your browser.
                                       </p>
                                     </div>
                                   </div>
                                 </div>
                       
                                 {/* Embedded Node.js-Style Code Copier Panel right under the Guide */}
                               </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-4 text-center text-xs text-muted-foreground">
        <p>© 2026 fixIT. No external telemetry.</p>
      </footer>
    </div>
  );
}