import { motion } from "motion/react";

interface GlitchTextProps {
  children: string;
  className?: string;
  intense?: boolean;
}

export function GlitchText({ children, className = "", intense = false }: GlitchTextProps) {
  return (
    <motion.div
      className={`relative inline-block ${className}`}
      animate={intense ? {
        x: [0, -2, 2, -2, 2, 0],
        textShadow: [
          "0 0 0px rgba(78, 225, 255, 0)",
          "-2px 0 5px rgba(78, 225, 255, 0.8), 2px 0 5px rgba(255, 75, 145, 0.8)",
          "2px 0 5px rgba(78, 225, 255, 0.8), -2px 0 5px rgba(255, 75, 145, 0.8)",
          "-2px 0 5px rgba(78, 225, 255, 0.8), 2px 0 5px rgba(255, 75, 145, 0.8)",
          "0 0 0px rgba(78, 225, 255, 0)"
        ]
      } : {}}
      transition={{
        duration: 0.3,
        repeat: Infinity,
        repeatDelay: 2
      }}
    >
      <span className="relative z-10">{children}</span>
      
      {/* RGB Split layers */}
      <span 
        className="absolute top-0 left-0 opacity-70 text-[#4EE1FF]"
        style={{ transform: 'translate(-1px, -1px)' }}
      >
        {children}
      </span>
      <span 
        className="absolute top-0 left-0 opacity-70 text-[#FF4B91]"
        style={{ transform: 'translate(1px, 1px)' }}
      >
        {children}
      </span>
    </motion.div>
  );
}
