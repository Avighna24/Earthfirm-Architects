/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FirebaseDataProvider } from "./context/FirebaseDataContext";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ServicesExplorer from "./components/ServicesExplorer";
import ProjectPortfolio from "./components/ProjectPortfolio";
import Testimonials from "./components/Testimonials";
import ContactSection from "./components/ContactSection";
import ConsultationPage from "./components/ConsultationPage";
import WorkWithUs from "./components/WorkWithUs";
import AdminDashboard from "./components/AdminDashboard";
import Footer from "./components/Footer";
import CustomCursor from "./components/CustomCursor";
import HomeSection from "./components/HomeSection";
import { Mail } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("home");

  // Scroll to top on tab change
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  // Helper to open project detailed modal by simulating click inside ProjectPortfolio
  const handleSelectProjectById = (id: string) => {
    setActiveTab("portfolio");
    setTimeout(() => {
      const cardEl = document.getElementById(`project-card-${id}`);
      if (cardEl) {
        cardEl.click();
        cardEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 150);
  };

  const pageVariants: any = {
    initial: { opacity: 0, y: 15, filter: "blur(4px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, y: -15, filter: "blur(4px)", transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <FirebaseDataProvider>
      <div className="min-h-screen flex flex-col justify-between transition-colors duration-500 selection:bg-amber-500 selection:text-black font-sans antialiased bg-black text-[#E5E3DF]" id="app-root">
        <CustomCursor />
        
        {/* Floating Enquire Button */}
        {activeTab !== "admin" && (
          <button
            onClick={() => setActiveTab("consultation")}
            className="fixed bottom-8 right-8 z-50 px-8 py-5 rounded-none shadow-2xl border transition-all duration-500 hover:scale-105 flex items-center gap-3 bg-zinc-950 text-white border-white/5 hover:bg-white hover:text-black"
            aria-label="Start the Conversation"
          >
            <Mail className="w-5 h-5 text-amber-500" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] font-bold hidden md:inline">Start the Conversation</span>
          </button>
        )}

        {/* Header coordinates navigation and global brand state */}
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main core pages content routing */}
        <main className="flex-grow flex flex-col relative w-full">
          <AnimatePresence mode="wait" initial={false}>
            {/* TAB 0: Dynamic Home Dashboard */}
            {activeTab === "home" && (
              <motion.div
                key="home"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex-grow w-full"
              >
                <HomeSection onNavigate={setActiveTab} onExploreProject={handleSelectProjectById} />
              </motion.div>
            )}

            {/* TAB 1: Selected Works Portfolio (Home View) */}
            {activeTab === "portfolio" && (
              <motion.div
                key="portfolio"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex-grow w-full"
              >
                <ProjectPortfolio onNavigate={setActiveTab} />
                <Testimonials />
              </motion.div>
            )}

            {/* TAB 1b: Build with Us (Career Section) */}
            {activeTab === "running" && (
              <motion.div
                key="running"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex-grow w-full"
              >
                <WorkWithUs />
              </motion.div>
            )}

            {/* TAB 2: Core services & biophilic philosophies (Studio) */}
            {(activeTab === "services" || activeTab === "studio") && (
              <motion.div
                key="services"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex-grow w-full"
              >
                <ServicesExplorer />
              </motion.div>
            )}

            {/* TAB 4: Live Architect Discovery Calendar Call booking portal */}
            {activeTab === "consultation" && (
              <motion.div
                key="consultation"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex-grow w-full"
              >
                <ConsultationPage />
              </motion.div>
            )}

            {/* TAB 5: Contact & Location */}
            {activeTab === "contact" && (
              <motion.div
                key="contact"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex-grow w-full"
              >
                <ContactSection onNavigate={setActiveTab} />
              </motion.div>
            )}

            {/* TAB 6: Secretariat Submissions Dashboard Portal */}
            {activeTab === "admin" && (
              <motion.div
                key="admin"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex-grow w-full"
              >
                <AdminDashboard />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Persistent global footer with registrations, coordinates & commitments */}
        <Footer setActiveTab={setActiveTab} />

      </div>
    </FirebaseDataProvider>
  );
}

