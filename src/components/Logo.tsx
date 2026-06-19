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
  const logoUrl = base.endsWith("/") ? `${base}assets/earthfirm-logo.png` : `${base}/assets/earthfirm-logo.png`;

  // Apply responsive image sizes and scale:
  // On mobile/tablets, we use a smaller clean scale to avoid overlapping menu controls.
  // On desktop (lg+), we preserve the prominent scaled logo matching the user's architectural styling but at a reduced size.
  const imgClasses = isHeader
    ? "select-none h-[14px] sm:h-[16px] md:h-[18px] lg:h-[24px] xl:h-[27px] w-auto object-contain block transform scale-[1.3] sm:scale-[1.4] md:scale-[1.5] lg:scale-[2.8] xl:scale-[3.0] origin-center transition-all duration-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
    : "select-none h-[15px] w-auto object-contain block transition-transform duration-300 transform scale-[1.1] origin-center drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)]";

  return (
    <a 
      href="/" 
      className={`logo inline-flex items-center justify-center transition-transform duration-500 hover:scale-[1.02] ${
        className.includes("translate-") ? "" : "translate-x-[20px]"
      } ${className}`}
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

