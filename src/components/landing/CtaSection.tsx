import React from "react";
import PortalAccess from "./PortalAccess";

export default function CtaSection() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center relative overflow-hidden">
      {/* Center card element with radial gradient wash */}
      <div className="border border-border/80 dark:border-border/40 rounded-sm bg-card/40 backdrop-blur-sm p-8 sm:p-12 space-y-8 flex flex-col items-center relative overflow-hidden">
        <div className="space-y-3 max-w-xl">
          <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
            Ready to evaluate cleanly?
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Join developers who test without the noise. No trackers, no bloat — just structured knowledge validation.
          </p>
        </div>

        {/* Floating Portal Access Card */}
        <div id="portal-card" className="w-full max-w-md mx-auto relative z-10 scroll-mt-24">
          <PortalAccess />
        </div>
      </div>
    </section>
  );
}