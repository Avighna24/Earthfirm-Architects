import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Mail, Phone, MapPin, Send, 
  ChevronDown, CheckCircle2, MessageSquare, ExternalLink, ArrowRight
} from "lucide-react";
import { PROJECTS } from "../data";

export default function ContactSection({ 
  theme = "dark",
  onNavigate 
}: { 
  theme?: "light" | "dark",
  onNavigate?: (id: string) => void
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Residential Commission",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const faqItems = [
    {
      question: "What is your typical project timeline?",
      answer: "A bespoke residential commission typically spans 12-18 months from concept to handover, depending on scale and level of technical complexity.",
      category: "Commission"
    },
    {
      question: "Do you provide turnkey execution services?",
      answer: "Yes. Our studio offers end-to-end stewardship—from the first sketch to final site craftsmanship, ensuring the original architectural vision is never compromised.",
      category: "Services"
    },
    {
      question: "Which regions do you currently serve?",
      answer: "While based in Indore & New Delhi, we serve commissions throughout India, with active projects in Maharashtra, Goa, and Rajasthan.",
      category: "Geography"
    }
  ];

  const labelClass = `font-mono text-[10px] uppercase tracking-widest transition-colors ${
    theme === "dark" ? "text-zinc-500 group-focus-within:text-amber-500" : "text-zinc-400 group-focus-within:text-amber-600"
  }`;

  const inputClass = `w-full bg-transparent border-b py-3 outline-none transition-all font-sans text-sm ${
    theme === "dark" ? "border-white/10 focus:border-amber-500 text-white" : "border-zinc-200 focus:border-amber-600 text-zinc-900"
  }`;

  return (
    <section 
      className={`py-24 md:py-32 overflow-hidden transition-colors duration-500 relative bg-cover bg-center ${
        theme === "dark" ? "bg-black text-[#E5E3DF]" : "bg-[#F5F4F0] text-zinc-900"
      }`} 
      style={theme === "dark" ? { backgroundImage: `url(${PROJECTS[0].fullImage})` } : {}}
      id="contact-section"
    >
      {theme === "dark" && <div className="absolute inset-0 bg-[#0B0B0A]/85 backdrop-blur-sm z-0" />}
      
      <div className="max-w-[1400px] mx-auto px-8 lg:px-12 relative z-10 w-full">
        
        {/* SECTION HEADER */}
        <div className="mb-20 space-y-4">
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="font-mono text-[9px] md:text-[10px] text-amber-500 font-bold uppercase tracking-[0.4em] block"
          >
            Contact
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className={`text-2xl md:text-3xl lg:text-4xl font-medium font-sans uppercase tracking-[0.05em] leading-[1.1] ${
              theme === "dark" ? "text-white" : "text-zinc-900"
            }`}
          >
            Let's build <br /> something <br />
            <span className={theme === "dark" ? "text-zinc-600" : "text-zinc-400"}>timeless together.</span>
          </motion.h2>
        </div>

        {/* MAIN LAYOUT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* LEFT COLUMN: CONTACT INFO */}
          <div className="space-y-16 order-2 lg:order-1">
            
            {/* 1. STUDIO */}
            <div className={`space-y-6 border-t pt-8 ${theme === "dark" ? "border-white/10" : "border-zinc-200"}`}>
              <h3 className="font-mono text-[9px] md:text-[10px] text-amber-500 font-bold uppercase tracking-[0.5em]">
                Studio
              </h3>
              <div className="space-y-2">
                <p className={`text-base md:text-lg font-light font-sans leading-relaxed ${
                  theme === "dark" ? "text-white" : "text-zinc-800"
                }`}>
                  203, Royal Diamond Building <br />
                  Yeshwant Niwas Road, Sanghi Colony <br />
                  South Tukoganj, Indore, MP 452001
                </p>
              </div>
            </div>

            {/* 2. DIRECT */}
            <div className={`space-y-6 border-t pt-8 ${theme === "dark" ? "border-white/10" : "border-zinc-200"}`}>
              <h3 className="font-mono text-[9px] md:text-[10px] text-amber-500 font-bold uppercase tracking-[0.5em]">
                Direct
              </h3>
              <div className="space-y-4">
                <a href="tel:07314946376" className={`flex items-center gap-4 text-base md:text-lg font-light font-sans hover:text-amber-500 transition-colors group ${
                  theme === "dark" ? "text-white" : "text-zinc-800"
                }`}>
                  <Phone className="w-4 h-4 text-zinc-600 group-hover:text-amber-500 transition-colors" />
                  0731-4946376
                </a>
                <a href="mailto:earthfirm20@gmail.com" className={`flex items-center gap-4 text-base md:text-lg font-light font-sans hover:text-amber-500 transition-colors group ${
                  theme === "dark" ? "text-white" : "text-zinc-800"
                }`}>
                  <Mail className="w-4 h-4 text-zinc-600 group-hover:text-amber-500 transition-colors" />
                  earthfirm20@gmail.com
                </a>
                <a href="https://wa.me/917314946376" target="_blank" rel="noreferrer" className={`flex items-center gap-4 text-base md:text-lg font-light font-sans hover:text-amber-500 transition-colors group ${
                  theme === "dark" ? "text-white" : "text-zinc-800"
                }`}>
                  <MessageSquare className="w-4 h-4 text-zinc-600 group-hover:text-amber-500 transition-colors" />
                  WhatsApp the studio
                </a>
              </div>
            </div>

            {/* 3. HOURS */}
            <div className={`space-y-6 border-t pt-8 ${theme === "dark" ? "border-white/10" : "border-zinc-200"}`}>
              <h3 className="font-mono text-[9px] md:text-[10px] text-amber-500 font-bold uppercase tracking-[0.5em]">
                Hours
              </h3>
              <p className={`text-base md:text-lg font-light font-sans ${
                theme === "dark" ? "text-zinc-400" : "text-zinc-500"
              }`}>
                Mon – Sat · 10:30 to 19:00 (IST)
              </p>
            </div>

          </div>

          {/* RIGHT COLUMN: MAP & DIRECT CONTACT OVERVIEW */}
          <div className="space-y-12 order-1 lg:order-2">
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2 }}
              className={`relative aspect-square md:aspect-video lg:aspect-square border overflow-hidden group ${
                theme === "dark" ? "bg-zinc-900 border-white/10" : "bg-white border-zinc-200"
              }`}
            >
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3680.147101783021!2d75.8753237110196!3d22.722731179294246!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fd3bc7605e55%3A0x6bba8d7ccef67d8d!2sRoyal%20Diamond%20Building!5e0!3m2!1sen!2sin!4v1718095116345!5m2!1sen!2sin" 
                className={`w-full h-full transition-all duration-700 opacity-70 group-hover:opacity-100 ${
                  theme === "dark" ? "grayscale invert contrast-125 group-hover:grayscale-0 group-hover:invert-0" : ""
                }`}
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className={`absolute inset-0 pointer-events-none border ${theme === "dark" ? "border-white/5" : "border-black/5"}`} />
            </motion.div>

            <div className="pt-4 space-y-8">
              <h4 className={`text-xl font-medium uppercase tracking-wider ${theme === "dark" ? "text-white" : "text-zinc-900"}`}>Discover Our Work</h4>
              <p className={`text-base font-light leading-relaxed font-sans ${theme === "dark" ? "text-zinc-400" : "text-zinc-500"}`}>
                Explore our portfolio of curated architectural commissions to see how we manifest vision into timeless physical structures.
              </p>
              <button 
                onClick={() => onNavigate?.("portfolio")}
                className={`inline-flex items-center gap-4 text-[10px] font-mono font-bold uppercase tracking-[0.4em] py-3 border-b transition-all cursor-pointer ${
                  theme === "dark" ? "border-amber-500 text-white hover:text-amber-500" : "border-amber-600 text-zinc-900 hover:text-amber-600"
                }`}
              >
                <span>View Portfolio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

