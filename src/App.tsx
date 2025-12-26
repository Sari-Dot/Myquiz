import { useState, useEffect } from "react";
import { CyberBackground } from "./components/CyberBackground";
import { HomeScreen } from "./components/HomeScreen";
import { LevelSelect } from "./components/LevelSelect";
import { QuizScreen } from "./components/QuizScreen";
import { ResultScreen } from "./components/ResultScreen";
import { AdminLogin } from "./components/admin/AdminLogin";
import { AdminDashboard } from "./components/admin/AdminDashboard";

type Screen = "home" | "levelSelect" | "quiz" | "result" | "admin";
type Level = "easy" | "medium" | "hard";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [selectedLevel, setSelectedLevel] = useState<Level>("easy");
  const [quizResult, setQuizResult] = useState({ score: 0, total: 0, time: 0, hintUsed: false });
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [adminUsername, setAdminUsername] = useState<string>("");

  // Check for admin route on mount
  useEffect(() => {
    // Try to restore admin session from localStorage
    const savedToken = localStorage.getItem("adminToken");
    const savedUsername = localStorage.getItem("adminUsername");
    
    if (savedToken && savedUsername) {
      console.log("[App] Restoring admin session from localStorage");
      setAdminToken(savedToken);
      setAdminUsername(savedUsername);
    }

    if (window.location.hash === "#admin") {
      setCurrentScreen("admin");
    }

    // Listen for hash changes
    const handleHashChange = () => {
      if (window.location.hash === "#admin") {
        setCurrentScreen("admin");
      } else if (window.location.hash === "") {
        setCurrentScreen("home");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleStart = () => {
    setCurrentScreen("levelSelect");
  };

  const handleSelectLevel = (level: Level) => {
    setSelectedLevel(level);
    setCurrentScreen("quiz");
  };

  const handleQuizComplete = (score: number, total: number, time: number, hintUsed: boolean) => {
    setQuizResult({ score, total, time, hintUsed });
    setCurrentScreen("result");
  };

  const handleRetry = () => {
    setCurrentScreen("quiz");
  };

  const handleNextMission = () => {
    setCurrentScreen("levelSelect");
  };

  const handleBackToHome = () => {
    setCurrentScreen("home");
    window.location.hash = "";
  };

  const handleBackToLevelSelect = () => {
    setCurrentScreen("levelSelect");
  };

  const handleAdminLogin = (token: string, username: string) => {
    console.log("[App] Admin login successful, saving token to localStorage");
    localStorage.setItem("adminToken", token);
    localStorage.setItem("adminUsername", username);
    setAdminToken(token);
    setAdminUsername(username);
  };

  const handleAdminLogout = () => {
    console.log("[App] Admin logout, clearing localStorage");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUsername");
    setAdminToken(null);
    setAdminUsername("");
    setCurrentScreen("home");
    window.location.hash = "";
  };

  const handleGoToAdmin = () => {
    setCurrentScreen("admin");
    window.location.hash = "admin";
  };

  return (
    <div className="relative min-h-screen bg-[#0A0D14] text-white overflow-hidden">
      <CyberBackground />
      
      <div className="relative z-10">
        {currentScreen === "home" && (
          <HomeScreen onStart={handleStart} onGoToAdmin={handleGoToAdmin} />
        )}
        
        {currentScreen === "levelSelect" && (
          <LevelSelect 
            onSelectLevel={handleSelectLevel}
            onBack={handleBackToHome}
          />
        )}
        
        {currentScreen === "quiz" && (
          <QuizScreen
            level={selectedLevel}
            onComplete={handleQuizComplete}
            onBack={handleBackToLevelSelect}
          />
        )}
        
        {currentScreen === "result" && (
          <ResultScreen
            score={quizResult.score}
            total={quizResult.total}
            time={quizResult.time}
            level={selectedLevel}
            hintUsed={quizResult.hintUsed}
            onRetry={handleRetry}
            onNextMission={handleNextMission}
            onHome={handleBackToHome}
          />
        )}

        {currentScreen === "admin" && !adminToken && (
          <AdminLogin onLoginSuccess={handleAdminLogin} onBack={handleBackToHome} />
        )}

        {currentScreen === "admin" && adminToken && (
          <AdminDashboard
            token={adminToken}
            username={adminUsername}
            onLogout={handleAdminLogout}
          />
        )}
      </div>
    </div>
  );
}