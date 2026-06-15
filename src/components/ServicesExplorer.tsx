import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  SERVICES, PROJECTS, HERO_IMAGE, ARCHITECTURE_IMAGE, INTERIOR_IMAGE, LANDSCAPE_IMAGE, CLIENTS 
} from "../data";
import { Client } from "../types";
import { 
  Compass, Hammer, Trees, Users, ChevronRight, Building2
} from "lucide-react";
import LazyImage from "./LazyImage";
import { fetchLocalTeam } from "../utils/localStorageDb";

interface TeamMember {
  id: string;
  name: string;
  title: string;
}

export default function ServicesExplorer() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    const loadTeam = async () => {
      const data = await fetchLocalTeam();
      setTeamMembers(data);
    };
    loadTeam();
    
    const handleUpdate = async () => {
      const data = await fetchLocalTeam();
      setTeamMembers(data);
    };
    
    window.addEventListener("earthfirm_data_updated", handleUpdate);
    return () => window.removeEventListener("earthfirm_data_updated", handleUpdate);
  }, []);
  // Navigation tabs for clients
  const [activeClient, setActiveClient] = useState<Client>(CLIENTS[0]);

  // Core Pillars of Earth Firm Architecture & Design
  const PILLARS = [
    {
      id: "biophilic",
      title: "Biophilic Integrity",
      subtitle: "Flora-Responsive Engineering",
      description: "We don't plant gardens around buildings; we carve spaces out of living ecosystems. Our work focuses on physical mental restoration, optimizing indoor oxygen cycles, automated flora irrigation, and raw non-toxic habitats.",
      icon: Trees,
    },
    {
      id: "thermal-mass",
      title: "Climatic Thermal Mass",
      subtitle: "Zero-Air-Con Potential",
      description: "By integrating custom rammed earth slabs, board-formed concrete walls, and natural cross-ventilation facades, our structures remain naturally cool under harsh summer sun and warm during cold winter nights.",
      icon: Compass,
    },
    {
      id: "material-honesty",
      title: "Tectonic Material Honesty",
      subtitle: "Unprocessed Raw Metallurgy",
      description: "Every element retains its voice. We prioritize untreated local stone, oiled timber veneers, rust-patinated corten steels, and porous lime plasters that grow gracefully alongside local climatic cycles.",
      icon: Hammer,
    }
  ];

  // Redesigned 5-phase "THE METHOD" workflow schema matching screenshot
  const COGNITIVE_PHASES = [
    {
      step: "01",
      title: "Understanding your life",
      details: "We begin by listening — to rituals, memories, and the rhythm of your everyday."
    },
    {
      step: "02",
      title: "Translating emotion into design",
      details: "Concept sketches that transform feelings into form, light, and proportion."
    },
    {
      step: "03",
      title: "Material + light harmony",
      details: "Curated palettes of stone, timber, and lime that age with grace."
    },
    {
      step: "04",
      title: "Execution with precision",
      details: "Drawings, details, and on-site stewardship — nothing left to chance."
    },
    {
      step: "05",
      title: "Final living experience",
      details: "The moment a space starts to feel like you. Quietly. Completely."
    }
  ];

  return (
    <section className="bg-black py-32 border-t border-white/5 text-[#E5E3DF]" id="how-we-do-it-section">
      <div className="max-w-[1400px] mx-auto px-8 lg:px-12 space-y-32">
        
        {/* ========================================================= */}
        {/* HERO HEADER SECTION (About Earth Firm)                   */}
        {/* ========================================================= */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center" 
          id="manifesto-intro"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="inline-flex items-center gap-2 bg-zinc-950 px-4 py-2 border border-white/10">
              <Users className="w-3.5 h-3.5 text-amber-500" />
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-400 font-bold">About Earth Firm Architects</span>
            </div>
            
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans uppercase tracking-[0.08em] xs:tracking-[0.12em] lg:tracking-[0.15em] leading-[1.1] text-white">
              <span className="text-amber-500">Sovereign Ecology</span> <br />
              Meet Honest Structures
            </h2>
            
            <p className="text-zinc-500 text-lg md:text-xl font-sans leading-relaxed max-w-2xl">
              Rather than treating buildings as abstract blocks dropped onto the landscape, Earth Firm behaves as an evolutionary builder. We extract lessons from local geology, sun vectors, and native biospheric cycles to craft long-lasting landmarks.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
              {PILLARS.map((p, idx) => {
                const IconComp = p.icon;
                return (
                  <motion.div 
                    key={idx} 
                    className="border border-white/5 bg-zinc-950/50 p-6 space-y-4"
                    whileHover={{ y: -5, borderColor: "rgba(245, 158, 11, 0.3)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <div className="w-10 h-10 bg-zinc-900 border border-white/10 flex items-center justify-center">
                      <IconComp className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-sans text-sm font-bold uppercase tracking-wider text-white">{p.title}</h4>
                      <p className="text-zinc-500 text-[12px] font-sans leading-relaxed mt-2">{p.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5 relative" id="manifesto-preview-banner">
            <div className="aspect-[4/5] overflow-hidden border border-white/10 bg-zinc-900 shadow-2xl relative group">
              <LazyImage 
                src={HERO_IMAGE} 
                alt="Earth Firm Construction Landscape" 
                className="w-full h-full"
                imgClassName="grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105 brightness-75 group-hover:brightness-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none opacity-80" />
              
              <div className="absolute bottom-8 left-8 right-8 text-white text-left space-y-2">
                <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-amber-500 font-bold">Tectonic Landmark</span>
                <h4 className="font-sans text-xl font-medium uppercase tracking-tight">Active Living Site Sanctuary</h4>
                <p className="text-xs font-sans text-zinc-400 leading-relaxed">
                  Every structural foundation is configured on solar azimuth lines to ensure optimal thermal performance.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ========================================================= */}
        {/* THE METHOD (HOW A SPACE BECOMES YOURS)                    */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start pt-32 border-t border-white/5" id="method-section">
          
          {/* Left Side: Method Header */}
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-4">
              <span className="font-mono text-[10px] text-amber-500 font-bold uppercase tracking-[0.4em] block">
                The Method
              </span>
              <h3 className="text-3xl xs:text-4xl sm:text-4xl md:text-5xl lg:text-7xl font-medium font-sans uppercase tracking-[0.08em] xs:tracking-[0.12em] lg:tracking-[0.15em] leading-[1.1] text-white">
                How a space <br /> becomes <br /> yours
              </h3>
            </div>
            <p className="text-zinc-500 text-lg font-sans max-w-sm leading-relaxed">
              Five quiet phases — from the first conversation to the day you walk in and finally exhale.
            </p>
          </div>

          {/* Right Side: Vertical Timeline Items */}
          <div className="lg:col-span-7 relative">
            {/* Background vertical line */}
            <div className="absolute left-[7px] top-6 bottom-6 w-px bg-white/10" />

            <div className="space-y-16">
              {COGNITIVE_PHASES.map((p, idx) => (
                <motion.div 
                  key={idx} 
                  className="relative pl-14 group"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  {/* Diamond indicator */}
                  <div className="absolute left-0 top-1.5 w-3.5 h-3.5 border border-amber-600 rotate-45 bg-black transition-all duration-500 group-hover:bg-amber-600 group-hover:scale-125 select-none" />
                  
                  <div className="space-y-4">
                    <span className="font-mono text-[11px] text-amber-600 font-bold tracking-[0.3em] uppercase">
                      {p.step}
                    </span>
                    <h4 className="text-3xl md:text-4xl font-light text-white font-sans tracking-wide">
                      {p.title}
                    </h4>
                    <p className="text-zinc-500 text-lg font-sans leading-relaxed max-w-xl">
                      {p.details}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>


        {/* ========================================================= */}
        {/* MEET OUR TEAM                                             */}
        {/* ========================================================= */}
        <motion.div 
          className="space-y-12" 
          id="meet-our-team-section"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          
          {/* Header Title for the team ledger */}
          <div className="text-left space-y-4 max-w-3xl" id="team-header-container">
            <div className="inline-flex items-center gap-1.5 bg-[#141413] text-[#E5E3DF] text-[9px] font-mono uppercase tracking-widest px-2.5 py-1 border border-white/10" id="team-tag">
              <Users className="w-3 h-3 text-[#E7A58E]" />
              Sovereign Studio Directors & Architects
            </div>
            <h3 className="text-2xl md:text-4xl font-light uppercase tracking-tight font-display text-zinc-100 leading-tight" id="team-title">
              Meet Our Team <br />
              <span className="font-serif italic text-zinc-500 font-normal">Evolutionary Builders & Biophilic Designers</span>
            </h3>
            <p className="text-[#E5E3DF]/75 text-xs md:text-sm font-sans leading-relaxed" id="team-description">
              Meet the evolutionary builders, biophilic designers, and material craftsmen drafting the next landscape landmarks. Our team merges traditional tectonic wisdom with modern microclimatic science to create lasting biophilic architectures.
            </p>
          </div>

          {/* Interactive Team Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" id="team-card-grid">
            {teamMembers.map((member) => (
              <motion.div
                key={member.id}
                id={`team-member-${member.id}`}
                className="bg-[#141413] border border-white/10 p-6 flex flex-col justify-between space-y-6 transition-colors duration-300 shadow-3xs"
                whileHover={{ 
                  y: -8, 
                  boxShadow: "0 20px 40px -20px rgba(0,0,0,0.5)", 
                  borderColor: "#AA5B3F" 
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="space-y-2">
                  <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#AA5B3F] block font-bold">
                    Team Specialist
                  </span>
                  <h4 className="font-sans text-sm font-extrabold uppercase tracking-tight text-zinc-100 leading-tight" id={`member-name-${member.id}`}>
                    {member.name}
                  </h4>
                  <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest font-semibold" id={`member-title-${member.id}`}>
                    {member.title}
                  </p>
                </div>
                
                <div className="border-t border-dashed border-white/10 pt-4 flex items-center justify-between text-[7.5px] font-mono text-zinc-700">
                  <span>EARTH FIRM</span>
                  <span>MP STATE</span>
                </div>
              </motion.div>
            ))}
          </div>

        </motion.div>

        {/* ========================================================= */}
        {/* OUR CLIENTS SECTION                                       */}
        {/* ========================================================= */}
        <motion.div 
          className="space-y-12 border-t border-white/10 pt-24" 
          id="our-clients-section"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          
          {/* Header block */}
          <div className="text-left space-y-4 max-w-3xl" id="clients-header-container">
            <div className="inline-flex items-center gap-1.5 bg-[#E7A58E] text-[#0B0B0A] text-[9px] font-mono uppercase tracking-widest px-2.5 py-1" id="clients-tag">
              <Building2 className="w-3 h-3 text-[#0B0B0A]" />
              Strategic Alliances & Client Ledgers
            </div>
            <h3 className="text-2xl md:text-3xl font-light uppercase tracking-tight font-display text-zinc-100 leading-tight" id="clients-title">
              Our Clients <br />
              <span className="font-serif italic text-zinc-500 font-normal">Pioneers, Developers & Independent Families</span>
            </h3>
            <p className="text-zinc-400 text-xs md:text-sm font-sans leading-relaxed" id="clients-description">
              We collaborate with visionary private developers, hospitality networks, and independent owner commissions to execute landmark projects throughout the subcontinent. Select any partner below to inspect their structural footprint.
            </p>
          </div>

          {/* Interactive Clients Sandbox */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left" id="clients-interactive-sandbox">
            {/* Left Column: Client list selector (5 columns) */}
            <div className="lg:col-span-5 space-y-2.5" id="clients-list-container">
              {CLIENTS.map((client) => {
                const isSelected = activeClient?.id === client.id;
                return (
                  <button
                    key={client.id}
                    onClick={() => setActiveClient(client)}
                    className={`w-full text-left p-4 md:p-5 border transition-all duration-300 flex items-center justify-between cursor-pointer rounded-none ${
                      isSelected
                        ? "bg-[#E5E3DF] text-[#0B0B0A] border-[#E5E3DF]"
                        : "bg-[#141413] text-zinc-400 border-white/10 hover:border-white/30 hover:bg-[#1E1E1C]"
                    }`}
                    id={`client-selector-${client.id}`}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      {/* Logo Avatar or Monogram */}
                      <div className={`w-10 h-10 shrink-0 flex items-center justify-center font-mono text-xs font-bold border ${
                        isSelected 
                          ? "bg-white/10 border-white/20 text-[#AA5B3F]" 
                          : "bg-zinc-900 border-white/10 text-zinc-600"
                      }`} id={`client-icon-${client.id}`}>
                        {client.logoUrl ? (
                          <LazyImage 
                            src={client.logoUrl} 
                            alt={client.name} 
                            className="w-full h-full" 
                            imgClassName="opacity-100"
                          />
                        ) : (
                          <span>{client.fallbackAcronym}</span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <span className="font-sans text-xs font-extrabold uppercase tracking-wider block truncate">
                          {client.name}
                        </span>
                        <span className={`font-mono text-[8.5px] uppercase ${isSelected ? "text-zinc-600" : "text-zinc-500"}`}>
                          {client.industry}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? "text-[#AA5B3F] translate-x-1" : "text-stone-300"}`} />
                  </button>
                );
              })}
            </div>

            {/* Right Column: Dynamic Profile dossier inspection (7 columns) */}
            <div className="lg:col-span-7 bg-[#141413] border border-white/10 p-6 md:p-8 min-h-[350px] flex flex-col justify-between shadow-3xs" id="client-dossier-panel">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeClient?.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
                    <div className="space-y-1">
                      <span className="font-mono text-[8.5px] bg-[#E5E3DF] text-[#0B0B0A] px-2.5 py-0.5 uppercase tracking-wider font-extrabold shadow-3xs inline-block">
                        Client Dossier Index: {activeClient?.fallbackAcronym}
                      </span>
                      <h4 className="text-xl md:text-2xl font-light text-zinc-100 uppercase tracking-tight font-display">
                        {activeClient?.name}
                      </h4>
                    </div>

                    {activeClient?.logoUrl && (
                      <div className="w-16 h-16 bg-zinc-900 border border-white/10 p-2.5 flex items-center justify-center select-none shadow-3xs hover:scale-102 transition-transform">
                        <LazyImage 
                          src={activeClient.logoUrl} 
                          alt={activeClient.name} 
                          className="w-full h-full"
                          imgClassName="transition-all duration-300"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="font-mono text-[8px] text-zinc-600 uppercase tracking-widest block font-bold">Partnership Engagement Scope:</span>
                      <p className="text-zinc-400 text-xs md:text-sm font-sans leading-relaxed">
                        {activeClient?.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-dashed border-white/10">
                      <div className="space-y-1 bg-[#0B0B0A] border border-white/5 p-3.5">
                        <span className="font-mono text-[8px] text-zinc-600 uppercase tracking-widest block font-bold">Industry Classification:</span>
                        <span className="font-sans text-xs font-bold uppercase tracking-wider text-zinc-300">
                          {activeClient?.industry}
                        </span>
                      </div>

                      <div className="space-y-1 bg-[#0B0B0A] border border-white/5 p-3.5">
                        <span className="font-mono text-[8px] text-zinc-600 uppercase tracking-widest block font-bold">Commissioned Landmark:</span>
                        <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#AA5B3F]">
                          {activeClient?.prominentProject}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4 flex items-center justify-between font-mono text-[8.5px] text-zinc-600">
                    <span>Account Security:</span>
                    <strong className="text-zinc-400 uppercase">OFFICIAL COMMISSION REGISTRATION</strong>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Minimalist Grid of Logos Marquee to mimic static about page */}
          <div className="bg-white/5 border border-white/10 p-6 md:p-8 space-y-6 text-center overflow-hidden" id="clients-logo-ticker">
            <span className="font-mono text-[8px] text-zinc-600 uppercase tracking-widest block font-bold">
              TRUSTED BY PRIVATE ENTERPRISES AND LANDOWNERS ACROSS INDIA
            </span>
            <div className="relative w-full overflow-hidden">
              <motion.div 
                className="flex items-center gap-16 md:gap-32 w-max"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
              >
                {[...CLIENTS, ...CLIENTS].map((client, idx) => (
                  <div 
                    key={`marquee-${client.id}-${idx}`}
                    onClick={() => setActiveClient(client)}
                    className="h-16 w-32 flex items-center justify-center transition-all cursor-pointer"
                  >
                    {client.logoUrl ? (
                      <LazyImage 
                        src={client.logoUrl} 
                        alt={client.name} 
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <span className="font-mono text-sm font-bold uppercase tracking-widest text-zinc-100">{client.fallbackAcronym}</span>
                    )}
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

        </motion.div>

      </div>


    </section>
  );
}
