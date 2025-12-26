import { motion } from "motion/react";
import { ReactNode } from "react";

// Amber Neon Button Component
interface AmberNeonButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  fullWidth?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export function AmberNeonButton({
  children,
  onClick,
  variant = "primary",
  fullWidth = false,
  disabled = false,
  type = "button",
}: AmberNeonButtonProps) {
  const variants = {
    primary: {
      border: "#FF8C42",
      text: "#FF8C42",
      bg: "#FF8C42",
      shadow: "0 0 20px #FF8C4260",
    },
    secondary: {
      border: "#FF8C42",
      text: "#FF8C42",
      bg: "transparent",
      shadow: "0 0 10px #FF8C4230",
    },
    danger: {
      border: "#FF4B4B",
      text: "#FF4B4B",
      bg: "#FF4B4B",
      shadow: "0 0 20px #FF4B4B60",
    },
  };

  const style = variants[variant];

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`relative px-6 py-3 border-2 tracking-wider transition-all ${
        fullWidth ? "w-full" : ""
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      style={{
        borderColor: style.border,
        color: variant === "secondary" ? style.text : "#000",
        backgroundColor: variant === "secondary" ? "transparent" : style.bg,
        boxShadow: style.shadow,
      }}
    >
      {/* Corner accents */}
      <div
        className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2"
        style={{ borderColor: style.border }}
      />
      <div
        className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2"
        style={{ borderColor: style.border }}
      />

      {children}
    </motion.button>
  );
}

// Admin Hologram Panel Component
interface AdminHologramPanelProps {
  children: ReactNode;
  className?: string;
}

export function AdminHologramPanel({ children, className = "" }: AdminHologramPanelProps) {
  return (
    <div
      className={`relative border-2 border-[#FF8C42]/30 bg-gradient-to-br from-black/90 to-[#FF8C42]/5 p-6 backdrop-blur-md ${className}`}
      style={{
        boxShadow: "0 0 30px #FF8C4220, inset 0 0 30px #FF8C4210",
      }}
    >
      {/* Corner brackets */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#FF8C42]" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#FF8C42]" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#FF8C42]" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#FF8C42]" />

      {/* Scanline effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, #FF8C42 2px, #FF8C42 4px)",
        }}
      />

      {children}
    </div>
  );
}

// Glitch Text Component
interface GlitchTextProps {
  children: ReactNode;
  className?: string;
}

export function GlitchText({ children, className = "" }: GlitchTextProps) {
  return (
    <div className={`relative inline-block ${className}`}>
      <span className="relative z-10">{children}</span>
      
      {/* Glitch layers */}
      <span
        className="absolute top-0 left-0 opacity-70 animate-glitch-1"
        style={{
          clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)",
          color: "#FF8C42",
        }}
        aria-hidden="true"
      >
        {children}
      </span>
      <span
        className="absolute top-0 left-0 opacity-70 animate-glitch-2"
        style={{
          clipPath: "polygon(0 55%, 100% 55%, 100% 100%, 0 100%)",
          color: "#FFA500",
        }}
        aria-hidden="true"
      >
        {children}
      </span>
    </div>
  );
}
