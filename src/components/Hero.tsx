import React from "react";
import { HERO_IMAGE } from "../data";
import { ArrowRight, Leaf, Compass, Sparkles, ShieldCheck } from "lucide-react";

interface HeroProps {
  onExploreProjects: () => void;
  onScheduleConsult: () => void;
}

export default function Hero({ onExploreProjects, onScheduleConsult }: HeroProps) {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#0B0B0A] font-sans" id="hero-section">
      {/* Background Graphic Asset */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="Earth Firm Modern Architectural Showcase Home"
          className="w-full h-full object-cover transition-all duration-700 scale-105 animate-[subtle-zoom_20s_infinite_alternate]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0A] via-[#0B0B0A]/40 to-[#0B0B0A]/10" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#0B0B0A] to-transparent" />
      </div>

      {/* Decorative vertical blueprint coordinate lines */}
      <div className="absolute inset-0 z-0 hidden lg:flex justify-between pointer-events-none px-12 opacity-20">
        <div className="border-l border-dashed border-white/10 h-full" />
        <div className="border-l border-dashed border-white/10 h-full" />
        <div className="border-l border-dashed border-white/10 h-full" />
        <div className="border-l border-dashed border-white/10 h-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full flex flex-col justify-center">
        {/* Subtle Brand Tagline */}
        <div className="inline-flex items-center gap-2 bg-[#141413]/80 backdrop-blur-md px-3 py-1.5 border border-white/10 rounded-none w-fit mb-6" id="hero-mini-tag">
          <Leaf className="w-4 h-4 text-[var(--color-terra-cotta)] stroke-[1.5]" />
          <span className="font-mono text-[10px] text-[#E5E3DF] uppercase tracking-widest font-semibold">
            BIOPHILIC & REGENERATIVE ARCHITECTURE
          </span>
        </div>

        {/* Main Brand Title & Value Statement */}
        <div className="max-w-4xl" id="hero-copy">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-light text-[#E5E3DF] uppercase tracking-tight leading-[1.05] mb-6">
            Designing with <span className="font-normal italic text-zinc-500 pointer-events-none font-serif">Earth</span>,<br />
            Living in <span className="font-medium text-[#E5E3DF] underline decoration-[var(--color-earthy-sage)] underline-offset-8">Light</span>
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-2xl mb-10 font-normal">
            Earth Firm Architects crafts high-performance sustainable spaces that dissolve the borders between human sanctuary and raw living environment. Driven by material honesty and passive bioclimatic design.
          </p>
        </div>

        {/* Action Triggers */}
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center" id="hero-actions">
          <button
            onClick={onExploreProjects}
            className="cursor-pointer font-sans text-xs uppercase tracking-widest flex items-center justify-center gap-2 bg-[var(--color-earthy-sage)] hover:bg-[var(--color-earthy-sage)]/90 text-white font-bold px-7 py-4 rounded-none transition-all duration-300 shadow-none hover:shadow-md group"
          >
            Explore Portfolio
            <ArrowRight className="w-4 h-4 stroke-[2] transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          <button
            onClick={onScheduleConsult}
            className="cursor-pointer font-sans text-xs uppercase tracking-widest flex items-center justify-center gap-2 border border-white/20 hover:border-white text-[#E5E3DF] hover:bg-zinc-800 px-7 py-4 rounded-none transition-all duration-300 bg-transparent backdrop-blur"
          >
            Contact Us
          </button>
        </div>

        {/* Quick USP Grid in Hero Footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 pt-8 border-t border-white/10 text-left max-w-5xl" id="hero-usps">
          <div>
            <div className="text-xs uppercase tracking-widest text-zinc-600 mb-1 font-mono">01 / LOCALITY</div>
            <div className="text-[#E5E3DF] hover:text-white transition-colors text-sm font-medium">90% Raw Native Materials</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-zinc-700 mb-1 font-mono">02 / NATURE</div>
            <div className="text-[E5E3DF] hover:text-white transition-colors text-sm font-medium">Biophilic Light Wells</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-zinc-700 mb-1 font-mono">03 / PERFORMANCE</div>
            <div className="text-[E5E3DF] hover:text-white transition-colors text-sm font-medium">Passive Solar Comfort</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-zinc-700 mb-1 font-mono">04 / CIRCULAR</div>
            <div className="text-[E5E3DF] hover:text-white transition-colors text-sm font-medium">Zero Waste Assemblies</div>
          </div>
        </div>
      </div>
    </section>
  );
}
