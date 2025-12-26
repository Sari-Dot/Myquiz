import { motion, AnimatePresence } from "motion/react";
import { X, Lightbulb } from "lucide-react";

interface HintPanelProps {
  hint: string;
  level: "easy" | "medium" | "hard";
  onClose: () => void;
}

export function HintPanel({ hint, level, onClose }: HintPanelProps) {
  const levelColors = {
    easy: "#4EE1FF",
    medium: "#FFD059",
    hard: "#FF4B91"
  };

  const color = levelColors[level];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8"
        onClick={onClose}
      >
        {/* Glitch flash effect */}
        <motion.div
          className="absolute inset-0 bg-[#FFD059]/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 0.3 }}
        />

        <motion.div
          initial={{ x: 300, opacity: 0, rotateY: 90 }}
          animate={{ x: 0, opacity: 1, rotateY: 0 }}
          exit={{ x: 300, opacity: 0, rotateY: 90 }}
          transition={{ type: "spring", damping: 20 }}
          className="relative max-w-2xl w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div 
            className="border-2 backdrop-blur-md p-8 relative overflow-hidden"
            style={{ 
              borderColor: color,
              backgroundColor: `${color}10`
            }}
          >
            {/* Scanlines */}
            <div className="absolute inset-0 scanlines pointer-events-none" />
            
            {/* Noise */}
            <div className="absolute inset-0 noise-bg pointer-events-none" />

            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4" style={{ borderColor: color }} />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4" style={{ borderColor: color }} />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4" style={{ borderColor: color }} />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4" style={{ borderColor: color }} />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 transition-colors z-10"
              style={{ color }}
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative z-10 space-y-6">
              {/* Header */}
              <div className="text-center space-y-4">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex justify-center"
                >
                  <div 
                    className="p-4 border-2"
                    style={{ borderColor: color }}
                  >
                    <Lightbulb className="w-12 h-12" style={{ color }} />
                  </div>
                </motion.div>

                <motion.h2
                  className="text-3xl tracking-wider"
                  style={{ color }}
                  animate={{
                    textShadow: [
                      `0 0 10px ${color}80`,
                      `0 0 20px ${color}`,
                      `0 0 10px ${color}80`
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  INTEL SUPPORT ACTIVATED
                </motion.h2>

                <div className="flex justify-center gap-1">
                  {[...Array(15)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1"
                      style={{ 
                        height: `${Math.random() * 15 + 10}px`,
                        backgroundColor: color
                      }}
                      animate={{
                        opacity: [0.3, 1, 0.3]
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.1
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Hint content */}
              <div 
                className="border-t-2 border-b-2 py-6"
                style={{ borderColor: `${color}40` }}
              >
                <p className="text-xl text-center text-white/90 leading-relaxed tracking-wide px-4">
                  {hint}
                </p>
              </div>

              {/* Digital noise lines */}
              <div className="flex justify-center gap-2">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="w-0.5 bg-white/20"
                    style={{ height: `${Math.random() * 12 + 8}px` }}
                  />
                ))}
              </div>

              {/* Footer tag */}
              <div className="text-center text-sm text-white/60 tracking-wider">
                █ CLASSIFIED INTELLIGENCE █ {level.toUpperCase()} LEVEL █
              </div>
            </div>

            {/* Hologram flicker */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"
              animate={{
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
