import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "motion/react";
import { Leaf, ArrowRight, Building2, Trees, Sparkles, MapPin, Star, ShieldCheck, Quote, Cpu, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { SERVICES, TESTIMONIALS, CLIENTS, HERO_IMAGES, VIDEO_TESTIMONIALS } from "../data";
import { 
  fetchLocalProjects, 
  fetchLocalTestimonials, 
  fetchLocalVideoTestimonials
} from "../utils/localStorageDb";
import { subscribeToProjects } from "../utils/firestoreDb";
import { Project, VideoTestimonial } from "../types";
import { useFirebaseData } from "../context/FirebaseDataContext";
import LazyImage from "./LazyImage";
import Landscape3D from "./Landscape3D";

// Prefetch image utility to ensure zero-lag viewing
const prefetchImage = (url: string) => {
  if (!url) return;
  const img = new Image();
  img.src = url;
};

interface HomeSectionProps {
  onNavigate: (tab: string) => void;
  onExploreProject: (id: string) => void;
}

// Spotlight card component with 3D tilt effects
const SpotlightCard: React.FC<{ 
  proj: Project, 
  idx: number, 
  onExplore: (id: string) => void 
}> = ({ proj, idx, onExplore }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const scale = useMotionValue(1);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });
  const rotateXSpring = useSpring(rotateX, { stiffness: 150, damping: 15, mass: 0.1 });
  const rotateYSpring = useSpring(rotateY, { stiffness: 150, damping: 15, mass: 0.1 });
  const scaleSpring = useSpring(scale, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Magnetic pull
    x.set((e.clientX - centerX) * 0.01); 
    y.set((e.clientY - centerY) * 0.01); 

    // 3D Tilt
    const rotX = (e.clientY - centerY) / (rect.height / 2) * -5; // max 5 deg
    const rotY = (e.clientX - centerX) / (rect.width / 2) * 5; // max 5 deg
    rotateX.set(rotX);
    rotateY.set(rotY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  };

  const handleMouseEnter = () => {
    scale.set(1.01);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: "easeOut" }}
      onClick={() => onExplore(proj.id)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        perspective: 1200,
        x: mouseXSpring,
        y: mouseYSpring,
        rotateX: rotateXSpring,
        rotateY: rotateYSpring,
        scale: scaleSpring,
        transformStyle: "preserve-3d"
      }}
      className="group relative h-[70vh] md:h-[85vh] w-full cursor-pointer overflow-hidden will-change-transform"
    >
      {/* Full-bleed Backdrop */}
      <div className="absolute inset-0 z-0">
        <LazyImage
          src={proj.fullImage}
          alt={proj.title}
          className="w-full h-full"
          imgClassName="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 brightness-75"
        />
        {/* Subtle vignette/gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>

      {/* Content Overlay - Positioned Bottom Left as per screenshot */}
      <div 
        className="absolute bottom-6 xs:bottom-10 md:bottom-16 left-4 xs:left-6 md:left-20 right-4 xs:right-6 md:right-auto z-10 space-y-3 xs:space-y-4 md:space-y-8 max-w-full md:max-w-4xl"
        style={{ transform: "translateZ(80px)" }}
      >
        {/* Sequence & Location */}
        <div className="flex items-center gap-4">
          <span className="font-mono text-[9px] xs:text-[10px] md:text-xs text-zinc-400 uppercase tracking-[0.3em] xs:tracking-[0.4em] font-bold">
            0{idx + 1} <span className="mx-1.5 xs:mx-2 text-zinc-600">·</span> {proj.location || "Principal Location"}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl xs:text-2xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-sans text-white uppercase tracking-[0.08em] sm:tracking-[0.15em] leading-tight group-hover:text-amber-500 transition-colors duration-500 break-words">
          {proj.title}
        </h3>

        {/* Descriptive Quote */}
        <p className="text-zinc-400 font-sans italic text-[10px] xs:text-xs sm:text-sm md:text-lg lg:text-xl xl:text-2xl leading-relaxed max-w-2xl border-l border-amber-500/30 pl-3 xs:pl-4 md:pl-6 line-clamp-3 xs:line-clamp-none">
          "{proj.tagline || proj.description.split('.')[0] + '.'}"
        </p>

        {/* Explore Indicator */}
        <div className="pt-2 md:pt-4 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-4 group-hover:translate-y-0">
          <div className="h-px w-8 md:w-12 bg-amber-500" />
          <span className="font-mono text-[8px] md:text-[9px] uppercase tracking-[0.4em] font-bold text-white">View Details</span>
        </div>
      </div>

      {/* Corner Accents mirroring screenshot style */}
      <div 
        className="absolute top-0 right-0 w-32 h-32 border-r border-t border-white/5 pointer-events-none group-hover:border-amber-500/20 transition-colors"
        style={{ transform: "translateZ(40px)" }}
      />
    </motion.div>
  );
};


