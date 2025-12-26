import { motion } from "motion/react";
import { ReactNode } from "react";

interface AmberNeonButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "danger" | "secondary";
  disabled?: boolean;
  type?: "button" | "submit";
  fullWidth?: boolean;
}

export function AmberNeonButton({ 
  children, 
  onClick, 
  variant = "primary",
  disabled = false,
  type = "button",
  fullWidth = false
}: AmberNeonButtonProps) {
  const variants = {
    primary: {
      color: "#FF8C42",
      borderColor: "#FF8C42",
      bgFrom: "rgba(255, 140, 66, 0.1)",
      bgTo: "rgba(255, 140, 66, 0.05)",
      shadow: "0 0 20px rgba(255, 140, 66, 0.5)"
    },
    danger: {
      color: "#FF4B4B",
      borderColor: "#FF4B4B",
      bgFrom: "rgba(255, 75, 75, 0.1)",
      bgTo: "rgba(255, 75, 75, 0.05)",
      shadow: "0 0 20px rgba(255, 75, 75, 0.5)"
    },
    secondary: {
      color: "#9CA3AF",
      borderColor: "#4B5563",
      bgFrom: "rgba(75, 85, 99, 0.1)",
      bgTo: "rgba(75, 85, 99, 0.05)",
      shadow: "none"
    }
  };

  const style = variants[variant];

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative px-8 py-4 border-2 backdrop-blur-md
        transition-all duration-300 overflow-hidden
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      style={{
        borderColor: style.borderColor,
        background: `linear-gradient(135deg, ${style.bgFrom}, ${style.bgTo})`,
        boxShadow: disabled ? 'none' : style.shadow
      }}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
    >
      {/* Corner brackets */}
      <div 
        className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2"
        style={{ borderColor: style.color }}
      />
      <div 
        className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2"
        style={{ borderColor: style.color }}
      />
      <div 
        className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2"
        style={{ borderColor: style.color }}
      />
      <div 
        className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2"
        style={{ borderColor: style.color }}
      />

      {/* Scanlines */}
      <div className="absolute inset-0 scanlines pointer-events-none" />

      {/* Content */}
      <div 
        className="relative z-10 tracking-wider uppercase"
        style={{ color: style.color }}
      >
        {children}
      </div>

      {/* Hover glow effect */}
      {!disabled && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundColor: style.color, opacity: 0 }}
          whileHover={{ opacity: 0.1 }}
        />
      )}
    </motion.button>
  );
}
