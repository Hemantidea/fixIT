"use client";

import React, { useState } from "react";

export default function CodePlayground() {
  const [activeTab, setActiveTab] = useState<"json" | "prompt">("json");
  const [copied, setCopied] = useState(false);

  const rawJsonText = `{
  "schemaVersion": "1.0.0",
  "testTitle": "Advanced CSS Layouts & Architecture",
  "testDescription": "Validate your expertise in CSS Grid, Flexbox alignment, and container queries.",
  "testTime": 20,
  "passingPercentage": 70,
  "difficulty": "medium",
  "tags": ["CSS", "Frontend", "Web Standards"],
  "questions": [
    {
      "id": "css-q1",
      "type": "MCQ",
      "text": "Which property defines how a grid item behaves when the grid container is resized along the inline axis?",
      "topic": "CSS Grid",
      "subtopic": "Sizing & Alignment",
      "difficulty": "medium",
      "marks": 2,
      "negativeMarks": 0.5,
      "options": [
        "justify-self",
        "align-self",
        "grid-row-end",
        "place-items"
      ],
      "correctAnswer": ["justify-self"],
      "explanation": "justify-self aligns a grid item inside its cell along the inline (row) axis.",
      "referenceUrl": "https://developer.mozilla.org/en-US/docs/Web/CSS/justify-self"
    },
    {
      "id": "css-q2",
      "type": "MSQ",
      "text": "Which values are valid container-type property declarations? (Select all that apply)",
      "topic": "Responsive Design",
      "subtopic": "Container Queries",
      "difficulty": "hard",
      "marks": 3,
      "negativeMarks": 1.0,
      "options": [
        "size",
        "inline-size",
        "normal",
        "block-size"
      ],
      "correctAnswer": ["size", "inline-size", "normal"],
      "explanation": "'block-size' is not a valid container-type. Valid parameters are 'size', 'inline-size', and 'normal'.",
      "referenceUrl": "https://developer.mozilla.org/en-US/docs/Web/CSS/container-type"
    },
    {
      "id": "css-q3",
      "type": "NUMERICAL",
      "text": "Calculate the computed pixel width of an element with container width of 800px styled with width: calc(50cqw - 20px).",
      "topic": "Responsive Design",
      "subtopic": "Container Query Units",
      "difficulty": "medium",
      "marks": 2,
      "negativeMarks": 0,
      "range": {
        "min": 379.9,
        "max": 380.1
      },
      "explanation": "50% of the query container width (800px * 0.50 = 400px). Subtracting 20px results in exactly 380px.",
      "referenceUrl": "https://developer.mozilla.org/en-US/docs/Web/CSS/css_container_queries"
    }
  ]
}`;

  const rawPromptText = `# SYSTEM INSTRUCTIONS FOR ASSESSMENT GENERATION
Act as an expert technical educator. Generate a diagnostic assessment on the requested topic.
The output MUST be a raw JSON object conforming strictly to the "schemaVersion": "1.0.0" rules.
Do not wrap in Markdown or add conversational text. Return ONLY raw JSON.

CONSTRAINTS:
1. "schemaVersion": "1.0.0" (literal)
2. "testTitle": short title
3. "testDescription": concept summary
4. "testTime": duration in minutes (positive integer)
5. "passingPercentage": threshold value (1-100)
6. "difficulty": "easy" | "medium" | "hard"
7. "tags": string array
8. "questions": array of objects containing at least 3-10 questions

QUESTION TYPES AND EXPECTED SCHEMAS:

A. MCQ (Multiple Choice) Question Node:
   - "id": unique string
   - "type": "MCQ"
   - "text": question prompt
   - "topic": concept classification
   - "marks": point value (integer)
   - "negativeMarks": penalty value (float)
   - "options": exactly 4 strings
   - "correctAnswer": MUST be an array of strings containing exactly 1 element matching options exactly, e.g. ["option"]
   - "explanation": reasoning detail
   - "referenceUrl": optional string

B. MSQ (Multiple Selection) Question Node:
   - "id": unique string
   - "type": "MSQ"
   - "text": select all matching statement options...
   - "topic": concept classification
   - "marks": point value (integer)
   - "negativeMarks": penalty value (float)
   - "options": 4 to 6 strings
   - "correctAnswer": array of strings matching options exactly, e.g. ["option1", "option2"]
   - "explanation": reasoning detail

C. NUMERICAL Question Node:
   - "id": unique string
   - "type": "NUMERICAL"
   - "text": math/numerical calculations query
   - "topic": concept classification
   - "marks": point value (integer)
   - "negativeMarks": penalty value (float)
   - "range": { "min": float, "max": float }
   - "explanation": math derivation steps`;

  const handleCopy = async () => {
    const textToCopy = activeTab === "json" ? rawJsonText : rawPromptText;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    // Redesigned with transparent frosted glassmorphism bg (bg-slate-100/40 light, bg-[#0B0F17]/40 dark)
    <div className="border border-border/80 dark:border-border/40 rounded-sm bg-slate-100/40 dark:bg-[#0B0F17]/40 backdrop-blur-md overflow-hidden text-left flex flex-col justify-between h-[520px] shadow-xl relative">
      
      {/* Terminal Window Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border bg-slate-200/50 dark:bg-[#111827]/60 select-none">
        
        {/* Left Hand: Controls */}
        <div className="flex items-center space-x-3 px-4 py-3 sm:py-0">
          <div className="flex space-x-1.5 flex-shrink-0">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
          </div>
          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-semibold tracking-wider uppercase pl-2 border-l border-border/60">
            {activeTab === "json" ? "fixit-template.json" : "prompt-directives.md"}
          </span>
        </div>

        {/* Right Hand: Tabs */}
        <div className="flex border-t sm:border-t-0 border-border text-xs font-semibold">
          <button
            onClick={() => setActiveTab("json")}
            className={`px-4 py-3 border-r border-l border-border transition-colors cursor-pointer ${
              activeTab === "json"
                ? "bg-[#0B0F17]/40 dark:bg-[#0B0F17]/10 text-emerald-600 dark:text-emerald-400 border-b-2 border-b-emerald-500"
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-[#1f2937]"
            }`}
          >
            JSON Schema
          </button>
          <button
            onClick={() => setActiveTab("prompt")}
            className={`px-4 py-3 border-r border-border transition-colors cursor-pointer ${
              activeTab === "prompt"
                ? "bg-[#0B0F17]/40 dark:bg-[#0B0F17]/10 text-emerald-600 dark:text-emerald-400 border-b-2 border-b-emerald-500"
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-[#1f2937]"
            }`}
          >
            AI Prompt rules
          </button>
        </div>
      </div>

      {/* Code Text Area with Responsive Light/Dark Syntax Highlighting */}
      <div className="p-5 font-mono text-[11px] sm:text-xs overflow-y-auto flex-1 leading-relaxed text-slate-700 dark:text-slate-300 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        <pre className="whitespace-pre">
          {activeTab === "json" ? (
            <code>
              <span className="text-slate-400 dark:text-slate-500">{"{"}</span>{"\n"}
              {"  "}<span className="text-brand-orange">"schemaVersion"</span>: <span className="text-emerald-600 dark:text-emerald-400">"1.0.0"</span>,{"\n"}
              {"  "}<span className="text-brand-orange">"testTitle"</span>: <span className="text-emerald-600 dark:text-emerald-400">"Advanced CSS Layouts & Architecture"</span>,{"\n"}
              {"  "}<span className="text-brand-orange">"testDescription"</span>: <span className="text-emerald-600 dark:text-emerald-400">"Validate your expertise in CSS Grid, Flexbox, and container queries."</span>,{"\n"}
              {"  "}<span className="text-brand-orange">"testTime"</span>: <span className="text-blue-600 dark:text-blue-400">20</span>,{"\n"}
              {"  "}<span className="text-brand-orange">"passingPercentage"</span>: <span className="text-blue-600 dark:text-blue-400">70</span>,{"\n"}
              {"  "}<span className="text-brand-orange">"difficulty"</span>: <span className="text-emerald-600 dark:text-emerald-400">"medium"</span>,{"\n"}
              {"  "}<span className="text-brand-orange">"tags"</span>: <span className="text-slate-400 dark:text-slate-500">[</span><span className="text-emerald-600 dark:text-emerald-400">"CSS"</span>, <span className="text-emerald-600 dark:text-emerald-400">"Frontend"</span><span className="text-slate-400 dark:text-slate-500">]</span>,{"\n"}
              {"  "}<span className="text-brand-orange">"questions"</span>: <span className="text-slate-400 dark:text-slate-500">[</span>{"\n"}
              {"    "}<span className="text-slate-400 dark:text-slate-500">{"{"}</span>{"\n"}
              {"      "}<span className="text-brand-orange">"id"</span>: <span className="text-emerald-600 dark:text-emerald-400">"css-q1"</span>,{"\n"}
              {"      "}<span className="text-brand-orange">"type"</span>: <span className="text-emerald-600 dark:text-emerald-400">"MCQ"</span>,{"\n"}
              {"      "}<span className="text-brand-orange">"text"</span>: <span className="text-emerald-600 dark:text-emerald-400">"Which property defines how a grid item behaves along the inline axis?"</span>,{"\n"}
              {"      "}<span className="text-brand-orange">"topic"</span>: <span className="text-emerald-600 dark:text-emerald-400">"CSS Grid"</span>,{"\n"}
              {"      "}<span className="text-brand-orange">"marks"</span>: <span className="text-blue-600 dark:text-blue-400">2</span>,{"\n"}
              {"      "}<span className="text-brand-orange">"negativeMarks"</span>: <span className="text-blue-600 dark:text-blue-400">0.5</span>,{"\n"}
              {"      "}<span className="text-brand-orange">"options"</span>: <span className="text-slate-400 dark:text-slate-500">[</span>{"\n"}
              {"        "}<span className="text-emerald-600 dark:text-emerald-400">"justify-self"</span>,{"\n"}
              {"        "}<span className="text-emerald-600 dark:text-emerald-400">"align-self"</span>,{"\n"}
              {"        "}<span className="text-emerald-600 dark:text-emerald-400">"grid-row-end"</span>,{"\n"}
              {"        "}<span className="text-emerald-600 dark:text-emerald-400">"place-items"</span>{"\n"}
              {"      "}<span className="text-slate-400 dark:text-slate-500">]</span>,{"\n"}
              {"      "}<span className="text-brand-orange">"correctAnswer"</span>: <span className="text-slate-400 dark:text-slate-500">[</span><span className="text-emerald-600 dark:text-emerald-400">"justify-self"</span><span className="text-slate-400 dark:text-slate-500">]</span>,{"\n"}
              {"      "}<span className="text-brand-orange">"explanation"</span>: <span className="text-emerald-600 dark:text-emerald-400">"justify-self aligns a grid item inside its cell along the inline axis."</span>{"\n"}
              {"    "}<span className="text-slate-400 dark:text-slate-500">{"}"}</span>,{"\n"}
              {"    "}<span className="text-slate-400 dark:text-slate-500">{"{"}</span>{"\n"}
              {"      "}<span className="text-brand-orange">"id"</span>: <span className="text-emerald-600 dark:text-emerald-400">"css-q2"</span>,{"\n"}
              {"      "}<span className="text-brand-orange">"type"</span>: <span className="text-emerald-600 dark:text-emerald-400">"MSQ"</span>,{"\n"}
              {"      "}<span className="text-brand-orange">"text"</span>: <span className="text-emerald-600 dark:text-emerald-400">"Which values are valid container-type property declarations?"</span>,{"\n"}
              {"      "}<span className="text-brand-orange">"topic"</span>: <span className="text-emerald-600 dark:text-emerald-400">"Responsive Design"</span>,{"\n"}
              {"      "}<span className="text-brand-orange">"marks"</span>: <span className="text-blue-600 dark:text-blue-400">3</span>,{"\n"}
              {"      "}<span className="text-brand-orange">"negativeMarks"</span>: <span className="text-blue-600 dark:text-blue-400">1.0</span>,{"\n"}
              {"      "}<span className="text-brand-orange">"options"</span>: <span className="text-slate-400 dark:text-slate-500">[</span>{"\n"}
              {"        "}<span className="text-emerald-600 dark:text-emerald-400">"size"</span>,{"\n"}
              {"        "}<span className="text-emerald-600 dark:text-emerald-400">"inline-size"</span>,{"\n"}
              {"        "}<span className="text-emerald-600 dark:text-emerald-400">"normal"</span>,{"\n"}
              {"        "}<span className="text-emerald-600 dark:text-emerald-400">"block-size"</span>{"\n"}
              {"      "}<span className="text-slate-400 dark:text-slate-500">]</span>,{"\n"}
              {"      "}<span className="text-brand-orange">"correctAnswer"</span>: <span className="text-slate-400 dark:text-slate-500">[</span><span className="text-emerald-600 dark:text-emerald-400">"size"</span>, <span className="text-emerald-600 dark:text-emerald-400">"inline-size"</span>, <span className="text-emerald-600 dark:text-emerald-400">"normal"</span><span className="text-slate-400 dark:text-slate-500">]</span>,{"\n"}
              {"      "}<span className="text-brand-orange">"explanation"</span>: <span className="text-emerald-600 dark:text-emerald-400">"'block-size' is not a valid container-type declaration."</span>{"\n"}
              {"    "}<span className="text-slate-400 dark:text-slate-500">{"}"}</span>,{"\n"}
              {"    "}<span className="text-slate-400 dark:text-slate-500">{"{"}</span>{"\n"}
              {"      "}<span className="text-brand-orange">"id"</span>: <span className="text-emerald-600 dark:text-emerald-400">"css-q3"</span>,{"\n"}
              {"      "}<span className="text-brand-orange">"type"</span>: <span className="text-emerald-600 dark:text-emerald-400">"NUMERICAL"</span>,{"\n"}
              {"      "}<span className="text-brand-orange">"text"</span>: <span className="text-emerald-600 dark:text-emerald-400">"Calculate computed width of calc(50cqw - 20px) where container is 800px."</span>,{"\n"}
              {"      "}<span className="text-brand-orange">"topic"</span>: <span className="text-emerald-600 dark:text-emerald-400">"Responsive Design"</span>,{"\n"}
              {"      "}<span className="text-brand-orange">"marks"</span>: <span className="text-blue-600 dark:text-blue-400">2</span>,{"\n"}
              {"      "}<span className="text-brand-orange">"negativeMarks"</span>: <span className="text-blue-600 dark:text-blue-400">0</span>,{"\n"}
              {"      "}<span className="text-brand-orange">"range"</span>: <span className="text-slate-400 dark:text-slate-500">{"{"}</span>{"\n"}
              {"        "}<span className="text-brand-orange">"min"</span>: <span className="text-blue-600 dark:text-blue-400">379.9</span>,{"\n"}
              {"        "}<span className="text-brand-orange">"max"</span>: <span className="text-blue-400">380.1</span>{"\n"}
              {"      "}<span className="text-slate-400 dark:text-slate-500">{"}"}</span>,{"\n"}
              {"      "}<span className="text-brand-orange">"explanation"</span>: <span className="text-emerald-600 dark:text-emerald-400">"50% of container (800px) is 400px. 400px - 20px is 380px."</span>{"\n"}
              {"    "}<span className="text-slate-400 dark:text-slate-500">{"}"}</span>{"\n"}
              {"  "}<span className="text-slate-400 dark:text-slate-500">]</span>{"\n"}
              <span className="text-slate-400 dark:text-slate-500">{"}"}</span>
            </code>
          ) : (
            <code className="whitespace-pre-wrap block text-slate-700 dark:text-slate-300">
              <span className="text-slate-400 dark:text-slate-500"># SYSTEM INSTRUCTIONS FOR ASSESSMENT GENERATION</span>{"\n"}
              <span className="text-slate-500 dark:text-slate-400">Act as an expert technical educator. Generate a diagnostic assessment on the requested topic.</span>{"\n"}
              <span className="text-slate-500 dark:text-slate-400">The output MUST be a raw JSON object conforming strictly to the "schemaVersion": "1.0.0" rules.</span>{"\n"}
              <span className="text-slate-500 dark:text-slate-400">Do not wrap in Markdown or add conversational text. Return ONLY raw JSON.</span>{"\n"}{"\n"}
              
              <span className="text-brand-orange">GLOBAL METADATA CONSTRAINTS:</span>{"\n"}
              <span className="text-slate-400 dark:text-slate-500">1.</span> <span className="text-brand-blue">"schemaVersion":</span> <span className="text-emerald-600 dark:text-emerald-400">"1.0.0" (literal)</span>{"\n"}
              <span className="text-slate-400 dark:text-slate-500">2.</span> <span className="text-brand-blue">"testTitle":</span> <span className="text-slate-600 dark:text-slate-400">assessment title string</span>{"\n"}
              <span className="text-slate-400 dark:text-slate-500">3.</span> <span className="text-brand-blue">"testDescription":</span> <span className="text-slate-600 dark:text-slate-400">concept mapping description</span>{"\n"}
              <span className="text-slate-400 dark:text-slate-500">4.</span> <span className="text-brand-blue">"testTime":</span> <span className="text-blue-600 dark:text-blue-400">duration limit in minutes (positive integer)</span>{"\n"}
              <span className="text-slate-400 dark:text-slate-500">5.</span> <span className="text-brand-blue">"passingPercentage":</span> <span className="text-blue-600 dark:text-blue-400">threshold bounds (1-100 integer)</span>{"\n"}
              <span className="text-slate-400 dark:text-slate-500">6.</span> <span className="text-brand-blue">"difficulty":</span> <span className="text-emerald-600 dark:text-emerald-400">"easy" | "medium" | "hard"</span>{"\n"}
              <span className="text-slate-400 dark:text-slate-500">7.</span> <span className="text-brand-blue">"tags":</span> <span className="text-slate-600 dark:text-slate-400">string array of subject classifications</span>{"\n"}{"\n"}

              <span className="text-brand-orange">QUESTION TYPE SCHEMAS:</span>{"\n"}{"\n"}
              
              <span className="text-brand-blue">A. MCQ (Multiple Choice) Node:</span>{"\n"}
              <span className="text-slate-400 dark:text-slate-500">-</span> <span className="text-brand-orange">"type":</span> <span className="text-emerald-600 dark:text-emerald-400">"MCQ"</span>{"\n"}
              <span className="text-slate-400 dark:text-slate-500">-</span> <span className="text-brand-orange">"options":</span> <span className="text-slate-600 dark:text-slate-400">exactly 4 strings</span>{"\n"}
              <span className="text-slate-400 dark:text-slate-500">-</span> <span className="text-brand-orange">"correctAnswer":</span> <span className="text-emerald-600 dark:text-emerald-400">MUST be an array of strings containing exactly 1 element matching options exactly, e.g. ["option"]</span>{"\n"}{"\n"}

              <span className="text-brand-blue">B. MSQ (Multiple Selection) Node:</span>{"\n"}
              <span className="text-slate-400 dark:text-slate-500">-</span> <span className="text-brand-orange">"type":</span> <span className="text-emerald-600 dark:text-emerald-400">"MSQ"</span>{"\n"}
              <span className="text-slate-400 dark:text-slate-500">-</span> <span className="text-brand-orange">"options":</span> <span className="text-slate-600 dark:text-slate-400">4 to 6 strings</span>{"\n"}
              <span className="text-slate-400 dark:text-slate-500">-</span> <span className="text-brand-orange">"correctAnswer":</span> <span className="text-emerald-600 dark:text-emerald-400">MUST be an array of strings containing all correct options exactly, e.g. ["option1", "option2"]</span>{"\n"}{"\n"}

              <span className="text-brand-blue">C. NUMERICAL Node:</span>{"\n"}
              <span className="text-slate-400 dark:text-slate-500">-</span> <span className="text-brand-orange">"type":</span> <span className="text-emerald-600 dark:text-emerald-400">"NUMERICAL"</span>{"\n"}
              <span className="text-slate-400 dark:text-slate-500">-</span> <span className="text-slate-600 dark:text-slate-400">No "options" or "correctAnswer" properties permitted</span>{"\n"}
              <span className="text-slate-400 dark:text-slate-500">-</span> <span className="text-brand-orange">"range":</span> <span className="text-slate-400 dark:text-slate-500">{"{"}</span> <span className="text-brand-orange">"min"</span>: <span className="text-blue-600 dark:text-blue-400">float</span>, <span className="text-brand-orange">"max"</span>: <span className="text-blue-600 dark:text-blue-400">float</span> <span className="text-slate-400 dark:text-slate-500">{"}"}</span>
            </code>
          )}
        </pre>
      </div>

      {/* Terminal Footer */}
      <div className="border-t border-border bg-[#111827] px-4 py-2.5 flex items-center justify-between text-xs text-slate-400 select-none">
        <span className="font-mono">{activeTab === "json" ? "fixit-schema.json" : "system-prompt.txt"}</span>
        <button
          onClick={handleCopy}
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1 rounded-sm transition-colors font-semibold cursor-pointer"
        >
          {copied ? "Copied ✓" : "Copy to clipboard"}
        </button>
      </div>
    </div>
  );
}