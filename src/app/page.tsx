"use client";

import React from "react";
import TopBanner from "../components/landing/TopBanner";
import Header from "../components/landing/Header";
import HeroSection from "../components/landing/HeroSection";
import StatsBar from "../components/landing/StatsBar";
import FeaturesSection from "../components/landing/FeaturesSection";
import TimelineSection from "../components/landing/TimelineSection";
import CtaSection from "../components/landing/CtaSection";
import Footer from "../components/landing/Footer";
import BackgroundEffects from "../components/landing/BackgroundEffects";
import ColorBends from "../components/ColorBends";

export default function LandingPage() {
  return (
    // Transparent parent container to allow background elements to show cleanly
    <div className="min-h-screen text-foreground flex flex-col justify-between relative overflow-hidden">
      
      {/* 1. Global WebGL Layer: Drifting radial-gradient fluid shader */}
      <div className="absolute inset-0 -z-30 opacity-35 dark:opacity-50 select-none pointer-events-none">
        <ColorBends 
          colors={["#FF6B00", "#0070F3"]} 
          speed={0.12} 
          scale={1.2} 
          frequency={1.0} 
          warpStrength={0.9}
          parallax={0.5}
          noise={0.12}
          intensity={1.4}
        />
      </div>

      {/* 2. Global Dot-Matrix Grid Layer (Completely transparent background) */}
      <BackgroundEffects />

      {/* 3. Global Top Informative Banner with Copy Options */}
      {/* <TopBanner /> */}

      {/* 4. Global Navigation Header */}
      <Header />

      {/* 5. Hero Column Section (Left brand text & login card, right transparent editor mockup) */}
      <HeroSection />

      {/* 6. Animated Scoreboard Metrics Stats Bar */}
      <StatsBar />

      {/* 7. Feature Grid Cards */}
      <FeaturesSection />

      {/* 8. Step-by-Step Progress Timeline */}
      <TimelineSection />

      {/* 9. Final Call-To-Action (CTA) Section */}
      <CtaSection />

      {/* 10. Separator and Unified Footer */}
      <Footer />
    </div>
  );
}