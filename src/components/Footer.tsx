import React, { useState } from "react";
import { motion } from "motion/react";
import { Instagram, Facebook, Linkedin, Youtube, Pin } from "lucide-react";
import Logo from "./Logo";

interface FooterProps {
  theme?: "light" | "dark";
  setActiveTab?: (tab: string) => void;
}

export default function Footer({ theme = "dark", setActiveTab }: FooterProps) {

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "studio", label: "How we do it" },
    { id: "running", label: "Build with Us" },
    { id: "portfolio", label: "Portfolio" },
    { id: "contact", label: "Contact US" },
  ];

  const socialLinks = [
    { label: "LinkedIn", url: "https://www.linkedin.com/company/earthfirmarchitects/", icon: Linkedin },
    { label: "Instagram", url: "https://www.instagram.com/earthfirmarchitects/", icon: Instagram },
    { label: "Facebook", url: "https://www.facebook.com/earthfirmarchitects/", icon: Facebook },
    { label: "Youtube", url: "https://www.youtube.com/channel/UC326MnPlHIK8ebz6IonJLOg", icon: Youtube },
    { label: "Pinterest", url: "https://in.pinterest.com/earthfirm/", icon: Pin },
  ];

  const textColor = theme === "dark" ? "text-[#E5E3DF]" : "text-zinc-900";
  const mutedTextColor = theme === "dark" ? "text-zinc-500" : "text-zinc-400";
  const bgColor = theme === "dark" ? "bg-black" : "bg-white";
  const borderColor = theme === "dark" ? "border-white/5" : "border-zinc-200";

  return (
    <motion.footer 
      className={`${bgColor} ${textColor} border-t ${borderColor} py-20 overflow-hidden`} 
      id="footer-section"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 lg:gap-12">
          
          {/* Brand & Introduction Column */}
          <div className="md:col-span-12 lg:col-span-4 space-y-8">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] text-amber-500 font-bold uppercase tracking-[0.4em]">
                  Earthfirm — Indore
                </span>
                <h2 className={`text-3xl lg:text-4xl font-light font-sans leading-[1.1] ${textColor}`}>
                  We design spaces that <br />
                  <span className="text-zinc-500 italic font-serif lowercase">remember</span> you.
                </h2>
              </div>
              <p className={`${mutedTextColor} text-sm leading-relaxed max-w-sm font-sans`}>
                A design studio shaping timeless, human-centered spaces through emotion, precision, and architectural clarity.
              </p>
              
              {/* Logo in Footer */}
              <Logo 
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab?.("home");
                }}
                className="flex-shrink-0" 
                theme={theme}
                isHeader={true}
              />
            </div>
          </div>

          {/* Studio Navigation Column */}
          <div className="md:col-span-4 lg:col-span-2 space-y-8">
            <h3 className="font-mono text-[11px] text-amber-500 font-bold uppercase tracking-[0.4em]">
              Studio
            </h3>
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => setActiveTab?.(link.id)}
                  className={`text-left text-sm font-light hover:text-amber-500 transition-colors duration-300 w-fit ${
                    theme === "dark" ? "text-white" : "text-zinc-800"
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Socials Column */}
          <div className="md:col-span-4 lg:col-span-2 space-y-8">
            <h3 className="font-mono text-[11px] text-amber-500 font-bold uppercase tracking-[0.4em]">
              Socials
            </h3>
            <nav className="flex flex-col gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 text-sm font-light hover:text-amber-500 transition-colors duration-300 w-fit ${
                    theme === "dark" ? "text-white" : "text-zinc-800"
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Visit / Contact Column */}
          <div className="md:col-span-4 lg:col-span-4 space-y-8">
            <h3 className="font-mono text-[11px] text-amber-500 font-bold uppercase tracking-[0.4em]">
              Visit
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <p className={`text-sm font-light leading-relaxed ${theme === "dark" ? "text-white" : "text-zinc-800"}`}>
                  203, Royal Diamond Building <br />
                  Yeshwant Niwas Road, Sanghi Colony <br />
                  South Tukoganj, Indore, MP 452001
                </p>
              </div>

              <div className="space-y-1">
                <p className={`text-sm font-light ${theme === "dark" ? "text-white" : "text-zinc-800"}`}>0731-4946376</p>
                <p className={`text-sm font-light ${theme === "dark" ? "text-white" : "text-zinc-800"}`}>earthfirm20@gmail.com</p>
              </div>

              {/* Smaller Map Variant */}
              <div className={`mt-8 w-full aspect-video border overflow-hidden rounded-sm grayscale group transition-all duration-700 hover:grayscale-0 ${
                theme === "dark" ? "border-white/10 invert brightness-50 contrast-125 hover:invert-0 hover:brightness-100" : "border-zinc-200"
              }`}>
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3680.147101783021!2d75.8753237110196!3d22.722731179294246!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fd3bc7605e55%3A0x6bba8d7ccef67d8d!2sRoyal%20Diamond%20Building!5e0!3m2!1sen!2sin!4v1718095116345!5m2!1sen!2sin" 
                  className="w-full h-full"
                  style={{ border: 0 }} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Legal copyrights section */}
        <div className={`flex flex-col sm:flex-row justify-between items-center gap-6 mt-20 pt-8 border-t text-[10px] font-mono tracking-[0.2em] uppercase ${
          theme === "dark" ? "border-white/5 text-zinc-600" : "border-zinc-200 text-zinc-400"
        }`} id="footer-bottom">
          <p>
            © 2026 Earthfirm Architects. All rights reserved.
            <span 
              onClick={() => setActiveTab?.("admin")} 
              className="ml-2 text-zinc-800 hover:text-amber-500 cursor-pointer transition-colors duration-300 font-mono text-[9px] select-none"
              title="Secure Administrative Console"
            >
              [■]
            </span>
          </p>
          <div className="flex gap-8">
            <span className="hover:text-amber-500 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-amber-500 cursor-pointer transition-colors">Environmental Codex</span>
          </div>
        </div>

      </div>
    </motion.footer>
  );
}
