import { motion } from "motion/react";
import { NeonButton } from "./NeonButton";
import { HologramPanel } from "./HologramPanel";
import { Sparkles, Shield, AlertTriangle, ArrowLeft } from "lucide-react";

interface LevelSelectProps {
  onSelectLevel: (level: "easy" | "medium" | "hard") => void;
  onBack: () => void;
}

export function LevelSelect({ onSelectLevel, onBack }: LevelSelectProps) {
  const missions = [
    {
      id: "easy",
      title: "STREET LEVEL",
      subtitle: "MISSION",
      description: "Basic operations • Low risk • Standard protocol",
      icon: Sparkles,
      color: "cyan" as const,
      difficulty: "DIFFICULTY: ★☆☆",
      clearance: "CLEARANCE LEVEL: 1"
    },
    {
      id: "medium",
      title: "SECTOR PATROL",
      subtitle: "MISSION",
      description: "Advanced tasks • Medium risk • Enhanced protocol",
      icon: Shield,
      color: "yellow" as const,
      difficulty: "DIFFICULTY: ★★☆",
      clearance: "CLEARANCE LEVEL: 2"
    },
    {
      id: "hard",
      title: "CRITICAL ZONE",
      subtitle: "OPERATION",
      description: "Elite operations • High risk • Maximum protocol",
      icon: AlertTriangle,
      color: "magenta" as const,
      difficulty: "DIFFICULTY: ★★★",
      clearance: "CLEARANCE LEVEL: 3"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative">
      {/* Back button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-8 left-8"
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#4EE1FF] hover:text-[#4EE1FF]/80 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm tracking-wider">RETURN</span>
        </button>
      </motion.div>

      <div className="max-w-6xl w-full space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="text-sm text-[#4EE1FF]/60 tracking-[0.3em]">
            ▸ MISSION DIRECTORY
          </div>
          <h1 className="text-5xl tracking-wider">
            SELECT PROTOCOL
          </h1>
          <div className="flex justify-center gap-2 pt-4">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="w-0.5 bg-white/20"
                style={{ height: `${Math.random() * 15 + 10}px` }}
              />
            ))}
          </div>
        </motion.div>

        {/* Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {missions.map((mission, index) => (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="group cursor-pointer"
              onClick={() => onSelectLevel(mission.id as "easy" | "medium" | "hard")}
            >
              <HologramPanel variant={mission.color} className="h-full hover:scale-105 transition-transform">
                <div className="space-y-6">
                  {/* Icon */}
                  <div className="flex justify-center">
                    <motion.div
                      className={`
                        p-6 border-2 
                        ${mission.color === 'cyan' ? 'border-[#4EE1FF] bg-[#4EE1FF]/10' : ''}
                        ${mission.color === 'yellow' ? 'border-[#FFD059] bg-[#FFD059]/10' : ''}
                        ${mission.color === 'magenta' ? 'border-[#FF4B91] bg-[#FF4B91]/10' : ''}
                      `}
                      animate={{
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <mission.icon 
                        className={`
                          w-12 h-12
                          ${mission.color === 'cyan' ? 'text-[#4EE1FF]' : ''}
                          ${mission.color === 'yellow' ? 'text-[#FFD059]' : ''}
                          ${mission.color === 'magenta' ? 'text-[#FF4B91]' : ''}
                        `}
                      />
                    </motion.div>
                  </div>

                  {/* Title */}
                  <div className="text-center space-y-2">
                    <div className="text-2xl tracking-wider">
                      {mission.title}
                    </div>
                    <div className={`
                      text-lg
                      ${mission.color === 'cyan' ? 'text-[#4EE1FF]' : ''}
                      ${mission.color === 'yellow' ? 'text-[#FFD059]' : ''}
                      ${mission.color === 'magenta' ? 'text-[#FF4B91]' : ''}
                    `}>
                      {mission.subtitle}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-white/60 text-center leading-relaxed">
                    {mission.description}
                  </p>

                  {/* Stats */}
                  <div className="space-y-2 pt-4 border-t border-white/10">
                    <div className="text-xs text-white/40 tracking-wider">
                      {mission.difficulty}
                    </div>
                    <div className="text-xs text-white/40 tracking-wider">
                      {mission.clearance}
                    </div>
                  </div>

                  {/* Barcode */}
                  <div className="flex gap-1 justify-center pt-4">
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-white/20"
                        style={{ height: `${Math.random() * 12 + 8}px` }}
                      />
                    ))}
                  </div>

                  {/* Hover indicator */}
                  <div className="text-center pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className={`
                      text-sm tracking-wider
                      ${mission.color === 'cyan' ? 'text-[#4EE1FF]' : ''}
                      ${mission.color === 'yellow' ? 'text-[#FFD059]' : ''}
                      ${mission.color === 'magenta' ? 'text-[#FF4B91]' : ''}
                    `}>
                      ▸ DEPLOY
                    </div>
                  </div>
                </div>
              </HologramPanel>
            </motion.div>
          ))}
        </div>

        {/* Footer info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-xs text-white/40 tracking-wider pt-8"
        >
          █ CHOOSE YOUR MISSION WISELY █ ALL OPERATIONS MONITORED █
        </motion.div>
      </div>
    </div>
  );
}