import { motion } from "motion/react";

interface NeonButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "cyan" | "magenta" | "yellow";
  className?: string;
  disabled?: boolean;
}

export function NeonButton({ 
  children, 
  onClick, 
  variant = "cyan", 
  className = "",
  disabled = false
}: NeonButtonProps) {
  const colors = {
    cyan: {
      bg: "bg-[#4EE1FF]/10",
      border: "border-[#4EE1FF]",
      text: "text-[#4EE1FF]",
      glow: "neon-cyan-glow"
    },
    magenta: {
      bg: "bg-[#FF4B91]/10",
      border: "border-[#FF4B91]",
      text: "text-[#FF4B91]",
      glow: "neon-magenta-glow"
    },
    yellow: {
      bg: "bg-[#FFD059]/10",
      border: "border-[#FFD059]",
      text: "text-[#FFD059]",
      glow: "neon-yellow-glow"
    }
  };

  const color = colors[variant];

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative px-8 py-4 ${color.bg} ${color.border} ${color.text} 
        border-2 backdrop-blur-sm transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        corner-brackets overflow-hidden
        ${className}
      `}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      <div className="absolute inset-0 scanlines pointer-events-none" />
      <div className={`absolute inset-0 ${color.glow} opacity-0 group-hover:opacity-100 transition-opacity`} />
      
      {/* Corner brackets */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-current" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-current" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-current" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-current" />
      
      <span className="relative z-10 tracking-wider uppercase">
        {children}
      </span>
    </motion.button>
  );
}
