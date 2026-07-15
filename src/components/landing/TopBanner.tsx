"use client";

import React from "react";
import CopyButton from "../CopyButton";

export default function TopBanner() {
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

  const rawPromptText = `# SYSTEM INSTRUCTIONS FOR ASSESSMENT GENERATION
Act as an expert technical educator. Generate a diagnostic assessment on the requested topic.
The output MUST be a raw JSON object conforming strictly to the "schemaVersion": "1.0.0" rules.
Do not wrap in Markdown or add conversational text. Return ONLY raw JSON.

CONSTRAINTS:
1. "schemaVersion": "1.0.0" (literal)
2. "testTime": duration in minutes (positive integer)
3. MCQ correctAnswer: MUST be an array of strings containing exactly 1 element matching options exactly, e.g. ["option"]
4. MSQ correctAnswer: MUST be an array of strings containing all correct options exactly, e.g. ["option1", "option2"]
5. Numerical correctAnswer: MUST be a "range" object with "min" and "max" floats.`;

  return (
    <div className="border-b border-border bg-card/60 py-3 px-4 text-xs select-none relative z-10 print:hidden">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Descriptive Summary */}
        <div className="flex flex-col sm:flex-row items-center gap-2 text-center md:text-left">
          <span className="font-bold text-brand-orange uppercase tracking-wider text-[10px]">What is fixIT?</span>
          <span className="text-muted-foreground text-[11px] leading-relaxed">
            An offline-first assessment sandbox. Prompt your AI, validate the JSON schema, and evaluate your knowledge.
          </span>
        </div>
        
        {/* Dynamic Action Buttons */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <CopyButton text={boilerplateJson} label="Copy Schema Template 📋" />
          <CopyButton text={rawPromptText} label="Copy AI Prompt Rules 📋" />
        </div>
      </div>
    </div>
  );
}