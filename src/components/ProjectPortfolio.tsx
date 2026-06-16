import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, useSpring, AnimatePresence } from "motion/react";
import { useFirebaseData } from "../context/FirebaseDataContext";
import { Project } from "../types";
import { BookOpen, MapPin, Layers, Award, ShieldCheck, X, Zap, Droplets, Leaf, View, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import LazyImage from "./LazyImage";
import { deleteLocalProject, updateLocalProject } from "../utils/firestoreDb";

// Preload helper to fetch images aggressively in background
const prefetchImage = (url: string) => {
  const img = new Image();
  img.src = url;
};

const downsampleImage = (src: string, maxDim: number = 240): Promise<string> => {
  return new Promise((resolve) => {
    if (!src || !src.startsWith("data:") || src.length < 30000) {
      resolve(src);
      return;
    }
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      let w = img.width;
      let h = img.height;
      if (w > h) {
        if (w > maxDim) {
          h *= maxDim / w;
          w = maxDim;
        }
      } else {
        if (h > maxDim) {
          w *= maxDim / h;
          h = maxDim;
        }
      }
      canvas.width = w;
      canvas.height = h;
      if (ctx) {
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.65));
      } else {
        resolve(src);
      }
    };
    img.onerror = () => {
      resolve(src);
    };
  });
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const ProjectSkeletonCard = () => {
  return (
    <div className="border-b border-white/10 pb-8 flex flex-col lg:flex-row gap-12 bg-transparent select-none">
      {/* Left Side: Large Visual Shimmer with Blueprint Elements */}
      <div className="lg:w-7/12 aspect-[16/9] relative bg-zinc-900/40 border border-white/5 overflow-hidden flex items-center justify-center">
        {/* Shimmer sweep overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full animate-shimmer" />
        
        {/* Decorative blueprint Grid pattern to emulate high-end architectural layout */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:16px_16px]" />
        
        {/* Drafting crosshairs/markers */}
        <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-zinc-800" />
        <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-zinc-800" />
        <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-zinc-800" />
        <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-zinc-800" />
        
        {/* Central emblem */}
        <div className="w-12 h-12 rounded-full border border-zinc-800/60 flex items-center justify-center bg-zinc-950/20">
          <Layers className="w-5 h-5 text-zinc-700/40 animate-pulse" />
        </div>

        {/* Dynamic floating architectural dimensions simulation */}
        <div className="absolute bottom-3 left-4 text-[8px] font-mono text-zinc-700 tracking-widest uppercase">
          SCALE --/--
        </div>
        <div className="absolute bottom-3 right-4 text-[8px] font-mono text-zinc-700 tracking-widest uppercase">
          E-PORTFOLIO SEC_ST-7
        </div>
      </div>

      {/* Right Side: Informational Detail Skeletons */}
      <div className="lg:w-5/12 flex flex-col justify-between pt-4">
        <div>
          {/* Large Title Bar 1 */}
          <div className="relative overflow-hidden bg-zinc-900/60 border border-white/5 h-10 w-4/5 mb-3">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full animate-shimmer" />
          </div>
          {/* Sub Title Bar 2 */}
          <div className="relative overflow-hidden bg-zinc-900/40 border border-white/5 h-10 w-3/5 mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full animate-shimmer" />
          </div>

          {/* Meta Information Icons and Bars */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-zinc-800" />
              <div className="relative overflow-hidden bg-zinc-900/50 border border-white/5 h-4 w-1/3">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full animate-shimmer" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Award className="w-4 h-4 text-zinc-800" />
              <div className="relative overflow-hidden bg-zinc-900/50 border border-white/5 h-4 w-1/4">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full animate-shimmer" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Skeleton */}
        <div className="mt-12 flex items-center gap-4 text-zinc-800">
          <div className="relative overflow-hidden bg-zinc-900/40 border border-white/5 h-3.5 w-1/5">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full animate-shimmer" />
          </div>
          <div className="h-px flex-1 bg-zinc-900/60 border-t border-dashed border-zinc-800/40" />
          <View className="w-4 h-4 text-zinc-800" />
        </div>
      </div>
    </div>
  );
};


// Redesigned Project Row Card matching the provided screenshot with 3D tilt effects
const ProjectRowCard: React.FC<{ 
  project: Project, 
  onClick: () => void, 
  variants: any, 
  priority?: boolean,
  isEditMode?: boolean,
  onDelete?: (id: string, title: string) => void,
  onUpdate?: (id: string, title: string, location: string, status: string, fullImage: string, gallery: string[]) => void
}> = ({ project, onClick, variants, priority = false, isEditMode = false, onDelete, onUpdate }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const scale = useMotionValue(1);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(project.title);
  const [editLocation, setEditLocation] = useState(project.location || "");
  const [editStatus, setEditStatus] = useState(project.status || "Completed");
  const [editGallery, setEditGallery] = useState(project.gallery || []);
  const [editFullImage, setEditFullImage] = useState(project.fullImage);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newImages: string[] = [];
    for (let i = 0; i < files.length; i++) {
      try {
        const b64 = await fileToBase64(files[i]);
        newImages.push(b64);
      } catch (err) {
        console.error(err);
      }
    }
    if (newImages.length > 0) {
      setEditGallery(prev => [...prev, ...newImages]);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  
  const handleSave = () => {
    onUpdate?.(project.id, editTitle, editLocation, editStatus, editFullImage, editGallery);
    setIsEditing(false);
  };
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });
  const rotateXSpring = useSpring(rotateX, { stiffness: 150, damping: 15, mass: 0.1 });
  const rotateYSpring = useSpring(rotateY, { stiffness: 150, damping: 15, mass: 0.1 });
  const scaleSpring = useSpring(scale, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Magnetic pull distance (10% of the distance from center)
    x.set((e.clientX - centerX) * 0.02); 
    y.set((e.clientY - centerY) * 0.02); 

    // 3D Tilt calculation
    const rotX = (e.clientY - centerY) / (rect.height / 2) * -8; // -8 to 8 deg
    const rotY = (e.clientX - centerX) / (rect.width / 2) * 8; // -8 to 8 deg
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
    scale.set(1.02);
    // Aggressively prefetch the gallery images when user hovers the card to reduce perceived load time in modal
    if (project.gallery && project.gallery.length > 0) {
      project.gallery.forEach(img => prefetchImage(img));
    }
  };

  useEffect(() => {
    setEditTitle(project.title);
    setEditLocation(project.location || "");
    setEditStatus(project.status || "Completed");
    setEditGallery(project.gallery || []);
    setEditFullImage(project.fullImage);
  }, [project]);

  return (
    <motion.div 
      onClick={isEditMode ? undefined : onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        perspective: 1000,
        x: mouseXSpring,
        y: mouseYSpring,
        rotateX: rotateXSpring,
        rotateY: rotateYSpring,
        scale: scaleSpring,
        transformStyle: "preserve-3d"
      }}
      className={`group relative ${isEditMode ? "cursor-default" : "cursor-pointer"} bg-transparent border-b border-white/10 hover:border-white/20 pb-8 overflow-hidden flex flex-col lg:flex-row gap-12 rounded-none transition-all duration-500 hover:bg-white/[0.02] z-10 hover:z-20 will-change-transform ${!isEditMode ? "hover:shadow-2xl hover:shadow-black/70" : ""}`}
      whileHover={isEditMode ? {} : {}}
      variants={variants}
    >
      {/* Left Side: Large Visual */}
      <div className="lg:w-7/12 aspect-[16/9] overflow-hidden bg-zinc-800 relative">
        <LazyImage
          src={isEditing ? editFullImage : project.fullImage}
          alt={project.title}
          className="w-full h-full"
          imgClassName="group-hover:scale-105 transition-transform duration-700"
          priority={priority}
        />
        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
        
        {isEditMode && (
          <div className="absolute inset-0 bg-black/60 z-20 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
            {!isEditing && (
              <>
                <button 
                  className="px-4 py-2 bg-amber-500 text-black text-xs font-bold uppercase tracking-widest hover:bg-amber-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                >
                  Edit Details
                </button>
                <button 
                  className="px-4 py-2 bg-red-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-red-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(project.id, project.title);
                  }}
                >
                  Delete
                </button>
              </>
            )}
            {isEditing && (
              <button 
                className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-emerald-700"
                onClick={(e) => {
                    e.stopPropagation();
                    handleSave();
                }}
              >
                Save
              </button>
            )}
          </div>
        )}
      </div>

      {/* Right Side: Informational Detail */}
      <div className="lg:w-5/12 flex flex-col justify-start pt-4">
        {/* Title */}
        {isEditing ? (
            <input 
                className="text-3xl md:text-5xl font-light text-[#E5E3DF] uppercase tracking-[0.15em] mb-4 font-sans leading-tight bg-transparent border border-white/20 p-2"
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
            />
        ) : (
            <h3 className="text-3xl md:text-5xl font-light text-[#E5E3DF] uppercase tracking-[0.15em] mb-4 font-sans leading-tight">
              {project.title}
            </h3>
        )}
        
        {/* Meta Info */}
        <div className="space-y-3 mb-10">
          <div className="flex items-center gap-3 text-zinc-400">
            <MapPin className="w-4 h-4 text-amber-600/70" />
            {isEditing ? (
                 <input 
                    className="text-sm font-sans tracking-wide bg-transparent border border-white/20 p-1 flex-1"
                    value={editLocation}
                    onChange={e => setEditLocation(e.target.value)}
                />
            ) : (
                <span className="text-sm font-sans tracking-wide">{project.location}</span>
            )}
          </div>
          <div className="flex items-center gap-3 text-zinc-400">
            <Award className="w-4 h-4 text-amber-600/70" />
            {isEditing ? (
                 <input 
                    className="text-sm font-sans tracking-wide bg-transparent border border-white/20 p-1 flex-1"
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value)}
                />
            ) : (
                <span className="text-sm font-sans tracking-wide">Status: {project.status || "Completed"}</span>
            )}
          </div>
          
          {isEditing && (
            <div className="mt-4 border-t border-white/10 pt-4">
              <h4 className="text-xs font-bold uppercase text-white mb-2">Gallery Images</h4>
              <div className="flex flex-wrap gap-2 mb-3">
                {editGallery.map((img, idx) => (
                    <div key={idx} className="relative w-16 h-16 bg-zinc-800 border border-white/20">
                        <img src={img} alt="gallery" className="w-full h-full object-cover" />
                        <button className="absolute -top-1 -right-1 bg-red-600 text-white w-4 h-4 rounded-full text-[10px] flex items-center justify-center z-10" onClick={() => setEditGallery(editGallery.filter((_, i) => i !== idx))}>x</button>
                        <button className="absolute -bottom-1 -right-1 bg-blue-600 text-white w-4 h-4 rounded-full text-[10px] flex items-center justify-center z-10" onClick={() => setEditFullImage(img)} title="Set as cover">+</button>
                    </div>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <button 
                    type="button"
                    className="text-xs bg-amber-600 text-black p-1.5 px-3 font-semibold uppercase tracking-wider hover:bg-amber-500 transition-colors" 
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Upload File(s)
                  </button>
                  <button 
                    type="button"
                    className="text-xs border border-white/20 text-zinc-400 p-1.5 px-3 hover:text-white hover:bg-zinc-900 transition-colors" 
                    onClick={() => {
                      const url = prompt("Enter image URL:");
                      if (url) setEditGallery([...editGallery, url]);
                    }}
                  >
                    Add via URL
                  </button>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  accept="image/*" 
                  multiple 
                  className="hidden" 
                />
              </div>
            </div>
          )}
        </div>

        {/* Call to Detail CTA */}
        {!isEditMode && (
          <div className="mt-12 flex items-center gap-4 text-zinc-600 group-hover:text-amber-500 transition-colors duration-300">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] font-bold">Explore Blueprint</span>
            <div className="h-px flex-1 bg-zinc-800 group-hover:bg-amber-500/30 transition-colors" />
            <View className="w-4 h-4" />
          </div>
        )}
      </div>
    </motion.div>
  );
}


