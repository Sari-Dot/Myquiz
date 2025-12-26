import { motion } from "motion/react";

export function CyberBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Dark gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0D14] via-[#111827] to-[#0A0D14]" />
      
      {/* Cyber grid */}
      <div className="absolute inset-0 cyber-grid opacity-30" />
      
      {/* Animated neon lines */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4EE1FF] to-transparent"
        animate={{
          opacity: [0.3, 0.8, 0.3],
          y: [0, 800]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      <motion.div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF4B91] to-transparent"
        animate={{
          opacity: [0.3, 0.8, 0.3],
          y: [200, 1000]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-[#4EE1FF] rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            y: [0, -100]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 5
          }}
        />
      ))}
      
      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-[#4EE1FF]/30" />
      <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-[#FF4B91]/30" />
      <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-[#FFD059]/30" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-[#4EE1FF]/30" />
      
      {/* Scanlines overlay */}
      <div className="absolute inset-0 scanlines opacity-20" />
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/50" />
    </div>
  );
}
