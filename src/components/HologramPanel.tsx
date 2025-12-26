import { motion } from "motion/react";
import { ReactNode } from "react";

interface HologramPanelProps {
  children: ReactNode;
  variant?: "cyan" | "magenta" | "yellow" | "white";
  className?: string;
  glitchIntense?: boolean;
}

export function HologramPanel({ 
  children, 
  variant = "cyan", 
  className = "",
  glitchIntense = false
}: HologramPanelProps) {
  const colors = {
    cyan: "border-[#4EE1FF] bg-[#4EE1FF]/5",
    magenta: "border-[#FF4B91] bg-[#FF4B91]/5",
    yellow: "border-[#FFD059] bg-[#FFD059]/5",
    white: "border-white/50 bg-white/5"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative border-2 ${colors[variant]} backdrop-blur-md
        ${glitchIntense ? 'glitch-effect' : ''}
        ${className}
      `}
    >
      {/* Scanlines */}
      <div className="absolute inset-0 scanlines pointer-events-none" />
      
      {/* Noise effect */}
      <div className="absolute inset-0 noise-bg pointer-events-none" />
      
      {/* Corner brackets */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-current" />
      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-current" />
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-current" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-current" />
      
      {/* Content */}
      <div className="relative z-10 p-6">
        {children}
      </div>
      
      {/* Hologram flicker */}
      <div className="absolute inset-0 hologram bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
    </motion.div>
  );
}
