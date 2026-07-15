import React from "react";

interface FeatureCardProps {
  title: string;
  desc: string;
  icon: React.ReactNode;
}

function FeatureCard({ title, desc, icon }: FeatureCardProps) {
  return (
    <div className="group border border-border p-6 rounded-sm bg-card/40 backdrop-blur-sm relative overflow-hidden hover:shadow-lg hover:-translate-y-1 hover:border-brand-blue/20 transition-all duration-300 space-y-4">
      {/* Scalable Hover-Glow border-top line */}
      <span className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-brand-orange to-brand-blue scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
      
      {/* 40px Icon wrapper */}
      <div className="w-10 h-10 rounded-sm bg-muted flex items-center justify-center flex-shrink-0">
        {icon}
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold tracking-wide text-foreground">{title}</h3>
        {/* High-contrast dark text class mapping */}
        <p className="text-xs text-muted-foreground dark:text-slate-300 leading-relaxed font-normal">{desc}</p>
      </div>
    </div>
  );
}

export default function FeaturesSection() {
  return (
    <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 space-y-12">
      <div className="space-y-2 text-center max-w-xl mx-auto">
        <h2 className="text-3xl font-extrabold tracking-tight">Built for focused evaluation</h2>
        <p className="text-xs text-muted-foreground">Every feature designed to remove friction from technical assessments.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard
          title="Multi-channel auth"
          desc="Secure edge-compliant authentication supporting Google OAuth and passwordless email OTP verification via Nodemailer."
          icon={
            <svg className="w-5 h-5 text-brand-blue" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          }
        />
        <FeatureCard
          title="Offline schema validation"
          desc="Instant schema checking using browser Zod parsers, returning structural reports without network round-trips."
          icon={
            <svg className="w-5 h-5 text-brand-orange" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          }
        />
        <FeatureCard
          title="Visual progress tracking"
          desc="Custom vector-based progress states, including diagonal striped bookmarks and active-state solved indicators."
          icon={
            <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
            </svg>
          }
        />
        <FeatureCard
          title="Zero-lag performance reports"
          desc="Interactive data reports utilizing native SVG vectors for donut and metrics charts, avoiding main-thread freezes."
          icon={
            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
            </svg>
          }
        />
        <FeatureCard
          title="Attempt comparison timelines"
          desc="Tracks assessment histories dynamically inside Neon, rendering timelines that compare current pacing against your past scores."
          icon={
            <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <FeatureCard
          title="Responsive OT player"
          desc="Test interface built to support collapsible sidebar dropdowns, maintaining proper tap-bounding across mobile devices."
          icon={
            <svg className="w-5 h-5 text-brand-blue" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
            </svg>
          }
        />
      </div>
    </section>
  );
}