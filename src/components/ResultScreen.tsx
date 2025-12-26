import { motion } from "motion/react";
import { HologramPanel } from "./HologramPanel";
import { NeonButton } from "./NeonButton";
import { Trophy, Target, Clock, Award, Zap, Home } from "lucide-react";

interface ResultScreenProps {
  score: number;
  total: number;
  time: number;
  level: "easy" | "medium" | "hard";
  hintUsed?: boolean;
  onRetry: () => void;
  onNextMission: () => void;
  onHome: () => void;
}

export function ResultScreen({ 
  score, 
  total, 
  time, 
  level,
  hintUsed = false, 
  onRetry, 
  onNextMission,
  onHome 
}: ResultScreenProps) {
  const percentage = Math.round((score / total) * 100);
  
  const getRating = () => {
    if (percentage >= 90) return { grade: "S", color: "#4EE1FF", text: "PERFECT EXECUTION" };
    if (percentage >= 75) return { grade: "A", color: "#FFD059", text: "EXCELLENT WORK" };
    if (percentage >= 60) return { grade: "B", color: "#FF4B91", text: "GOOD EFFORT" };
    return { grade: "C", color: "#888", text: "NEEDS IMPROVEMENT" };
  };

  const rating = getRating();
  const accuracy = percentage;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="text-sm text-[#4EE1FF]/60 tracking-[0.3em]">
            ▸ MISSION COMPLETE
          </div>
          <motion.h1
            className="text-6xl tracking-wider"
            animate={{
              textShadow: [
                "0 0 20px rgba(78, 225, 255, 0.5)",
                "0 0 40px rgba(78, 225, 255, 0.8)",
                "0 0 20px rgba(78, 225, 255, 0.5)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            PROTOCOL COMPLETE
          </motion.h1>
          
          {/* Hint Usage Tag */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className={`inline-block px-6 py-2 border-2 ${
              hintUsed 
                ? 'border-[#FFD059] bg-[#FFD059]/10 text-[#FFD059]' 
                : 'border-[#4EE1FF] bg-[#4EE1FF]/10 text-[#4EE1FF]'
            } backdrop-blur-sm`}
          >
            <span className="text-sm tracking-wider">
              {hintUsed ? '⚠ ASSISTED CLEAR' : '★ PURE CLEAR BONUS'}
            </span>
          </motion.div>

          <div className="flex justify-center gap-2">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-white/30"
                style={{ height: `${Math.random() * 15 + 10}px` }}
              />
            ))}
          </div>
        </motion.div>

        {/* Rating Badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="flex justify-center"
        >
          <div className="relative">
            <motion.div
              className="w-48 h-48 border-4 flex items-center justify-center"
              style={{ 
                borderColor: rating.color,
                boxShadow: `0 0 30px ${rating.color}80, 0 0 60px ${rating.color}40`
              }}
              animate={{
                rotate: [0, 360]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <div className="text-8xl" style={{ color: rating.color }}>
                {rating.grade}
              </div>
            </motion.div>
            
            {/* Corner accents */}
            <div className="absolute -top-3 -left-3 w-12 h-12 border-t-4 border-l-4 border-[#4EE1FF]" />
            <div className="absolute -top-3 -right-3 w-12 h-12 border-t-4 border-r-4 border-[#FFD059]" />
            <div className="absolute -bottom-3 -left-3 w-12 h-12 border-b-4 border-l-4 border-[#FF4B91]" />
            <div className="absolute -bottom-3 -right-3 w-12 h-12 border-b-4 border-r-4 border-[#4EE1FF]" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-2xl tracking-wider"
          style={{ color: rating.color }}
        >
          {rating.text}
        </motion.div>

        {/* Stats Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <HologramPanel variant="white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Accuracy */}
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <Target className="w-12 h-12 text-[#4EE1FF]" />
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-white/60 tracking-wider">ACCURACY</div>
                  <div className="text-4xl text-[#4EE1FF]">{accuracy}%</div>
                  <div className="text-xs text-white/40">{score} / {total} CORRECT</div>
                </div>
                {/* Progress bar */}
                <div className="h-2 bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full bg-[#4EE1FF]"
                    initial={{ width: 0 }}
                    animate={{ width: `${accuracy}%` }}
                    transition={{ delay: 0.8, duration: 1 }}
                  />
                </div>
              </div>

              {/* Time */}
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <Clock className="w-12 h-12 text-[#FFD059]" />
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-white/60 tracking-wider">TIME ELAPSED</div>
                  <div className="text-4xl text-[#FFD059]">{formatTime(time)}</div>
                  <div className="text-xs text-white/40">MISSION DURATION</div>
                </div>
                {/* Animated circles */}
                <div className="flex justify-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-[#FFD059]"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [1, 0.5, 1]
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <Award className="w-12 h-12 text-[#FF4B91]" />
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-white/60 tracking-wider">PERFORMANCE</div>
                  <div className="text-4xl text-[#FF4B91]">RANK {rating.grade}</div>
                  <div className="text-xs text-white/40">OPERATION RATING</div>
                </div>
                {/* Stars */}
                <div className="flex justify-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        opacity: i < Math.ceil(accuracy / 20) ? 1 : 0.2,
                        scale: 1 
                      }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                    >
                      <Zap 
                        className="w-4 h-4"
                        fill={i < Math.ceil(accuracy / 20) ? "#FF4B91" : "transparent"}
                        color="#FF4B91"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="my-8 border-t border-white/10" />

            {/* Additional Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
              <div>
                <div className="text-white/40 mb-1">LEVEL</div>
                <div className="text-[#4EE1FF] uppercase tracking-wider">{level}</div>
              </div>
              <div>
                <div className="text-white/40 mb-1">QUESTIONS</div>
                <div className="text-[#FFD059]">{total}</div>
              </div>
              <div>
                <div className="text-white/40 mb-1">CORRECT</div>
                <div className="text-[#4EE1FF]">{score}</div>
              </div>
              <div>
                <div className="text-white/40 mb-1">ERRORS</div>
                <div className="text-[#FF4B91]">{total - score}</div>
              </div>
            </div>
          </HologramPanel>
        </motion.div>

        {/* Glitch confetti effect */}
        {rating.grade === 'S' && (
          <div className="fixed inset-0 pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  backgroundColor: ['#4EE1FF', '#FF4B91', '#FFD059'][Math.floor(Math.random() * 3)]
                }}
                animate={{
                  y: [0, -500],
                  opacity: [1, 0],
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 2,
                  delay: Math.random() * 2,
                  repeat: Infinity
                }}
              />
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-col md:flex-row gap-4 justify-center items-center"
        >
          <NeonButton onClick={onHome} variant="cyan" className="flex items-center gap-2">
            <Home className="w-5 h-5" />
            MAIN MENU
          </NeonButton>
          
          <NeonButton onClick={onRetry} variant="yellow" className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            RETRY MISSION
          </NeonButton>
          
          <NeonButton onClick={onNextMission} variant="magenta" className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            NEXT MISSION
          </NeonButton>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center text-xs text-white/40 tracking-wider pt-4"
        >
          █ DATA ARCHIVED █ NEW ERIDU INTELLIGENCE NETWORK █
        </motion.div>
      </div>
    </div>
  );
}