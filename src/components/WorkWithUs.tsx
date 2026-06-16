import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Upload, Briefcase, Loader2, CheckCircle, AlertTriangle, HelpCircle } from "lucide-react";
import { PROJECTS } from "../data";
import emailjs from "@emailjs/browser";

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export default function WorkWithUs() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    appliedFor: "",
    appliedAs: "",
    description: "",
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [portfolioFile, setPortfolioFile] = useState<File | null>(null);
  const [resumeDragging, setResumeDragging] = useState(false);
  const [portfolioDragging, setPortfolioDragging] = useState(false);

  const resumeInputRef = React.useRef<HTMLInputElement>(null);
  const portfolioInputRef = React.useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error" | "mock-success">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleResumeDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setResumeDragging(true);
  };

  const handleResumeDragLeave = () => {
    setResumeDragging(false);
  };

  const handleResumeDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setResumeDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setResumeFile(e.dataTransfer.files[0]);
    }
  };

  const handlePortfolioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPortfolioFile(e.target.files[0]);
    }
  };

  const handlePortfolioDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setPortfolioDragging(true);
  };

  const handlePortfolioDragLeave = () => {
    setPortfolioDragging(false);
  };

  const handlePortfolioDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setPortfolioDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setPortfolioFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_hiui3ei";
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_7nzq7ap";
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "0P07FOMXX6eMjFEaD";

    console.log("Form data submitted:", formData);

    // Contact Number regex validation: must start with '+' and have a country code followed by number (min 7 digits total)
    const normalizedPhone = formData.contactNumber.trim().replace(/\s+/g, "");
    const phoneRegex = /^\+[1-9]\d{6,14}$/;
    
    if (!normalizedPhone.startsWith("+")) {
      setErrorMessage("Contact number is required to include a country code starting with '+' (e.g., +919876543210 or +15550240900).");
      setSubmitStatus("error");
      setIsSubmitting(false);
      return;
    }

    if (!phoneRegex.test(normalizedPhone)) {
      setErrorMessage("Please enter a valid global contact number format including country code (e.g., +15550000000).");
      setSubmitStatus("error");
      setIsSubmitting(false);
      return;
    }

    // Check mandatory resume and portfolio uploads
    if (!resumeFile) {
      setErrorMessage("Please upload your Resume (mandatory) before submitting.");
      setSubmitStatus("error");
      setIsSubmitting(false);
      return;
    }

    if (!portfolioFile) {
      setErrorMessage("Please upload your Portfolio (mandatory) before submitting.");
      setSubmitStatus("error");
      setIsSubmitting(false);
      return;
    }

    try {
      // 1. Convert files to Base64
      const [resumeBase64, portfolioBase64] = await Promise.all([
        fileToBase64(resumeFile),
        fileToBase64(portfolioFile)
      ]);

      // 2. Submit to our robust Express backend API
      let backendSuccess = false;
      try {
        const backendResponse = await fetch("/api/submit-application", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            fullName: formData.fullName,
            email: formData.email,
            contactNumber: formData.contactNumber,
            appliedFor: formData.appliedFor,
            appliedAs: formData.appliedAs,
            description: formData.description,
            resumeFile: {
              name: resumeFile.name,
              data: resumeBase64
            },
            portfolioFile: {
              name: portfolioFile.name,
              data: portfolioBase64
            }
          })
        });

        if (backendResponse.ok) {
          const contentType = backendResponse.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            await backendResponse.json();
            backendSuccess = true;
          } else {
            console.warn("Backend response is not JSON. Falling back to local database.");
          }
        } else {
          console.warn(`Backend responded with status ${backendResponse.status}. Falling back to local database.`);
        }
      } catch (err) {
        console.warn("Express backend unreachable. Failing over to client-side database.", err);
      }

      if (!backendSuccess) {
        const { saveLocalApplication } = await import("../utils/firestoreDb");
        await saveLocalApplication({
          fullName: formData.fullName,
          email: formData.email,
          contactNumber: formData.contactNumber,
          appliedFor: formData.appliedFor,
          appliedAs: formData.appliedAs,
          description: formData.description,
          resumeFile: {
            name: resumeFile.name,
            data: resumeBase64
          },
          portfolioFile: {
            name: portfolioFile.name,
            data: portfolioBase64
          }
        });
      }

      // 3. Simultaneously fire off EmailJS template email for receipt/automated reply
      if (serviceId && templateId && publicKey) {
        try {
          const templateParams = {
            candidate_name: formData.fullName,
            job_title: formData.appliedFor,
            to_email: formData.email,
            
            fullName: formData.fullName,
            name: formData.fullName,
            from_name: formData.fullName,
            applicantName: formData.fullName,
            applicant_name: formData.fullName,
            
            email: formData.email,
            from_email: formData.email,
            user_email: formData.email,
            applicant_email: formData.email,
            recipient_email: formData.email,
            reply_to: formData.email,
            
            contactNumber: formData.contactNumber,
            phone: formData.contactNumber,
            phoneNumber: formData.contactNumber,
            
            appliedFor: formData.appliedFor,
            appliedAs: formData.appliedAs,
            role: formData.appliedFor,
            engagement: formData.appliedAs,
            
            description: formData.description,
            bio: formData.description,
            message: formData.description,
            
            resumeName: resumeFile.name,
            portfolioName: portfolioFile.name,
            to_name: "Earthfirm Architects Admin",
          };

          await emailjs.send(serviceId, templateId, templateParams, publicKey);
        } catch (emailErr: any) {
          console.warn("Automated receipt process completed but receipt email warning occurred:", emailErr);
        }
      }

      setIsSubmitting(false);
      setSubmitStatus("success");
      // Reset form inputs
      setFormData({
        fullName: "",
        email: "",
        contactNumber: "",
        appliedFor: "",
        appliedAs: "",
        description: "",
      });
      setResumeFile(null);
      setPortfolioFile(null);
    } catch (err: any) {
      console.error("Submission backend error: ", err);
      setIsSubmitting(false);
      setSubmitStatus("error");
      setErrorMessage(err?.message || "An unexpected error occurred during dossier upload.");
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className="py-32 relative bg-black min-h-screen flex items-center bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: `url(${PROJECTS[1].fullImage})` }}
      id="build-with-us-section"
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#0B0B0A]/85 backdrop-blur-sm z-0" />

      <div className="max-w-[1400px] mx-auto px-8 lg:px-12 relative z-10 w-full animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          
          {/* Left Column: Branding & Info */}
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-zinc-950 border border-white/10 px-4 py-2 select-none">
                <Briefcase className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-[0.4em] font-bold">Careers</span>
              </div>
              <h2 className="text-3xl xs:text-4xl sm:text-4xl md:text-5xl lg:text-7xl font-sans text-white uppercase tracking-[0.08em] xs:tracking-[0.12em] lg:tracking-[0.15em] leading-none">
                Build <br /> <span className="text-amber-500 italic font-serif lowercase">with us</span>
              </h2>
            </div>
            
            <div className="space-y-8 text-zinc-500 text-lg md:text-xl font-sans leading-relaxed max-w-md">
              <p>
                We are always seeking exceptional minds who believe architecture is an ecological responsibility. Feel free to submit your custom application, and our automated messaging pipeline will immediately process it.
              </p>
              <div className="space-y-3 pt-6 border-t border-white/5">
                <p className="text-[10px] uppercase font-mono tracking-widest text-[#E5E3DF]/50 font-bold mb-2">
                  OUR AVAILABLE ROLES & PORTFOLIOS
                </p>
                <div className="grid grid-cols-1 gap-y-3">
                  {[
                    "Senior Architect",
                    "Junior Architect",
                    "Interior Designer Fresher",
                    "Junior Interior designer",
                    "Site Supervisor",
                    "Draughtsman",
                    "Architecture Internship"
                  ].map((roleName, rIdx) => (
                    <div key={rIdx} className="flex items-center gap-3">
                      <div className="w-1 h-1 bg-amber-500 shrink-0" />
                      <span className="text-xs uppercase tracking-wider text-zinc-300 font-medium font-mono">
                        {roleName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Career Application Form */}
          <div className="lg:col-span-7">
            <div className="relative overflow-hidden bg-zinc-950/80 border border-white/10 p-8 md:p-12 shadow-2xl rounded-none">
              
              {/* Form Status Messages */}
              <AnimatePresence mode="wait">
                {submitStatus === "success" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="p-6 bg-emerald-950/30 border border-emerald-500/30 mb-8 flex items-start gap-4"
                  >
                    <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-sm uppercase tracking-wider font-bold font-mono text-emerald-400">Dossier Transmitted</h4>
                      <p className="text-xs text-zinc-400 leading-normal">
                        Your professional dossier was successfully processed. An automated receipt has been dispatched to your email address.
                      </p>
                      <button 
                        type="button" 
                        onClick={() => setSubmitStatus("idle")} 
                        className="text-[10px] uppercase tracking-widest font-mono font-bold text-white hover:text-emerald-400 mt-2 block underline"
                      >
                        Submit another application
                      </button>
                    </div>
                  </motion.div>
                )}

                {submitStatus === "mock-success" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="p-6 bg-amber-950/20 border border-amber-500/30 mb-8 flex items-start gap-4"
                  >
                    <HelpCircle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-sm uppercase tracking-wider font-bold font-mono text-amber-500">Virtual Simulation Success</h4>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        The form state validation succeeded! To finalize real EmailJS automated delivery, configure physical credentials in your local settings:
                      </p>
                      <div className="p-3 bg-black/60 rounded border border-white/5 font-mono text-[9px] text-zinc-500 leading-tight select-all">
                        VITE_EMAILJS_SERVICE_ID <br />
                        VITE_EMAILJS_TEMPLATE_ID <br />
                        VITE_EMAILJS_PUBLIC_KEY
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setSubmitStatus("idle")} 
                        className="text-[10px] uppercase tracking-widest font-mono font-bold text-[#E5E3DF] hover:text-amber-500 mt-2 block underline"
                      >
                        Re-enable Form Input
                      </button>
                    </div>
                  </motion.div>
                )}

                {submitStatus === "error" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="p-6 bg-red-950/30 border border-red-500/30 mb-8 flex items-start gap-4"
                  >
                    <AlertTriangle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-sm uppercase tracking-wider font-bold font-mono text-red-400">Transmission Disrupted</h4>
                      <p className="text-xs text-zinc-400 leading-normal">
                        {errorMessage}
                      </p>
                      <button 
                        type="button" 
                        onClick={() => setSubmitStatus("idle")} 
                        className="text-[10px] uppercase tracking-widest font-mono font-bold text-white hover:text-red-400 mt-2 block underline"
                      >
                        Try sending again
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#E5E3DF]/70 block font-bold">
                      Full Name <span className="text-amber-500 font-bold">*</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="Your Full Name" 
                      required 
                      disabled={isSubmitting || submitStatus === "success" || submitStatus === "mock-success"}
                      className="w-full bg-transparent text-white placeholder-zinc-600 border-b border-white/20 focus:border-amber-500 py-3 text-sm outline-none font-sans transition-all disabled:opacity-40"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#E5E3DF]/70 block font-bold">
                      Email <span className="text-amber-500 font-bold">*</span>
                    </label>
                    <input 
                      type="email" 
                      placeholder="your.email@domain.com" 
                      required 
                      disabled={isSubmitting || submitStatus === "success" || submitStatus === "mock-success"}
                      className="w-full bg-transparent text-white placeholder-zinc-650 border-b border-white/20 focus:border-amber-500 py-3 text-sm outline-none font-sans transition-all disabled:opacity-40"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#E5E3DF]/70 block font-bold">
                      Contact Number <span className="text-amber-500 font-bold">*</span>
                    </label>
                    <input 
                      type="tel" 
                      placeholder="+91 9876543210" 
                      required 
                      disabled={isSubmitting || submitStatus === "success" || submitStatus === "mock-success"}
                      className="w-full bg-transparent text-white placeholder-zinc-650 border-b border-white/20 focus:border-amber-500 py-3 text-sm outline-none font-sans transition-all disabled:opacity-40"
                      value={formData.contactNumber}
                      onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                    />
                    <p className="text-[9px] text-zinc-500 font-mono leading-tight">Must include country code starting with '+'</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#E5E3DF]/70 block font-bold">
                      Role <span className="text-amber-500 font-bold">*</span>
                    </label>
                    <select 
                      required
                      disabled={isSubmitting || submitStatus === "success" || submitStatus === "mock-success"}
                      className="w-full bg-[#141413] text-white border-b border-white/20 focus:border-amber-500 py-3 px-2 text-sm outline-none font-sans cursor-pointer transition-all rounded-none disabled:opacity-40"
                      value={formData.appliedFor}
                      onChange={(e) => setFormData({...formData, appliedFor: e.target.value})}
                    >
                      <option value="" className="bg-[#141413] text-zinc-500">Applied As</option>
                      <option value="Architecture Internship" className="bg-[#141413] text-white">Architecture Internship</option>
                      <option value="Junior Architect" className="bg-[#141413] text-white">Junior Architect</option>
                      <option value="Senior Architect" className="bg-[#141413] text-white">Senior Architect</option>
                      <option value="Interior Designer Fresher" className="bg-[#141413] text-white">Interior Designer Fresher</option>
                      <option value="Junior Interior designer" className="bg-[#141413] text-white">Junior Interior designer</option>
                      <option value="Site Supervisor" className="bg-[#141413] text-white">Site Supervisor</option>
                      <option value="Draughtsman" className="bg-[#141413] text-white">Draughtsman</option>
                      <option value="Other" className="bg-[#141413] text-white">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#E5E3DF]/70 block font-bold">
                      Engagement <span className="text-amber-500 font-bold">*</span>
                    </label>
                    <select 
                      required
                      disabled={isSubmitting || submitStatus === "success" || submitStatus === "mock-success"}
                      className="w-full bg-[#141413] text-white border-b border-white/20 focus:border-amber-500 py-3 px-2 text-sm outline-none font-sans cursor-pointer transition-all rounded-none disabled:opacity-40"
                      value={formData.appliedAs}
                      onChange={(e) => setFormData({...formData, appliedAs: e.target.value})}
                    >
                      <option value="" className="bg-[#141413] text-zinc-500">Type</option>
                      <option value="Full-time" className="bg-[#141413] text-white">Full-time</option>
                      <option value="Internship" className="bg-[#141413] text-white">Internship</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#E5E3DF]/70 block font-bold">Bio</label>
                  <textarea 
                    placeholder="Tell us about your architectural journey..."
                    disabled={isSubmitting || submitStatus === "success" || submitStatus === "mock-success"}
                    className="w-full p-6 h-32 bg-zinc-950/50 text-white placeholder-zinc-650 border border-white/10 focus:border-amber-500/50 text-sm outline-none font-sans resize-none transition-all rounded-none disabled:opacity-40"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                
                {/* Real drag-and-drop required file uploader widgets */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Resume upload widget */}
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#E5E3DF]/70 block font-bold">
                      Resume <span className="text-amber-500 font-bold">*</span>
                    </label>
                    <div
                      onDragOver={handleResumeDragOver}
                      onDragLeave={handleResumeDragLeave}
                      onDrop={handleResumeDrop}
                      onClick={() => resumeInputRef.current?.click()}
                      className={`w-full min-h-[140px] border flex flex-col items-center justify-center p-6 gap-2 transition-all cursor-pointer rounded-none bg-zinc-950/30 text-center relative overflow-hidden ${
                        resumeDragging 
                          ? "border-amber-500 bg-amber-500/10" 
                          : resumeFile 
                            ? "border-emerald-600 bg-emerald-950/10" 
                            : "border-white/10 hover:border-amber-500/30"
                      }`}
                    >
                      <input
                        type="file"
                        ref={resumeInputRef}
                        onChange={handleResumeChange}
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                      />
                      <Upload className={`w-6 h-6 ${resumeFile ? "text-emerald-400" : "text-amber-500"}`} />
                      {resumeFile ? (
                        <div className="space-y-1 w-full max-w-[200px]">
                          <p className="text-xs text-white font-mono font-bold truncate">
                            {resumeFile.name}
                          </p>
                          <p className="text-[10px] text-emerald-400 font-mono font-bold">
                            Uploaded ({(resumeFile.size / 1024).toFixed(1)} KB)
                          </p>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setResumeFile(null);
                              if (resumeInputRef.current) resumeInputRef.current.value = "";
                            }}
                            className="text-[9px] uppercase tracking-widest font-mono font-bold text-red-500 hover:text-red-400 mt-1 underline"
                          >
                            Remove File
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <p className="font-mono text-[10px] uppercase tracking-widest font-bold text-zinc-300">
                            Upload Resume
                          </p>
                          <p className="text-[9px] text-zinc-500 font-mono">
                            Drag & Drop or Click (PDF, DOCX)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Portfolio upload widget */}
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#E5E3DF]/70 block font-bold">
                      Portfolio <span className="text-amber-500 font-bold">*</span>
                    </label>
                    <div
                      onDragOver={handlePortfolioDragOver}
                      onDragLeave={handlePortfolioDragLeave}
                      onDrop={handlePortfolioDrop}
                      onClick={() => portfolioInputRef.current?.click()}
                      className={`w-full min-h-[140px] border flex flex-col items-center justify-center p-6 gap-2 transition-all cursor-pointer rounded-none bg-zinc-950/30 text-center relative overflow-hidden ${
                        portfolioDragging 
                          ? "border-amber-500 bg-amber-500/10" 
                          : portfolioFile 
                            ? "border-emerald-600 bg-emerald-950/10" 
                            : "border-white/10 hover:border-amber-500/30"
                      }`}
                    >
                      <input
                        type="file"
                        ref={portfolioInputRef}
                        onChange={handlePortfolioChange}
                        accept=".pdf,.zip,.rar,.png,.jpg,.jpeg"
                        className="hidden"
                      />
                      <Upload className={`w-6 h-6 ${portfolioFile ? "text-emerald-400" : "text-amber-500"}`} />
                      {portfolioFile ? (
                        <div className="space-y-1 w-full max-w-[200px]">
                          <p className="text-xs text-white font-mono font-bold truncate">
                            {portfolioFile.name}
                          </p>
                          <p className="text-[10px] text-emerald-400 font-mono font-bold">
                            Uploaded ({(portfolioFile.size / (1024 * 1024)).toFixed(2)} MB)
                          </p>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPortfolioFile(null);
                              if (portfolioInputRef.current) portfolioInputRef.current.value = "";
                            }}
                            className="text-[9px] uppercase tracking-widest font-mono font-bold text-red-500 hover:text-red-400 mt-1 underline"
                          >
                            Remove File
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <p className="font-mono text-[10px] uppercase tracking-widest font-bold text-zinc-300">
                            Upload Portfolio
                          </p>
                          <p className="text-[9px] text-zinc-500 font-mono">
                            Drag & Drop or Click (PDF, ZIP, Images)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting || submitStatus === "success"}
                  className="w-full flex items-center justify-center gap-4 bg-amber-500 hover:bg-white text-black py-6 uppercase font-mono tracking-[0.4em] text-[12px] transition-all duration-500 font-bold cursor-pointer rounded-none disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      Processing <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                    </>
                  ) : (
                    <>
                      Submit Dossier <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