interface ProjectPortfolioProps {
  initialFilter?: string;
  onNavigate?: (id: string) => void;
}

export default function ProjectPortfolio({ initialFilter = "all", onNavigate }: ProjectPortfolioProps) {
  const [filter, setFilter] = useState<string>(initialFilter);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeGalleryIdx, setActiveGalleryIdx] = useState<number>(0);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const modalScrollRef = useRef<HTMLDivElement>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const { projects: projectsList, loading: isLoading } = useFirebaseData();
  const [downsampledCache, setDownsampledCache] = useState<Record<string, string>>({});

  useEffect(() => {
    console.log("ProjectPortfolio projectsList updated:", projectsList.length);
  }, [projectsList]);

  useEffect(() => {
    if (!selectedProject) {
      setDownsampledCache({});
      return;
    }
    const gallery = selectedProject.gallery || [];
    const imagesToProcess = [selectedProject.fullImage, ...gallery];
    
    let active = true;
    const processImages = async () => {
      const cache: Record<string, string> = {};
      // Initialize with original images first
      imagesToProcess.forEach(img => {
        cache[img] = img;
      });
      if (active) {
        setDownsampledCache({ ...cache });
      }

      // Compute downsampled versions in background
      for (const img of imagesToProcess) {
        if (!active) break;
        try {
          const thumb = await downsampleImage(img, 240);
          if (active) {
            setDownsampledCache(prev => ({
              ...prev,
              [img]: thumb
            }));
          }
        } catch (e) {
          console.error("Downsampling failure", e);
        }
      }
    };
    processImages();
    return () => {
      active = false;
    };
  }, [selectedProject]);

  useEffect(() => {
    setIsAdmin(!!localStorage.getItem("earthfirm_admin_passcode"));
  }, []);

  const handleDeleteProject = async (id: string, title: string) => {
    if (!window.confirm(`Are you absolutely sure you want to permanently delete "${title}"?`)) {
      return;
    }
    try {
      await deleteLocalProject(id);
    } catch (err: any) {
      alert(err.message || "Failed to delete project.");
    }
  };

  const handleUpdateProject = async (id: string, title: string, location: string, status: string, fullImage: string, gallery: string[]) => {
    try {
      const existing = projectsList.find(p => p.id === id);
      if (!existing) return;
      
      await updateLocalProject({
        ...existing,
        title,
        location,
        status,
        fullImage,
        gallery,
      });
    } catch (err: any) {
      alert(err.message || "Failed to update project.");
    }
  };

  // Sync activeGalleryIdx with lightbox index when lightbox is open
  React.useEffect(() => {
    if (lightboxIdx !== null) {
      setActiveGalleryIdx(lightboxIdx);
    }
  }, [lightboxIdx]);

  // Sync filter if prop changes
  React.useEffect(() => {
    setFilter(initialFilter);
  }, [initialFilter]);

  const lightboxImages = selectedProject 
    ? [selectedProject.fullImage, ...(selectedProject.gallery || [])] 
    : [];

  React.useEffect(() => {
    if (selectedProject && modalScrollRef.current) {
      const scrollElement = modalScrollRef.current;
      
      // Instant reset
      scrollElement.scrollTo({ top: 0, behavior: 'auto' });
      scrollElement.scrollTop = 0;
      
      // Reset gallery index on selection
      setActiveGalleryIdx(0);

      // Trigger a resize/scroll event to wake up IntersectionObservers
      requestAnimationFrame(() => {
        window.dispatchEvent(new Event('scroll'));
        window.dispatchEvent(new Event('resize'));
      });
    }
  }, [selectedProject]);

  React.useEffect(() => {
    if (projectsList.length === 0) return;
    // Preload full images and galleries of the top ranking (first 3) projects after mount
    const topProjects = projectsList.slice(0, 3);
    setTimeout(() => {
      topProjects.forEach(p => {
        prefetchImage(p.fullImage);
        p.gallery?.forEach(img => prefetchImage(img));
      });
    }, 500); // delay slightly to let initial render breath
  }, [projectsList]);

  // Filter projects list
  const filteredProjects = filter === "all" 
    ? projectsList 
    : projectsList.filter(p => p.category && p.category.includes(filter));

  return (
    <section className="py-12 bg-[#0B0B0A] border-t border-white/10" id="portfolio-section">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">

        {/* Header content */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-12" id="portfolio-header">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#141413] border border-white/10 px-3 py-1 rounded-none">
              <BookOpen className="w-3.5 h-3.5 text-amber-500 stroke-[1.5]" />
              <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-[0.2em] font-semibold">Exemplary Projects</span>
            </div>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-[#E5E3DF] uppercase tracking-[0.08em] xs:tracking-[0.15em] lg:tracking-[0.2em] leading-tight">
              Selected <span className="font-normal italic text-zinc-600 font-serif lowercase tracking-normal">Works</span>
            </h2>
            <p className="text-zinc-500 text-base max-w-xl font-sans leading-relaxed">
              Quietly building this season. Each structure is an environmental case study—specifically optimized for local solar angles and circular materials.
            </p>
          </div>

          <div className="flex flex-col items-end gap-4">
            {isAdmin && (
              <button
                onClick={() => setIsEditMode(!isEditMode)}
                className={`py-3 px-6 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 border ${
                  isEditMode
                    ? "bg-red-600 border-red-600 text-white"
                    : "bg-transparent border-white/10 text-zinc-500 hover:text-white"
                }`}
              >
                {isEditMode ? "Exit Edit Mode" : "Enable Edit Mode"}
              </button>
            )}
            {/* Sorter Buttons */}
            <div className="flex flex-wrap gap-2" id="portfolio-filters">
              {[
                { id: "all", label: "All Works" },
                { id: "architecture", label: "Architecture" },
                { id: "interior", label: "Interiors" },
                { id: "landscape", label: "Landscape" },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setFilter(btn.id)}
                  className={`py-4 md:py-3 px-6 rounded-none text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer border ${
                    filter === btn.id 
                      ? "bg-amber-600 border-amber-600 text-white shadow-[0_0_15px_rgba(217,119,6,0.3)]"
                      : "border-white/10 text-zinc-500 hover:text-white hover:bg-zinc-900 bg-transparent"
                  }`}
                  id={`filter-btn-${btn.id}`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Portfolio Cards Grid - Now a single column list */}
        {isLoading ? (
          <div className="flex flex-col gap-12" id="portfolio-skeleton-grid">
            <ProjectSkeletonCard />
            <ProjectSkeletonCard />
            <ProjectSkeletonCard />
          </div>
        ) : (
          <motion.div 
            key={`${filter}-${projectsList.length}`}
            className="flex flex-col gap-12" 
            id="portfolio-grid"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.2 }
              }
            }}
          >
            {filteredProjects.map((project, idx) => (
              <ProjectRowCard 
                key={project.id} 
                project={project} 
                onClick={() => setSelectedProject(project)} 
                priority={idx < 2}
                isEditMode={isEditMode}
                onDelete={handleDeleteProject}
                onUpdate={handleUpdateProject}
                variants={{
                  hidden: { opacity: 0, y: 60 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] } }
                }} 
              />
            ))}
          </motion.div>
        )}


        {/* Full-Screen Detailed Inspection Drawer / Modal overlay */}
        {selectedProject && typeof document !== "undefined" && createPortal(
          <div className="fixed inset-0 z-[100] flex flex-col bg-cover bg-center bg-no-repeat bg-[#0B0B0A] overscroll-contain" id="portfolio-modal" style={{ backgroundImage: `url(${downsampledCache[selectedProject.fullImage] || selectedProject.fullImage})`, overscrollBehavior: "contain" }}>
            <div className="fixed inset-0 z-0 bg-[#0B0B0A]/85 backdrop-blur-md" />
            
            <div className="relative z-10 flex flex-col h-screen w-full overflow-hidden">
              {/* Sticky Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between px-6 md:px-12 py-4 md:py-6 bg-[#0B0B0A]/90 backdrop-blur-md border-b border-white/10 flex-shrink-0">
                <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
                  <nav className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs font-mono uppercase tracking-widest text-zinc-500 font-bold whitespace-nowrap overflow-hidden">
                    <button onClick={() => setSelectedProject(null)} className="hover:text-white transition-colors cursor-pointer shrink-0 uppercase tracking-widest">Portfolio</button>
                    <span className="text-zinc-700 shrink-0">/</span>
                    <span className="text-[#E5E3DF] bg-zinc-800 px-2 md:px-2.5 py-1 rounded-none shrink-0 tracking-widest uppercase text-[10px]">{selectedProject.category}</span>
                    <span className="text-zinc-700 shrink-0 hidden sm:inline">/</span>
                    <h2 className="text-sm md:text-xl font-light font-display text-[#E5E3DF] truncate shrink-0 hidden sm:inline uppercase tracking-[0.15em]">
                      {selectedProject.title}
                    </h2>
                  </nav>
                </div>
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="p-3 rounded-none bg-zinc-800 text-white hover:bg-[var(--color-earthy-sage)] hover:rotate-90 transition-all duration-300 cursor-pointer"
                  id="modal-close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Project Modal Container with fixed height and overscroll containment */}
              <div 
                ref={modalScrollRef} 
                className="flex-1 overflow-y-auto overscroll-contain h-[calc(100vh-80px)] md:h-[calc(100vh-96px)] w-full"
                id="modal-scroll-container"
                style={{ overscrollBehavior: "contain" }}
              >
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-4 md:py-8 pb-32 w-full grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
                  
                  {/* Column One: Details, ratings, specifications */}
                  <div className="xl:col-span-4 space-y-8 xl:sticky xl:top-8 text-[#E5E3DF] order-2 xl:order-1">
                    <div>
                      <p className="text-zinc-400 text-sm md:text-base leading-relaxed font-sans">
                        {selectedProject.description}
                      </p>
                      <p className="text-zinc-500 text-xs font-mono mt-4 flex items-center gap-1.5 font-sans justify-between">
                        <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-zinc-600" /> {selectedProject.location}</span>
                        {selectedProject.clientName && (
                          <span className="uppercase font-bold text-zinc-400 text-[10px] tracking-widest bg-zinc-900/50 px-2 py-1 border border-white/5">Client: {selectedProject.clientName}</span>
                        )}
                      </p>
                    </div>

                    {/* Project metadata indicators */}
                    <div className="grid grid-cols-2 gap-4 bg-zinc-950 p-4 border border-white/5 rounded-none">
                      <div>
                        <span className="text-[9px] font-mono text-zinc-500 block uppercase font-bold tracking-widest">Scope Area</span>
                        <span className="text-[#E5E3DF] text-xs md:text-sm font-bold font-mono">{selectedProject.area}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-zinc-500 block uppercase font-bold tracking-widest">
                          Completed At
                        </span>
                        <span className="text-[#E5E3DF] text-xs md:text-sm font-bold font-mono uppercase">
                          {selectedProject.year}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-zinc-500 block uppercase font-bold tracking-widest">Build Duration</span>
                        <span className="text-[#E5E3DF] text-xs md:text-sm font-bold font-mono">{selectedProject.duration}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-zinc-500 block uppercase font-bold tracking-widest">Grid status</span>
                        <span className="text-emerald-500 text-xs md:text-sm font-bold font-mono uppercase">Off-Grid Ready</span>
                      </div>
                    </div>

                    {/* Materials Sourced */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase font-bold block">Environmental Materials board</span>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.materials?.map((mat, idx) => (
                          <span key={idx} className="bg-zinc-900 border border-white/5 px-2.5 py-1.5 text-zinc-300 font-mono text-[10px] uppercase rounded-none">
                            {mat}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Unique sustainable details */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase font-bold block">Passive Solar details</span>
                      <div className="space-y-3 pl-1">
                        {selectedProject.features?.map((fea, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-zinc-400 text-sm font-sans">
                            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{fea}</span>
                          </div>
                        ))}
                      </div>
                    </div>



                    {/* Consult Button */}
                    <div className="pt-8 mb-12">
                      <button
                        onClick={() => {
                          setSelectedProject(null);
                          if (onNavigate) {
                            onNavigate("consultation");
                          } else {
                            const consultButton = document.getElementById("nav-consultation") || document.getElementById("nav-contact");
                            if (consultButton) consultButton.click();
                          }
                        }}
                        className="w-full cursor-pointer bg-[#E5E3DF] hover:bg-white text-[#0B0B0A] text-sm py-4 rounded-none uppercase font-bold tracking-[0.2em] transition-all font-sans"
                      >
                        Discuss a Project
                      </button>
                    </div>
                  </div>

                  {/* Column Two: Interactive Media Gallery Showcase with Cross-fade */}
                  <div className="xl:col-span-8 flex flex-col gap-6 md:gap-8 order-1 xl:order-2 w-full min-w-0">
                    {/* Main Featured Image Container */}
                    <div className="relative bg-zinc-950 border border-white/5 p-1 md:p-2.5 overflow-hidden w-full aspect-[16/10] max-h-[80vh] flex items-center justify-center">
                      <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
                        <AnimatePresence mode="popLayout" initial={false}>
                          <motion.div
                            key={activeGalleryIdx}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="absolute inset-0 w-full h-full flex items-center justify-center cursor-pointer group/main"
                            onClick={() => setLightboxIdx(activeGalleryIdx)}
                          >
                            <LazyImage
                              src={lightboxImages[activeGalleryIdx]}
                              alt={`${selectedProject.title} active view`}
                              className="w-full h-full"
                              imgClassName="w-full h-full object-cover transition-transform duration-700 group-hover/main:scale-102"
                              priority={true}
                            />
                            {/* Overlay trigger indicator on hover */}
                            <div className="absolute inset-0 bg-black/0 group-hover/main:bg-black/30 transition-all duration-300 flex items-center justify-center">
                              <Maximize2 className="w-10 h-10 text-white opacity-0 group-hover/main:opacity-100 transform scale-50 group-hover/main:scale-100 transition-all duration-300" />
                            </div>
                          </motion.div>
                        </AnimatePresence>
                      </div>

                      {/* Navigation arrows (floating over image) */}
                      {lightboxImages.length > 1 && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveGalleryIdx((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length);
                            }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/60 hover:bg-black/90 hover:text-amber-500 border border-white/10 text-white transition-all duration-300 cursor-pointer flex items-center justify-center"
                            title="Previous image"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveGalleryIdx((prev) => (prev + 1) % lightboxImages.length);
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/60 hover:bg-black/90 hover:text-amber-500 border border-white/10 text-white transition-all duration-300 cursor-pointer flex items-center justify-center"
                            title="Next image"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>
                    
                    {/* Horizontal Row of Interactive Thumbnails */}
                    {lightboxImages.length > 1 && (
                      <div className="flex flex-col gap-3 py-4 border-t border-white/10">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono tracking-widest text-[#E5E3DF]/50 uppercase font-bold block">
                            Project Blueprint Gallery
                          </span>
                          <span className="text-[10px] font-mono font-bold text-amber-500">
                            {activeGalleryIdx + 1} / {lightboxImages.length}
                          </span>
                        </div>
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                          {lightboxImages.map((img, idx) => (
                            <button
                              key={idx}
                              onClick={() => setActiveGalleryIdx(idx)}
                              className={`relative w-24 aspect-[16/10] md:w-32 md:aspect-[16/10] shrink-0 overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                                activeGalleryIdx === idx 
                                  ? "border-amber-600 scale-105 shadow-[0_0_15px_rgba(217,119,6,0.3)]" 
                                  : "border-white/5 opacity-50 hover:opacity-100 hover:border-white/30"
                              }`}
                            >
                              <LazyImage
                                src={downsampledCache[img] || img}
                                alt={`Showcase thumb ${idx + 1}`}
                                className="w-full h-full"
                                imgClassName="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      </div>

      {/* Lightbox Overlay */}
      {lightboxIdx !== null && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[200] overflow-hidden flex flex-col bg-[#0B0B0A]/95 backdrop-blur-xl transition-all duration-500" id="project-lightbox">
          {/* Lightbox Controls Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <div className="space-y-0.5">
              <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest block font-bold">
                Image {lightboxIdx + 1} / {lightboxImages.length}
              </span>
              <span className="text-[11px] text-[#E5E3DF] font-sans uppercase tracking-[0.1em]">
                {selectedProject?.title}
              </span>
            </div>
            <button 
              onClick={() => setLightboxIdx(null)}
              className="p-3 bg-zinc-800 text-white hover:bg-zinc-700 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 relative flex items-center justify-center p-0 min-h-0 overflow-hidden touch-none">
            {/* Previous Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIdx((prev) => (prev !== null ? (prev - 1 + lightboxImages.length) % lightboxImages.length : null));
              }}
              className="absolute left-2 md:left-6 z-20 p-3 bg-black/40 hover:bg-black/80 text-white backdrop-blur-md transition-all cursor-pointer border border-white/10 group flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5 md:w-8 md:h-8 group-hover:-translate-x-1 transition-transform" />
            </button>

            {/* Main High-Res Image Display with Swipe Support and absolute cross-fade */}
            <div className="w-full h-full min-h-0 flex items-center justify-center overflow-hidden p-0 relative">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={lightboxIdx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_, info) => {
                    const swipeThreshold = 50;
                    if (info.offset.x > swipeThreshold) {
                      setLightboxIdx((prev) => (prev !== null ? (prev - 1 + lightboxImages.length) % lightboxImages.length : null));
                    } else if (info.offset.x < -swipeThreshold) {
                      setLightboxIdx((prev) => (prev !== null ? (prev + 1) % lightboxImages.length : null));
                    }
                  }}
                  className="absolute inset-0 w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
                >
                  <LazyImage
                    src={lightboxImages[lightboxIdx]}
                    alt={`Lightbox image ${lightboxIdx + 1}`}
                    className="w-full h-full min-h-0 flex items-center justify-center pointer-events-none !bg-transparent"
                    imgClassName="!object-contain w-full h-full"
                    priority={true}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Next Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIdx((prev) => (prev !== null ? (prev + 1) % lightboxImages.length : null));
              }}
              className="absolute right-2 md:right-6 z-20 p-3 bg-black/40 hover:bg-black/80 text-white backdrop-blur-md transition-all cursor-pointer border border-white/10 group flex items-center justify-center"
            >
              <ChevronRight className="w-5 h-5 md:w-8 md:h-8 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          {/* Mobile Swipe Hint */}
          <div className="text-center pb-2 sm:hidden">
            <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Swipe to navigate</span>
          </div>
          
          {/* Thumbnails list at bottom */}
          <div className="px-6 py-8 border-t border-white/10 overflow-x-auto whitespace-nowrap bg-black/20">
            <div className="flex justify-center gap-3">
              {lightboxImages.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setLightboxIdx(idx)}
                  className={`w-16 h-10 md:w-24 md:h-14 overflow-hidden border-2 transition-all duration-300 ${
                    lightboxIdx === idx ? "border-amber-600 scale-105" : "border-white/10 opacity-40 hover:opacity-100"
                  }`}
                >
                  <LazyImage 
                    src={downsampledCache[img] || img} 
                    alt={`Thumb ${idx}`} 
                    className="w-full h-full"
                    imgClassName="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
