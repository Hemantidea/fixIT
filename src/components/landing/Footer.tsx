import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background py-8 px-4 text-center text-xs text-muted-foreground relative z-10 print:hidden">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© 2026 fixIT. No external telemetry.</p>
        <span className="text-[10px] font-mono text-muted-foreground/60">
          Made in INDIA | Designed with ❤️ by Hemant Verma 
        </span>
      </div>
    </footer>
  );
}