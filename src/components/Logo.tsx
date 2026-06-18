import React from "react";

interface LogoProps {
  className?: string;
  theme?: "light" | "dark";
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  id?: string;
  isHeader?: boolean;
}

export default function Logo({ className = "", theme = "dark", onClick, id = "earthfirm-brand-logo", isHeader = false }: LogoProps) {
  const base = import.meta.env.BASE_URL || "/";
  const logoUrl = base.endsWith("/") ? `${base}assets/earthfirm-logo.jpeg` : `${base}/assets/earthfirm-logo.jpeg`;

  // Apply responsive image sizes and scale:
  // On mobile/tablets, we use a smaller clean scale to avoid overlapping menu controls.
  // On desktop (lg+), we preserve the prominent 500% scaled logo matching the user's architectural styling.
  const imgClasses = isHeader
    ? "select-none h-[38px] sm:h-[42px] md:h-[48px] lg:h-[72px] xl:h-[84px] w-auto object-contain block transform scale-[1.8] sm:scale-[2.0] md:scale-[2.2] lg:scale-[5.0] origin-center transition-all duration-300"
    : "select-none h-[42px] w-auto object-contain block transition-transform duration-300 transform scale-[1.5] origin-center";

  return (
    <a 
      href="/" 
      className={`logo inline-flex items-center justify-center transition-transform duration-500 hover:scale-[1.02] ${className}`}
      id={id}
      onClick={(e) => {
        if (onClick) {
          onClick(e);
        } else {
          e.preventDefault();
          // Trigger home navigation via clicking nav-home if exists
          const homeBtn = document.getElementById("nav-home") || document.querySelector('[data-nav="home"]');
          if (homeBtn) {
            (homeBtn as HTMLElement).click();
          }
        }
      }}
    >
      <img 
        src={logoUrl}
        alt="EARTHFIRM ARCHITECTS"
        className={imgClasses}
        style={{
          imageRendering: "auto"
        }}
      />
    </a>
  );
}

