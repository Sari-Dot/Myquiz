import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HologramPanel } from "./HologramPanel";
import { NeonButton } from "./NeonButton";
import { HintPanel } from "./HintPanel";
import { ArrowLeft, Zap, AlertTriangle, Eye, XCircle } from "lucide-react";
import { useQuestions } from "../hooks/useQuestions";

interface Question {
  id?: string;
  question: string;
  answers: string[];
  correct: number;
  hint: string;
}

interface QuizScreenProps {
  level: "easy" | "medium" | "hard";
  onComplete: (score: number, total: number, time: number, hintUsed: boolean) => void;
  onBack: () => void;
}

export function QuizScreen({ level, onComplete, onBack }: QuizScreenProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [startTime] = useState(Date.now());
  const [hintUsed, setHintUsed] = useState(false);
  const [showHintPanel, setShowHintPanel] = useState(false);
  
  // Fetch questions from database
  const { questions: dbQuestions, loading } = useQuestions(level);
  
  // Use database questions if available, otherwise fallback to hardcoded
  const quizData = {
    easy: [
      { question: "Hitung 12 × 8", answers: ["84", "96", "102", "88"], correct: 1, hint: "Pikirkan 12 kali 8. Pecah menjadi: 10×8 + 2×8." },
      { question: "Berapa 45 + 37?", answers: ["82", "81", "83", "80"], correct: 0, hint: "Tambahkan puluhan dulu: 40+30=70, lalu 5+7=12." },
      { question: "Berapa 144 ÷ 12?", answers: ["11", "13", "12", "14"], correct: 2, hint: "Berapa banyak 12 dalam 144? Pikirkan 12×12." },
      { question: "Berapa 7 × 9?", answers: ["54", "56", "63", "72"], correct: 2, hint: "7×9 mendekati 7×10. Kurangi 7 dari 70." },
      { question: "Berapa 100 - 47?", answers: ["53", "57", "52", "54"], correct: 0, hint: "100 dikurangi 50 adalah 50. Tambahkan 3 karena kita kurangi 3 terlalu banyak." },
      { question: "Berapa 15 × 6?", answers: ["80", "85", "90", "95"], correct: 2, hint: "15×6 = (10+5)×6. Hitung 10×6 dan 5×6 terpisah." },
      { question: "Berapa 256 ÷ 8?", answers: ["30", "32", "34", "36"], correct: 1, hint: "256 adalah 2⁸. Dibagi 8 menghasilkan 2⁵." },
      { question: "Berapa 18 + 29?", answers: ["46", "47", "48", "49"], correct: 1, hint: "Bulatkan 29 jadi 30, tambahkan ke 18, lalu kurangi 1." },
      { question: "Berapa 11 × 11?", answers: ["111", "121", "131", "141"], correct: 1, hint: "11 kuadrat. Pikirkan (10+1)×(10+1)." },
      { question: "Berapa 200 - 89?", answers: ["109", "110", "111", "112"], correct: 2, hint: "200 - 90 = 110, lalu tambahkan 1." }
    ],
    medium: [
      { question: "Berapa 17²?", answers: ["279", "289", "299", "309"], correct: 1, hint: "Gunakan (a+b)²: 17² = (20-3)² = 400 - 120 + 9." },
      { question: "Selesaikan: 3x + 7 = 22", answers: ["x = 4", "x = 5", "x = 6", "x = 7"], correct: 1, hint: "Kurangi 7 dari kedua sisi terlebih dahulu, lalu bagi dengan 3." },
      { question: "Berapa √225?", answers: ["13", "14", "15", "16"], correct: 2, hint: "Pikirkan bilangan kuadrat sempurna: 15×15 = 225." },
      { question: "Berapa 25% dari 360?", answers: ["80", "85", "90", "95"], correct: 2, hint: "25% sama dengan 1/4. Bagi 360 dengan 4." },
      { question: "Selesaikan: 2x - 5 = 15", answers: ["x = 8", "x = 9", "x = 10", "x = 11"], correct: 2, hint: "Tambahkan 5 ke kedua sisi, lalu bagi dengan 2." },
      { question: "Berapa 8³?", answers: ["512", "522", "532", "542"], correct: 0, hint: "8³ = 8×8×8. Hitung dulu 8×8=64." },
      { question: "Berapa 15% dari 200?", answers: ["25", "30", "35", "40"], correct: 1, hint: "10% dari 200 adalah 20. Setengahnya adalah 5%." },
      { question: "Selesaikan: x/4 = 12", answers: ["x = 44", "x = 46", "x = 48", "x = 50"], correct: 2, hint: "Kalikan kedua sisi dengan 4." },
      { question: "Berapa ³√343?", answers: ["5", "6", "7", "8"], correct: 2, hint: "Angka berapa yang dikali dirinya sendiri 3 kali sama dengan 343?" },
      { question: "Berapa 40% dari 250?", answers: ["90", "95", "100", "105"], correct: 2, hint: "40% sama dengan 2/5. Atau gunakan 10% × 4." }
    ],
    hard: [
      { question: "Evaluasi: lim(x→0) sin(x)/x", answers: ["0", "1", "∞", "tak terdefinisi"], correct: 1, hint: "Ini adalah limit standar. Perilaku fungsi sinus mendekati nol adalah kuncinya." },
      { question: "Berapa ∫x² dx?", answers: ["x³/3 + C", "x³ + C", "2x + C", "x²/2 + C"], correct: 0, hint: "Aturan pangkat: naikkan pangkat 1, bagi dengan pangkat baru." },
      { question: "Selesaikan: e^(2x) = 7", answers: ["x = ln(7)/2", "x = ln(14)", "x = 2ln(7)", "x = 7/2"], correct: 0, hint: "Terapkan logaritma natural ke kedua sisi. Ingat ln(e^a) = a." },
      { question: "Berapa d/dx[ln(x)]?", answers: ["x", "1/x", "ln(x)", "e^x"], correct: 1, hint: "Turunan dari logaritma natural berbasis resiprokal." },
      { question: "Evaluasi: ∫₀¹ x dx", answers: ["1/4", "1/3", "1/2", "1"], correct: 2, hint: "Cari antiturunan dulu: x²/2, lalu terapkan batas 0 dan 1." },
      { question: "Berapa determinan dari [[2,3],[4,5]]?", answers: ["-2", "-1", "0", "1"], correct: 0, hint: "Untuk matriks 2×2: ad - bc. Hitung (2×5) - (3×4)." },
      { question: "Selesaikan: log₂(x) = 5", answers: ["x = 10", "x = 25", "x = 32", "x = 64"], correct: 2, hint: "Ubah ke bentuk eksponensial: x = 2⁵." },
      { question: "Berapa i⁴? (dimana i = √-1)", answers: ["-1", "0", "1", "i"], correct: 2, hint: "i² = -1. Jadi i⁴ = (i²)²." },
      { question: "Evaluasi: Σ(k=1 sampai 5) k²", answers: ["45", "50", "55", "60"], correct: 2, hint: "Jumlah kuadrat: 1² + 2² + 3² + 4² + 5². Hitung tiap suku." },
      { question: "Berapa d/dx[e^(3x)]?", answers: ["e^(3x)", "3e^(3x)", "3x·e^(3x)", "e^(3x)/3"], correct: 1, hint: "Aturan rantai: turunan luar dikali turunan dalam. d/dx[e^u] = e^u · du/dx." }
    ]
  };

  const questions = dbQuestions.length > 0 ? dbQuestions : quizData[level];
  const totalQuestions = questions.length;
  const question = questions[currentQuestion];

  const levelConfig = {
    easy: {
      title: "STREET LEVEL MISSION",
      variant: "cyan" as const,
      color: "#4EE1FF",
      icon: Zap
    },
    medium: {
      title: "SECTOR PATROL MISSION",
      variant: "yellow" as const,
      color: "#FFD059",
      icon: Zap
    },
    hard: {
      title: "CRITICAL ZONE OPERATION",
      variant: "magenta" as const,
      color: "#FF4B91",
      icon: AlertTriangle
    }
  };

  const config = levelConfig[level];

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowResult(true);
    
    if (index === question.correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        const totalTime = Math.floor((Date.now() - startTime) / 1000);
        onComplete(score + (index === question.correct ? 1 : 0), totalQuestions, totalTime, hintUsed);
      }
    }, 1500);
  };

  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

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
          <span className="text-sm tracking-wider">ABORT MISSION</span>
        </button>
      </motion.div>

      {/* Hint Button - Top Right */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-8 right-8"
      >
        <motion.button
          onClick={() => {
            if (!hintUsed) {
              setHintUsed(true);
              setShowHintPanel(true);
            }
          }}
          disabled={hintUsed}
          className={`
            relative border-2 px-6 py-3 backdrop-blur-md transition-all
            ${!hintUsed 
              ? 'border-[#4EE1FF] bg-[#4EE1FF]/10 hover:bg-[#4EE1FF]/20 cursor-pointer neon-cyan-glow' 
              : 'border-gray-600 bg-gray-800/50 cursor-not-allowed opacity-50'
            }
          `}
          whileHover={!hintUsed ? { scale: 1.05 } : {}}
          whileTap={!hintUsed ? { scale: 0.95 } : {}}
        >
          {/* Corner brackets */}
          <div 
            className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2"
            style={{ borderColor: !hintUsed ? '#4EE1FF' : '#666' }}
          />
          <div 
            className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2"
            style={{ borderColor: !hintUsed ? '#4EE1FF' : '#666' }}
          />

          {/* Scanlines */}
          <div className="absolute inset-0 scanlines pointer-events-none" />

          <div className="relative z-10 flex items-center gap-3">
            {!hintUsed ? (
              <>
                <Eye className="w-5 h-5 text-[#4EE1FF]" />
                <div className="flex flex-col items-start">
                  <span className="text-xs text-[#4EE1FF]/60 tracking-wider">INTEL ASSIST</span>
                  <span className="text-sm text-[#4EE1FF] tracking-wider">HINT: 1/1</span>
                </div>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-gray-500" />
                <div className="flex flex-col items-start">
                  <span className="text-xs text-gray-500 tracking-wider">INTEL DEPLETED</span>
                  <span className="text-sm text-gray-400 tracking-wider">HINT USED</span>
                </div>
              </>
            )}
          </div>

          {/* Glitch effect when active */}
          {!hintUsed && (
            <motion.div
              className="absolute inset-0 bg-[#4EE1FF]/20 pointer-events-none"
              animate={{
                opacity: [0, 0.3, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
            />
          )}
        </motion.button>
      </motion.div>

      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <config.icon className="w-6 h-6" style={{ color: config.color }} />
            <h2 className="text-2xl tracking-wider" style={{ color: config.color }}>
              {config.title}
            </h2>
            <config.icon className="w-6 h-6" style={{ color: config.color }} />
          </div>
          
          <div className="text-sm text-white/60">
            MISSION {currentQuestion + 1} / {totalQuestions}
          </div>
        </motion.div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="h-2 bg-white/10 overflow-hidden">
            <motion.div
              className="h-full"
              style={{ backgroundColor: config.color }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          
          {/* Progress corners */}
          <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2" style={{ borderColor: config.color }} />
          <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2" style={{ borderColor: config.color }} />
        </div>

        {/* Question Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <HologramPanel 
              variant={config.variant} 
              glitchIntense={level === "hard" && !showResult}
              className="min-h-[300px] flex items-center justify-center"
            >
              <div className="text-center space-y-8">
                {level === "hard" && (
                  <div className="text-xs text-[#FF4B91] tracking-wider flex items-center justify-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    DANGER: HIGH-RISK INTEL DETECTED
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                )}
                
                <h3 className="text-3xl tracking-wide px-8">
                  {question.question}
                </h3>

                {level === "hard" && (
                  <div className="flex justify-center gap-1">
                    {[...Array(15)].map((_, i) => (
                      <div
                        key={i}
                        className="w-0.5 bg-[#FF4B91]/30"
                        style={{ height: `${Math.random() * 10 + 5}px` }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </HologramPanel>
          </motion.div>
        </AnimatePresence>

        {/* Answer Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.answers.map((answer, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => !showResult && handleAnswer(index)}
              disabled={showResult}
              className={`
                relative p-6 border-2 backdrop-blur-sm transition-all duration-300
                ${!showResult ? 'hover:scale-105 cursor-pointer' : 'cursor-not-allowed'}
                ${
                  showResult && index === question.correct
                    ? `border-[#4EE1FF] bg-[#4EE1FF]/20 neon-cyan-glow`
                    : showResult && index === selectedAnswer
                    ? 'border-red-500 bg-red-500/20'
                    : `border-white/30 bg-white/5 hover:border-[${config.color}]`
                }
              `}
              style={
                !showResult && selectedAnswer === null
                  ? { borderColor: `${config.color}40` }
                  : {}
              }
            >
              {/* Corner brackets */}
              <div 
                className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2"
                style={{ borderColor: showResult && index === question.correct ? '#4EE1FF' : config.color }}
              />
              <div 
                className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2"
                style={{ borderColor: showResult && index === question.correct ? '#4EE1FF' : config.color }}
              />

              {/* Scanlines */}
              <div className="absolute inset-0 scanlines pointer-events-none" />

              <div className="relative z-10 text-xl tracking-wide">
                {answer}
              </div>

              {/* Result indicator */}
              {showResult && index === question.correct && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center bg-[#4EE1FF]/10"
                >
                  <div className="text-4xl">✓</div>
                </motion.div>
              )}
              
              {showResult && index === selectedAnswer && index !== question.correct && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center bg-red-500/10"
                >
                  <div className="text-4xl text-red-500">✗</div>
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>

        {/* Energy bar visual */}
        <div className="flex items-center gap-4 pt-4">
          <div className="text-xs text-white/40 tracking-wider">ENERGY:</div>
          <div className="flex-1 flex gap-1">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-2 ${
                  i < Math.ceil((score / (currentQuestion + 1)) * 10)
                    ? 'bg-[#4EE1FF]'
                    : 'bg-white/10'
                }`}
              />
            ))}
          </div>
          <div className="text-xs text-white/40 tracking-wider">
            {Math.round((score / (currentQuestion + 1)) * 100)}%
          </div>
        </div>

        {/* Hint Panel */}
        {showHintPanel && (
          <HintPanel
            hint={question.hint}
            level={level}
            onClose={() => setShowHintPanel(false)}
          />
        )}
      </div>
    </div>
  );
}