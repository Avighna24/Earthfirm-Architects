import React, { useState } from "react";
import { Compass, Sparkles, BookOpen, Mail, Home, Menu, X, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Logo from "./Logo";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme?: "dark";
}

export default function Header({ activeTab, setActiveTab }: HeaderProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "studio", label: "How we do it" },
    { id: "portfolio", label: "Portfolio" },
    { id: "running", label: "Build with Us" },
    { id: "contact", label: "Contact US" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-[100] backdrop-blur-md border-b transition-all duration-500 bg-black/40 border-white/5">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-10 h-16 sm:h-18 md:h-20 flex items-center justify-between">
        {/* Logo and Brand Title */}
        <Logo 
          onClick={(e) => {
            e.preventDefault();
            setActiveTab("home");
          }}
          className="relative z-[110] flex-shrink-0 h-full flex items-center justify-center transition-all duration-300"
          theme="dark"
          isHeader={true}
          id="header-logo"
        />

        {/* Global Navigation */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-8" id="header-nav">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`py-2 text-xs lg:text-[11px] xl:text-[12px] uppercase tracking-[0.22em] transition-all duration-300 relative font-bold font-sans ${
                  isActive 
                    ? "text-amber-500" 
                    : "text-zinc-300 hover:text-white"
                }`}
                id={`nav-${item.id}`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-4 xl:gap-6 relative z-[110]">
          <div className="hidden lg:block">
            <button 
              onClick={() => setActiveTab("consultation")}
              className="border px-4 py-2.5 xl:px-6 text-[9px] uppercase tracking-[0.2em] font-bold transition-all duration-300 cursor-pointer border-zinc-800 text-white hover:bg-white hover:text-black"
            >
              Book an Advisory Session
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-white relative z-[110]"
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          >
            {isDrawerOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
            className="fixed inset-0 w-screen h-screen z-[100] p-8 pt-32 bg-black/80 backdrop-blur-2xl"
          >
            <nav className="flex flex-col gap-8" id="header-nav-mobile">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => {
                            setActiveTab(item.id);
                            setIsDrawerOpen(false);
                        }}
                        className={`text-2xl uppercase tracking-[0.2em] text-left font-light ${
                            activeTab === item.id 
                                ? "text-amber-500" 
                                : "text-[#E5E3DF]"
                        }`}
                    >
                        {item.label}
                    </button>
                ))}
                <div className="flex flex-col gap-4 mt-8 pt-8 border-t border-zinc-200/10">
                    <button
                        onClick={() => {
                            setActiveTab("consultation");
                            setIsDrawerOpen(false);
                        }}
                        className="border border-amber-600 px-6 py-4 text-xs uppercase tracking-[0.2em] font-bold text-amber-500 text-center"
                    >
                        Book an Advisory Session
                    </button>
                </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
