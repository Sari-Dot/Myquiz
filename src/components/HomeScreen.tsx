import { motion } from "motion/react";
import { NeonButton } from "./NeonButton";
import { GlitchText } from "./GlitchText";
import { Zap, Radio, Cpu, Shield } from "lucide-react";

interface HomeScreenProps {
  onStart: () => void;
  onGoToAdmin: () => void;
}

export function HomeScreen({ onStart, onGoToAdmin }: HomeScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-12"
      >
        {/* Logo/Badge */}
        <motion.div
          className="flex justify-center mb-8"
          animate={{
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="relative">
            <div className="w-24 h-24 border-4 border-[#4EE1FF] rotate-45 flex items-center justify-center neon-cyan-glow">
              <Zap className="w-12 h-12 text-[#4EE1FF] -rotate-45" />
            </div>
            {/* Corner accents */}
            <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-[#FF4B91]" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-[#FFD059]" />
          </div>
        </motion.div>

        {/* Main Title */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-[#4EE1FF]/60 tracking-[0.3em] text-sm"
          >
            ▸ NEW ERIDU INTELLIGENCE NETWORK
          </motion.div>
          
          <GlitchText className="text-6xl tracking-wider" intense>
            QUIZ PROTOCOL
          </GlitchText>
          
          <motion.div
            className="text-5xl tracking-widest text-[#FFD059]"
            animate={{
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            ZERO MODE
          </motion.div>

          {/* Barcode decoration */}
          <div className="flex justify-center gap-1 mt-6">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-white/30"
                style={{ height: `${Math.random() * 20 + 20}px` }}
              />
            ))}
          </div>
        </div>

        {/* Play Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="pt-8"
        >
          <NeonButton onClick={onStart} variant="cyan" className="text-xl px-16 py-6">
            <div className="flex items-center gap-3">
              <Radio className="w-6 h-6" />
              INITIATE PROTOCOL
              <Radio className="w-6 h-6" />
            </div>
          </NeonButton>
        </motion.div>

        {/* System info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="grid grid-cols-3 gap-6 pt-12 max-w-2xl mx-auto"
        >
          <div className="border border-[#4EE1FF]/30 bg-[#4EE1FF]/5 p-4 backdrop-blur-sm">
            <Cpu className="w-6 h-6 text-[#4EE1FF] mb-2 mx-auto" />
            <div className="text-xs text-[#4EE1FF]/60">SYS.CORE</div>
            <div className="text-sm text-[#4EE1FF]">ACTIVE</div>
          </div>
          
          <div className="border border-[#FFD059]/30 bg-[#FFD059]/5 p-4 backdrop-blur-sm">
            <Zap className="w-6 h-6 text-[#FFD059] mb-2 mx-auto" />
            <div className="text-xs text-[#FFD059]/60">POWER</div>
            <div className="text-sm text-[#FFD059]">100%</div>
          </div>
          
          <div className="border border-[#FF4B91]/30 bg-[#FF4B91]/5 p-4 backdrop-blur-sm">
            <Radio className="w-6 h-6 text-[#FF4B91] mb-2 mx-auto" />
            <div className="text-xs text-[#FF4B91]/60">SIGNAL</div>
            <div className="text-sm text-[#FF4B91]">STABLE</div>
          </div>
        </motion.div>

        {/* Footer tag */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="pt-8 text-xs text-white/40 tracking-wider"
        >
          █ CLASSIFIED ACCESS ONLY █ NEW ERIDU SECTOR-09 █
        </motion.div>

        {/* Admin access button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="pt-4"
        >
          <button
            onClick={onGoToAdmin}
            className="group flex items-center gap-2 mx-auto px-6 py-3 border border-[#FF8C42]/30 bg-[#FF8C42]/5 hover:bg-[#FF8C42]/10 hover:border-[#FF8C42] transition-all backdrop-blur-sm"
          >
            <Shield className="w-4 h-4 text-[#FF8C42] group-hover:rotate-12 transition-transform" />
            <span className="text-xs text-[#FF8C42]/60 group-hover:text-[#FF8C42] tracking-wider">
              ADMIN ACCESS
            </span>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}