const VideoTestimonialCard: React.FC<{ testimonial: VideoTestimonial }> = ({ testimonial }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const duration = videoRef.current.duration || 1;
    setProgress((current / duration) * 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="bg-zinc-950/40 border border-white/5 hover:border-amber-500/20 rounded-2xl overflow-hidden group flex flex-col h-full transition-all duration-500 relative"
    >
      {/* Video Stream Container */}
      <div className="relative w-full aspect-[9/16] overflow-hidden bg-black select-none">
        <video
          ref={videoRef}
          src={testimonial.videoUrl}
          playsInline
          loop
          muted={isMuted}
          autoPlay
          onTimeUpdate={handleTimeUpdate}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 scale-102 group-hover:scale-105"
        />
        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        {/* Dynamic Video Title / Project watermark */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
          <span className="bg-black/60 backdrop-blur-md border border-white/10 px-2 py-0.5 rounded text-[8px] font-mono uppercase tracking-widest text-amber-500 font-bold">
            {testimonial.project}
          </span>
        </div>

        {/* Audio / Video Controls Overlay */}
        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5">
          {/* Mute/Unmute */}
          <button
            onClick={toggleMute}
            className="w-7 h-7 sm:w-8 h-8 rounded-full bg-black/60 hover:bg-amber-500 backdrop-blur-md border border-white/15 flex items-center justify-center text-white transition-colors duration-300 pointer-events-auto"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <Volume2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
          </button>

          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className="w-7 h-7 sm:w-8 h-8 rounded-full bg-black/60 hover:bg-amber-500 backdrop-blur-md border border-white/15 flex items-center justify-center text-white transition-colors duration-300 pointer-events-auto"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
          </button>
        </div>

        {/* Custom Visual Timeline Progress indicator */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
          <div 
            className="h-full bg-amber-500 transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Quote & Author Info */}
      <div className="p-4 xs:p-5 sm:p-6 flex flex-col justify-between flex-grow space-y-4">
        {/* Quote */}
        <div className="relative">
          <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500/10 absolute -top-2.5 -left-2 sm:-top-3 sm:-left-3 pointer-events-none" />
          <p className="text-zinc-300 text-[11px] xs:text-xs sm:text-xs md:text-sm lg:text-sm font-sans italic leading-relaxed relative z-10 pl-1.5 sm:pl-2">
            "{testimonial.quote}"
          </p>
        </div>

        {/* Client Identity details */}
        <div className="flex items-center gap-3 pt-2 border-t border-white/5">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 shrink-0 bg-zinc-900">
            {testimonial.avatar ? (
              <img 
                src={testimonial.avatar} 
                alt={testimonial.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-amber-500/10 text-amber-500 font-mono text-[10px] font-bold">
                {testimonial.name[0]}
              </div>
            )}
          </div>
          <div className="overflow-hidden">
            <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-white truncate">
              {testimonial.name}
            </h4>
            <p className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider truncate">
              {testimonial.role}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function HomeSection({ onNavigate, onExploreProject }: HomeSectionProps) {
  const { clients: firebaseClients } = useFirebaseData();
  const displayClients = useMemo(() => {
    return firebaseClients && firebaseClients.length > 0 ? firebaseClients : CLIENTS;
  }, [firebaseClients]);

  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [heroProjectIdx, setHeroProjectIdx] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [videoTestimonials, setVideoTestimonials] = useState<any[]>([]);

  useEffect(() => {
    // Shared loading logic
    const loadStatic = async () => {
      try {
        const [t, vt] = await Promise.all([
          fetchLocalTestimonials(),
          fetchLocalVideoTestimonials()
        ]);
        setTestimonials(t);
        setVideoTestimonials(vt);
      } catch (err) {
        console.error("Static data fetch failed:", err);
      }
    };

    loadStatic();

    // Portfolio real-time subscription
    const unsubscribe = subscribeToProjects((projects) => {
      setProjectsList(projects);
      // Prefetch spotlight images
      projects.filter(p => p.isHighlight).forEach(p => prefetchImage(p.fullImage));
    });

    return () => {
      unsubscribe();
    };
  }, []);


  // Pre-load hero images
  useEffect(() => {
    HERO_IMAGES.forEach(src => prefetchImage(src));
  }, []);

  const featuredProjects = useMemo(() => {
    return projectsList.filter(p => p.location && p.location !== "Unknown" && p.fullImage);
  }, [projectsList]);

  // Cycles hero project index
  useEffect(() => {
    if (featuredProjects.length === 0) return;
    const timer = setInterval(() => {
      setHeroProjectIdx((prev) => (prev + 1) % featuredProjects.length);
    }, 5000); // cycles every 5 seconds for sleek professional feel
    return () => clearInterval(timer);
  }, [featuredProjects.length]);

  // Cycles hero background slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000); // cycles every 6 seconds for a calm transition
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isHovered || testimonials.length === 0) return;
    const interval = setInterval(() => {
      setDirection(1);
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeTestimonial, isHovered, testimonials.length]);

  // Dynamic calculations utilizing all available data in database
  const stats = useMemo(() => {
    // 1. Total Designed footprint
    let totalSqFt = 0;
    projectsList.forEach((p) => {
      if (p.area) {
        const parsed = parseInt(p.area.replace(/,/g, "").replace(/[^0-9]/g, ""));
        if (!isNaN(parsed)) {
          totalSqFt += parsed;
        }
      }
    });

    // 2. Materials analysis - most frequently sourced green resources
    const materialCounts: Record<string, number> = {};
    projectsList.forEach(p => {
      if (p.materials) {
        p.materials.forEach(m => {
          const capitalized = m.trim();
          materialCounts[capitalized] = (materialCounts[capitalized] || 0) + 1;
        });
      }
    });
    
    const topMaterialsList = Object.entries(materialCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({ name, count }));

    // 3. Project distributions
    const totalProjects = projectsList.length;
    const inProgressCount = projectsList.filter(p => p.status === "Inprogress").length;

    return {
      totalSqFt: totalSqFt.toLocaleString() + " SQ FT",
      topMaterialsList,
      totalProjects,
      inProgressCount,
      completedCount: totalProjects - inProgressCount
    };
  }, [projectsList]);

  // Curated spotlight features (representing different categories)
  const spotlightProjects = useMemo(() => {
    // Get all user selected highlights
    const highlights = projectsList.filter(p => p.isHighlight);
    if (highlights.length === 3) {
      return highlights;
    }
    
    // Fallback: If not exactly 3 highlights, let's take up to 3 highlights,
    // and backfill with normal projects to ensure we always display exactly 3 projects.
    const items = [...highlights];
    for (const p of projectsList) {
      if (items.length >= 3) break;
      if (!items.some(existing => existing.id === p.id)) {
        items.push(p);
      }
    }
    return items.slice(0, 3);
  }, [projectsList]);

  // Stats for the new showcase section
  const STUDIO_STATS = [
    { label: "PREMIUM PROJECTS", value: "100+" },
    { label: "STATES EXECUTED", value: "12" },
    { label: "STUDIO PRACTICE", value: "14 yrs" },
    { label: "CONCEPT TO COMPLETION", value: "A→Z" }
  ];

  return (
    <div className="w-full transition-colors duration-500 bg-[#0B0B0A]" id="home-section-root">
      
      {/* 1. Hero Welcome - Redesigned to match screenshot */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden px-8 lg:px-12">
        {/* Cinematic Backdrop Image Slideshow */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <LazyImage
                src={HERO_IMAGES[currentSlide]}
                alt={`Hero Architectural Backdrop ${currentSlide + 1}`}
                className="w-full h-full"
                imgClassName="w-full h-full object-cover"
                priority={true}
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-black/20 sm:bg-black/30" />
        </div>

        {/* Content Overlay */}
        <div className="max-w-[1400px] mx-auto w-full z-10 flex flex-col items-center text-center space-y-12">
          {/* Sub-categories */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-2 text-amber-500 font-mono text-[9px] md:text-[11px] uppercase tracking-[0.4em] font-bold"
          >
            ARCHITECTURE <span className="text-zinc-600">·</span> INTERIORS <span className="text-zinc-600">·</span> MASTER PLANNING
          </motion.div>
          
          <div className="space-y-4 md:space-y-6">
            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-[8rem] xl:text-[10rem] 2xl:text-[12rem] font-medium font-sans text-white leading-none uppercase tracking-[0.08em] xs:tracking-[0.12em] md:tracking-[0.12em] lg:tracking-[0.15em]"
            >
              Earthfirm
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="font-mono text-zinc-400 text-[9px] xs:text-[11px] sm:text-xs md:text-sm lg:text-xl xl:text-2xl uppercase tracking-[0.2em] xs:tracking-[0.4em] sm:tracking-[0.8em] md:tracking-[1.2em] lg:tracking-[1.5em] xl:tracking-[2em] -mt-1 xs:-mt-2 sm:-mt-3 md:-mt-4 lg:-mt-6 xl:-mt-8"
            >
              Architects
            </motion.div>
          </div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-zinc-300 font-sans italic text-sm md:text-xl max-w-3xl leading-relaxed"
          >
            "Hum sirf structures nahi banate... hum zindagi ke spaces design karte hain."
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 pt-12"
          >
            <button
              onClick={() => onNavigate("portfolio")}
              className="cursor-pointer border border-amber-500/50 bg-amber-500/5 hover:bg-amber-500 text-white font-sans text-[10px] uppercase tracking-[0.3em] font-bold px-12 py-5 transition-all duration-500"
            >
              Explore Projects
            </button>
            <button
              onClick={() => onNavigate("contact")}
              className="cursor-pointer border border-zinc-500/50 hover:bg-white hover:text-black hover:border-white text-white font-sans text-[10px] uppercase tracking-[0.3em] font-bold px-12 py-5 transition-all duration-500"
            >
              Book Consultation
            </button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-10 animate-bounce">
          <span className="font-mono text-[8px] text-zinc-500 uppercase tracking-[0.6em] font-bold">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-amber-500/50 to-transparent" />
        </div>
      </section>

      {/* 2. Studio Stats & Philosophy Quote (Replacing Metrics Board) */}
      <section className="py-40 px-8 lg:px-12 border-b transition-colors duration-500 bg-black border-white/5" id="studio-philosophy-section">
        <div className="max-w-[1400px] mx-auto space-y-48">
          
          {/* 1. Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center" id="studio-stats-bar">
            {STUDIO_STATS.map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.8 }}
                className="space-y-6"
              >
                <div className="text-3xl xs:text-4xl sm:text-5xl md:text-7xl font-light text-amber-500 font-sans tracking-tight">
                  {stat.value}
                </div>
                <div className="text-[10px] md:text-[12px] font-mono uppercase tracking-[0.4em] font-bold text-zinc-500">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* 2. Central Philosophy Quote */}
          <motion.div 
            className="text-center space-y-12 max-w-5xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
          >
            <div className="flex flex-col items-center gap-8">
              <span className="font-mono text-[11px] text-amber-500 uppercase tracking-[0.6em] font-bold">
                Why Earthfirm
              </span>
              <div className="w-px h-16 bg-gradient-to-b from-amber-500/50 to-transparent" />
            </div>
            
            <h3 className="text-xl xs:text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-sans leading-[1.3] tracking-tight text-white">
              Design is not what you see. <br />
              <span className="text-zinc-500">It is what you feel when you enter a space.</span>
            </h3>
            
            <div className="w-40 h-px mx-auto mt-20 bg-zinc-800" />
          </motion.div>
        </div>
      </section>
      {/* 3. Featured Spotlight Showcase - Vertical Cinematic Blocks */}
      <section className="bg-black" id="curated-spotlights">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-12 py-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 border px-4 py-2 select-none bg-zinc-950 border-white/10">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-[0.4em] font-bold">Showcase</span>
              </div>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-sans uppercase tracking-[0.08em] xs:tracking-[0.12em] lg:tracking-[0.15em] leading-none text-white">
                Curated <span className="text-amber-500 italic font-serif lowercase">spotlights</span>
              </h2>
            </div>
            
            <button
              onClick={() => onNavigate("portfolio")}
              className="group cursor-pointer font-sans text-[10px] uppercase tracking-[0.3em] flex items-center gap-4 transition-all font-bold text-zinc-400 hover:text-white"
            >
              Examine entire portfolio <ArrowRight className="w-4 h-4 text-amber-500 transition-transform group-hover:translate-x-2" />
            </button>
          </div>


          <div className="space-y-12">
            {spotlightProjects.map((proj, idx) => (
              <SpotlightCard 
                key={proj.id} 
                proj={proj} 
                idx={idx} 
                onExplore={onExploreProject} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Cinematic Client Video Testimonials */}
      <section className="bg-black py-16 xs:py-24 px-4 xs:px-6 md:px-12 border-b border-white/5 relative overflow-hidden" id="video-testimonials-section">
        <div className="max-w-[1400px] mx-auto space-y-10 md:space-y-16">
          <div className="text-center md:text-left space-y-3 md:space-y-4">
            <div className="inline-flex items-center gap-1.5 md:gap-2 border px-3 py-1.5 md:px-4 md:py-2 select-none bg-zinc-950 border-white/10">
              <Sparkles className="w-3 h-3 md:w-3.5 md:h-3.5 text-amber-500" />
              <span className="font-mono text-[9px] md:text-[10px] text-zinc-400 uppercase tracking-[0.3em] md:tracking-[0.4em] font-bold">Client Retrospectives</span>
            </div>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-sans uppercase tracking-[0.08em] xs:tracking-[0.15em] leading-tight text-white">
              Sovereign <span className="text-amber-500 italic font-serif lowercase">reviews</span>
            </h2>
            <p className="text-zinc-500 text-xs sm:text-sm max-w-xl font-sans leading-relaxed">
              Listen directly to our elite commissions and developers recount their design-to-delivery experience with Earthfirm Architects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {videoTestimonials.map((testimonial) => (
              <VideoTestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* 4.5 Client trust logo band */}
      <section className="py-12 border-t border-b overflow-hidden border-white/5 bg-white/5" id="home-clients-marquee">
        <div className="max-w-full mx-auto">
          <div className="flex flex-col gap-8">
            <div className="text-center">
              <span className="font-mono text-[7.5px] uppercase tracking-[0.22em] text-zinc-500 block font-bold">Commissioned Trusts</span>
              <span className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#E5E3DF]">Pioneering Investors</span>
            </div>
            
            <div className="relative w-full overflow-hidden">
              <motion.div 
                className="flex items-center gap-16 md:gap-32 w-max"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
              >
                {[...displayClients, ...displayClients].map((client, idx) => (
                  <div 
                    key={`home-marquee-${client.id}-${idx}`}
                    onClick={() => onNavigate("how-we-do-it")}
                    className="h-16 w-32 flex items-center justify-center transition-all cursor-pointer shrink-0"
                  >
                    {client.logoUrl ? (
                      <LazyImage 
                        src={client.logoUrl} 
                        alt={client.name} 
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <span className="font-mono text-sm font-bold tracking-wider text-zinc-100">{client.fallbackAcronym}</span>
                    )}
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Client testimonials custom carousel slider */}
      <section className="py-24 px-8 lg:px-12 transition-colors duration-500 bg-[#0B0B0A]" id="client-testimonials-section">
        <div className="max-w-[1240px] mx-auto">
          
          <div className="text-center space-y-2 mb-16">
            <span className="font-mono text-[10px] text-[var(--color-terra-cotta)] uppercase tracking-[0.2em] font-bold block">Verified Endorsements</span>
            <h2 className="text-3xl md:text-5xl font-light font-display uppercase tracking-tight text-[#E5E3DF]">
              What Clients Express
            </h2>
          </div>

          <div 
            className="relative p-8 md:p-16 border overflow-hidden min-h-[300px] md:min-h-[250px] flex flex-col justify-center transition-colors duration-500 bg-[#141413] border-white/10"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="absolute top-6 left-6 z-10 opacity-30 text-zinc-800">
              <Quote className="w-12 h-12 stroke-[1.5] scale-y-[-1] flip-x rotate-180" />
            </div>
            
            <AnimatePresence initial={false} custom={direction} mode="wait">
              {testimonials.length > 0 && (
                <motion.div
                  key={activeTestimonial}
                  custom={direction}
                  variants={{
                    enter: (dir: number) => ({
                      x: dir > 0 ? 100 : -100,
                      opacity: 0
                    }),
                    center: {
                      x: 0,
                      opacity: 1
                    },
                    exit: (dir: number) => ({
                      x: dir < 0 ? 100 : -100,
                      opacity: 0
                    })
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 260, damping: 28 },
                    opacity: { duration: 0.25 }
                  }}
                  className="relative z-15 text-center max-w-3xl mx-auto space-y-8"
                >
                  <p className="font-sans italic text-base md:text-lg leading-relaxed text-zinc-300">
                    "{testimonials[activeTestimonial].quote}"
                  </p>
                  
                  <div className="space-y-1">
                    <div className="font-mono text-xs uppercase tracking-widest font-bold text-zinc-100">
                      {testimonials[activeTestimonial].name}
                    </div>
                    <div className="text-[10px] font-mono uppercase text-[#AA5B3F] font-bold tracking-widest">
                      {testimonials[activeTestimonial].role} • {testimonials[activeTestimonial].project}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>


            {/* Indicator Controls */}
            <div className="flex justify-center gap-2.5 pt-8 relative z-20">
              {testimonials.map((t, idx) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setDirection(idx > activeTestimonial ? 1 : -1);
                    setActiveTestimonial(idx);
                  }}
                  className={`w-3.5 h-1.5 transition-all duration-300 cursor-pointer ${
                    activeTestimonial === idx ? "bg-[var(--color-terra-cotta)] w-7" : "bg-zinc-700 hover:bg-zinc-500"
                  }`}
                />
              ))}
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
