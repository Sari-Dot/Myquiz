import { motion } from "motion/react";
import { ReactNode } from "react";

interface AdminHologramPanelProps {
  children: ReactNode;
  className?: string;
}

export function AdminHologramPanel({ children, className = "" }: AdminHologramPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative border-2 border-[#FF8C42] bg-[#111827]/80 backdrop-blur-md p-8 ${className}`}
      style={{
        boxShadow: "0 0 30px rgba(255, 140, 66, 0.3)"
      }}
    >
      {/* Corner brackets - larger for admin */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#FF8C42]" />
      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#FF8C42]" />
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#FF8C42]" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#FF8C42]" />

      {/* Top accent line */}
      <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#FF8C42] to-transparent" />
      
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#FF8C42] to-transparent" />

      {/* Scanlines */}
      <div className="absolute inset-0 scanlines pointer-events-none opacity-30" />

      {/* Glitch overlay - subtle for admin */}
      <motion.div
        className="absolute inset-0 bg-[#FF8C42] pointer-events-none"
        animate={{
          opacity: [0, 0.05, 0]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 2
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
