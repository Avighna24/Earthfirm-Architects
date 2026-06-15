import React, { useState, useEffect } from "react";
import { TESTIMONIALS } from "../data";
import { Award, Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import LazyImage from "./LazyImage";
import { motion, AnimatePresence } from "motion/react";

const SLIDE_VARIANTS = {
  enter: (direction: number) => ({
    x: direction > 0 ? 120 : -120,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 120 : -120,
    opacity: 0,
  }),
};

export default function Testimonials() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [activeIdx, isHovered]);

  const handleNext = () => {
    setDirection(1);
    setActiveIdx((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveIdx((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const handleDotClick = (idx: number) => {
    setDirection(idx > activeIdx ? 1 : -1);
    setActiveIdx(idx);
  };

  const current = TESTIMONIALS[activeIdx];

  return (
    <section className="py-32 bg-black border-t border-white/5 select-none" id="testimonials-section">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Title block */}
        <div className="text-center mb-24" id="testimonials-title">
          <div className="inline-flex items-center gap-2 bg-zinc-950 border border-white/10 px-4 py-2 mb-6 shadow-2xl">
            <Quote className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-[0.4em] font-bold">Feedback</span>
          </div>
          <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-white uppercase tracking-tight font-sans leading-[1.1]">
            What Clients <br /> <span className="text-amber-500 italic font-serif lowercase">say about us</span>
          </h2>
        </div>

        {/* Slideshow Container */}
        <div 
          className="relative max-w-5xl mx-auto px-4 md:px-20"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          id="testimonials-slideshow"
        >
          {/* Main Card Frame */}
          <div className="relative overflow-hidden bg-zinc-950/30 border border-white/5 p-10 md:p-20 min-h-[400px] flex flex-col justify-center text-center shadow-2xl">
            
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={activeIdx}
                custom={direction}
                variants={SLIDE_VARIANTS}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.3 },
                }}
                className="w-full space-y-12"
              >
                {/* Quote text block */}
                <blockquote className="text-zinc-300 font-sans text-xl md:text-3xl leading-relaxed italic max-w-4xl mx-auto">
                  "{current.quote}"
                </blockquote>

                {/* Author profile */}
                <div className="flex flex-col items-center gap-6">
                  <div className="w-16 h-16 rounded-none overflow-hidden bg-zinc-900 border border-amber-500/20 rotate-45">
                    <LazyImage
                      src={current.avatar}
                      alt={current.name}
                      className="w-full h-full -rotate-45 scale-125"
                      imgClassName="grayscale object-cover w-full h-full"
                    />
                  </div>
                  <div className="text-center">
                    <h4 className="font-sans font-bold text-sm text-white uppercase tracking-[0.2em]">
                      {current.name}
                    </h4>
                    <p className="text-[10px] text-zinc-500 font-mono mt-2 uppercase tracking-[0.3em]">
                      {current.role} <span className="mx-2 text-zinc-800">|</span> <span className="text-amber-600">{current.project}</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 z-20">
            <button
              onClick={handlePrev}
              className="w-12 h-12 bg-black hover:bg-zinc-900 text-white border border-white/5 flex items-center justify-center transition-all duration-300 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 right-0 z-20">
            <button
              onClick={handleNext}
              className="w-12 h-12 bg-black hover:bg-zinc-900 text-white border border-white/5 flex items-center justify-center transition-all duration-300 cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Indicator dots */}
        <div className="flex justify-center gap-4 mt-12" id="testimonials-indicators">
          {TESTIMONIALS.map((t, idx) => (
            <button
              key={t.id}
              onClick={() => handleDotClick(idx)}
              className={`w-10 h-[1px] transition-all duration-500 cursor-pointer ${
                activeIdx === idx 
                  ? "bg-amber-500" 
                  : "bg-zinc-800 hover:bg-zinc-600"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

