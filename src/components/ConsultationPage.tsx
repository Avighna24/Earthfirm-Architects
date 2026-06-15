import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Send, CheckCircle2, ChevronDown, Calendar, 
  Clock, MessageSquare, ShieldCheck, AlertTriangle
} from "lucide-react";
import { HERO_IMAGES } from "../data";

export default function ConsultationPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "Residential",
    budgetRange: "Select Range",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      let backendSuccess = false;
      try {
        const response = await fetch("/api/submit-consultation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            await response.json();
            backendSuccess = true;
          } else {
            console.warn("Backend response is not JSON. Falling back to local database.");
          }
        } else {
          console.warn(`Backend responded with status ${response.status}. Falling back to local database.`);
        }
      } catch (err) {
        console.warn("Express backend unreachable. Failing over to client-side database.", err);
      }

      if (!backendSuccess) {
        const { saveLocalConsultation } = await import("../utils/localStorageDb");
        await saveLocalConsultation(formData);
      }

      setSubmitted(true);
      // Reset form on success
      setFormData({
        name: "",
        email: "",
        phone: "",
        projectType: "Residential",
        budgetRange: "Select Range",
        message: ""
      });
    } catch (err: any) {
      console.error("Consultation booking API error:", err);
      setErrorMessage(err.message || "An unexpected error occurred booking your session.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqItems = [
    {
      question: "What should I prepare for our first meeting?",
      answer: "A basic site plan, any regulatory documents you have, and a visual brief or moodboard. Understanding your lifestyle goals is more important than having a finished layout.",
      category: "Preparation"
    },
    {
      question: "How long is the initial discovery call?",
      answer: "Our initial consultation typically lasts 45-60 minutes. We focus on project feasibility, architectural intent, and alignment on design philosophies.",
      category: "Process"
    },
    {
      question: "Do you charge for the first consultation?",
      answer: "The initial discovery call to discuss your vision and our process is complimentary. Detailed site feasibility reports or conceptual sketches are part of our pre-design services.",
      category: "Billing"
    }
  ];

  const inputClass = "w-full bg-transparent border-b border-white/10 py-4 outline-none transition-all font-sans text-sm focus:border-amber-500 text-white placeholder:text-zinc-700";
  const labelClass = "font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-500 group-focus-within:text-amber-500 transition-colors";

  return (
    <section 
      className="min-h-screen bg-black text-[#E5E3DF] pt-32 pb-24 relative bg-cover bg-center overflow-hidden" 
      style={{ backgroundImage: `url(${HERO_IMAGES[0]})` }}
      id="consultation-page"
    >
      <div className="absolute inset-0 bg-[#0B0B0A]/85 backdrop-blur-sm z-0" />
      
      <div className="max-w-[1400px] mx-auto px-8 lg:px-12 relative z-10 w-full">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          
          {/* LEFT: CONTENT & INFO */}
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-6">
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-mono text-[10px] text-amber-500 font-bold uppercase tracking-[0.4em] block"
              >
                Booking Portal
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-5xl font-medium font-sans uppercase tracking-[0.15em] leading-[1.1] text-white"
              >
                Initiate your <br />
                <span className="text-zinc-600">Architectural</span> <br />
                Journey.
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-zinc-400 font-sans text-lg font-light leading-relaxed max-w-md"
              >
                Every timeless structure begins with a conversation. Share your vision with our studio leads to explore how we can manifest your intent.
              </motion.p>
            </div>

            <div className="space-y-8 pt-8 border-t border-white/5">
              <div className="flex gap-6 items-start group">
                <div className="mt-1 p-3 bg-zinc-900 border border-white/5 rounded-full text-amber-500">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-sans text-white text-lg font-medium">Focused Dialogue</h4>
                  <p className="text-zinc-500 text-sm font-sans mt-1">One-on-one sessions directed by our lead architects to understand your core requirements.</p>
                </div>
              </div>
              
              <div className="flex gap-6 items-start group">
                <div className="mt-1 p-3 bg-zinc-900 border border-white/5 rounded-full text-amber-500">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-sans text-white text-lg font-medium">Design Stewardship</h4>
                  <p className="text-zinc-500 text-sm font-sans mt-1">Assurance of end-to-end involvement, from conceptualization to final site delivery.</p>
                </div>
              </div>

              <div className="flex gap-6 items-start group">
                <div className="mt-1 p-3 bg-zinc-900 border border-white/5 rounded-full text-amber-500">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-sans text-white text-lg font-medium">Direct WhatsApp</h4>
                  <a href="https://wa.me/917314946376" className="text-amber-500 text-sm font-mono mt-1 hover:underline tracking-wider">+91 0731-4946376</a>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: ENQUIRY FORM */}
          <div className="lg:col-span-7">
            <div className="relative">
              <div className="absolute -top-12 -left-12 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full" />
              
              <div className="relative bg-zinc-950/50 border border-white/5 p-8 md:p-12 backdrop-blur-sm">
                {!submitted ? (
                  <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
                      <div className="space-y-1 group">
                        <label className={labelClass}>Full Name</label>
                        <input 
                          type="text" 
                          required
                          className={inputClass}
                          placeholder="Architectural Aspirant"
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1 group">
                        <label className={labelClass}>Email Address</label>
                        <input 
                          type="email" 
                          required
                          className={inputClass}
                          placeholder="name@vision.com"
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1 group">
                        <label className={labelClass}>Project Type</label>
                        <select 
                          className={inputClass}
                          value={formData.projectType}
                          onChange={e => setFormData({...formData, projectType: e.target.value})}
                        >
                          <option className="bg-zinc-900">Residential</option>
                          <option className="bg-zinc-900">Commercial</option>
                          <option className="bg-zinc-900">Landscape</option>
                          <option className="bg-zinc-900">Interior Craft</option>
                          <option className="bg-zinc-900">Other</option>
                        </select>
                      </div>
                      <div className="space-y-1 group">
                        <label className={labelClass}>Budget Intent</label>
                        <select 
                          className={inputClass}
                          value={formData.budgetRange}
                          onChange={e => setFormData({...formData, budgetRange: e.target.value})}
                        >
                          <option disabled className="bg-zinc-900">Select Range</option>
                          <option className="bg-zinc-900">Standard</option>
                          <option className="bg-zinc-900">Bespoke</option>
                          <option className="bg-zinc-900">Luxury / Premium</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1 group">
                      <label className={labelClass}>Site Vision & Requirements</label>
                      <textarea 
                        required
                        rows={5}
                        className={inputClass + " resize-none"}
                        placeholder="Tell us about the location, scale, and your aesthetic desires..."
                        value={formData.message}
                        onChange={e => setFormData({...formData, message: e.target.value})}
                      />
                    </div>

                    {errorMessage && (
                      <div className="p-4 bg-red-950/40 border border-red-900/50 text-red-400 font-mono text-[11px] uppercase tracking-wider flex items-center gap-3">
                        <AlertTriangle className="w-4.5 h-4.5 flex-shrink-0 text-red-500" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <div className="pt-4">
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full group flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-[0.5em] py-5 px-8 bg-white text-black hover:bg-amber-500 transition-all duration-500 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <span>{isSubmitting ? "Booking Session..." : "Submit Project Enquiry"}</span>
                        {isSubmitting ? (
                          <div className="w-4 h-4 rounded-full border-2 border-[#1b4332] border-t-amber-500 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4 transition-transform group-hover:translate-x-2 group-hover:-translate-y-1" />
                        )}
                      </button>
                      <p className="mt-6 text-[10px] text-zinc-600 font-mono text-center tracking-widest uppercase">
                        Response Time: Estimated within 24-48 Business Hours
                      </p>
                    </div>
                  </form>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-20 text-center space-y-8"
                  >
                    <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto rounded-full">
                      <CheckCircle2 className="w-8 h-8 text-amber-500" />
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-2xl font-medium uppercase tracking-widest text-white">Application Received</h4>
                      <p className="text-zinc-500 font-sans max-w-xs mx-auto">Our design secretariat will reach out to schedule your discovery call shortly.</p>
                    </div>
                    <button 
                      onClick={() => setSubmitted(false)}
                      className="text-[10px] font-mono text-amber-500 uppercase tracking-widest hover:text-white transition-colors"
                    >
                      New Application
                    </button>
                  </motion.div>
                )}
              </div>
            </div>

            {/* RESOURCE FAQ */}
            <div className="mt-16 space-y-6">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-500 ml-4 pb-4 border-b border-white/5">
                Enquiry Resources
              </h3>
              <div className="divide-y divide-white/5">
                {faqItems.map((item, idx) => (
                  <div key={idx} className="py-6 group cursor-pointer" onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-sans tracking-wide text-zinc-300 group-hover:text-white transition-colors">
                        {item.question}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-zinc-600 transition-transform ${activeFaq === idx ? "rotate-180 text-amber-500" : ""}`} />
                    </div>
                    <AnimatePresence>
                      {activeFaq === idx && (
                        <motion.p 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="text-zinc-500 text-sm font-sans mt-4 italic overflow-hidden pr-12 leading-relaxed"
                        >
                          {item.answer}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
