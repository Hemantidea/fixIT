"use client";

import React, { useState } from "react";

interface CopyButtonProps {
  text: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
}

export default function CopyButton({
  text,
  label = "Copy Boilerplate 📋",
  copiedLabel = "Copied ✓",
  className = "border border-border bg-background hover:bg-muted text-foreground px-3 py-1.5 rounded-sm text-xs font-bold transition-colors cursor-pointer whitespace-nowrap",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy configuration to clipboard:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={className}
      type="button"
    >
      {copied ? copiedLabel : label}
    </button>
  );
}