import React, { useState, useEffect, useRef } from "react";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
}

// A beautiful, generic low-resolution base64 SVG representing architectural wireframe/landscape structures
// to act as a highly specialized biophilic layout placeholder before loading.
const ARCH_PLACEHOLDER_BASE64 = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNFNUUzREYiLz48cGF0aCBkPSJNMTAgOTAgTDUwIDEwIEw5MCA5MCBaIiBmaWxsPSJub25lIiBzdHJva2U9IiMxQTFBMUEiIHN0cm9rZS13aWR0aD0iMC41IiBzdHJva2Utb3BhY2l0eT0iMC4xNSIvPjxwYXRoIGQ9Ik0zMCA5MCBMNTAgNDAgTDcwIDkwIFoiIGZpbGw9Im5vbmUiIHN0cm9ya2U9IiMxQTFBMUEiIHN0cm9rZS13aWR0aD0iMC41IiBzdHJva2Utb3BhY2l0eT0iMC4xNSIvPjwvc3ZnPg==";

export default function LazyImage({ src, alt, className = "", imgClassName = "", priority = false }: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset states when source image changes (e.g. slideshow transitions)
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "500px", // Increased to 500px to ensure faster loading
      }
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [src, priority]);

  if (hasError) {
    // Silent ultra-high-speed CDN fallback of magnificent biophilic architecture
    let fallbackSrc = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80";
    if (alt.includes("2")) {
      fallbackSrc = "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80";
    } else if (alt.includes("3")) {
      fallbackSrc = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80";
    }
    
    return (
      <div className={`relative overflow-hidden bg-zinc-800 ${className}`} id={`lazy-image-fallback-${alt.replace(/\s+/g, '-').toLowerCase()}`}>
        <img
          src={fallbackSrc}
          alt={alt}
          className={`w-full h-full object-cover opacity-90 transition-opacity duration-1000 ${imgClassName}`}
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden bg-zinc-800 ${className}`}
      id={`lazy-image-wrapper-${alt.replace(/\s+/g, '-').toLowerCase()}`}
    >
      {/* Blur-up Placeholder Layer */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-1000 ease-in-out pointer-events-none"
          id={`placeholder-${alt.replace(/\s+/g, '-').toLowerCase()}`}
        >
          {/* Animated skeleton/placeholder with architectural feel */}
          <div className="w-full h-full bg-zinc-900 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
            <div 
              className="w-full h-full opacity-40 mix-blend-overlay"
              style={{
                backgroundImage: `url(${ARCH_PLACEHOLDER_BASE64})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </div>
        </div>
      )}

      {isInView ? (
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`relative w-full h-full object-cover transition-all duration-[1200ms] cubic-bezier(0.4, 0, 0.2, 1) ${
            isLoaded 
              ? "opacity-100 scale-100 blur-0 grayscale-0" 
              : "opacity-0 scale-110 blur-2xl grayscale"
          } ${imgClassName}`}
          referrerPolicy="no-referrer"
        />
      ) : null}
    </div>
  );
}
