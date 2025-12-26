import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { AdminHologramPanel } from "./AdminHologramPanel";
import { AmberNeonButton } from "./AmberNeonButton";
import { GlitchText } from "../GlitchText";
import { Shield, Lock, User, AlertTriangle, ArrowLeft } from "lucide-react";
import { projectId, publicAnonKey } from "../../utils/supabase/info";

interface AdminLoginProps {
  onLoginSuccess: (token: string, username: string) => void;
  onBack: () => void;
}

export function AdminLogin({ onLoginSuccess, onBack }: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Initialize admin on mount
  useEffect(() => {
    const initAdmin = async () => {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-99be6423/admin/init`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
            },
          }
        );
        const data = await response.json();
        console.log("Admin init:", data);
      } catch (err) {
        console.error("Error initializing admin:", err);
      }
    };

    initAdmin();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Login
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-99be6423/admin/login`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();

      if (data.success) {
        onLoginSuccess(data.token, data.username);
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex justify-center">
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              <Shield className="w-16 h-16 text-[#FF8C42]" />
            </motion.div>
          </div>

          <GlitchText className="text-4xl text-[#FF8C42]">
            ADMIN ACCESS
          </GlitchText>

          <div className="text-sm text-white/60 tracking-wider">
            ZENLESS QUIZ PROTOCOL - RESTRICTED ZONE
          </div>

          {/* Warning bar */}
          <div className="flex items-center justify-center gap-2 text-[#FF8C42] text-xs">
            <AlertTriangle className="w-4 h-4" />
            <span>CLEARANCE LEVEL: ADMINISTRATOR</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
        </motion.div>

        {/* Login form */}
        <AdminHologramPanel>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Username */}
              <div className="space-y-2">
                <label className="text-sm text-[#FF8C42] tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4" />
                  USERNAME
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-black/50 border-2 border-[#FF8C42]/30 px-4 py-3 text-white focus:border-[#FF8C42] focus:outline-none transition-colors"
                    placeholder="Enter username"
                    required
                  />
                  <div className="absolute inset-0 scanlines pointer-events-none opacity-20" />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm text-[#FF8C42] tracking-wider flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  PASSWORD
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/50 border-2 border-[#FF8C42]/30 px-4 py-3 text-white focus:border-[#FF8C42] focus:outline-none transition-colors"
                    placeholder="Enter password"
                    required
                  />
                  <div className="absolute inset-0 scanlines pointer-events-none opacity-20" />
                </div>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 border-2 border-red-500 bg-red-500/10 text-red-400 text-sm"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              </motion.div>
            )}

            {/* Submit button */}
            <AmberNeonButton
              type="submit"
              disabled={loading}
              fullWidth
            >
              {loading ? "AUTHENTICATING..." : "ACCESS SYSTEM"}
            </AmberNeonButton>

            {/* Default credentials hint */}
            <div className="text-xs text-white/40 text-center space-y-1">
              <div>Default credentials:</div>
              <div className="text-[#FF8C42]/60">
                Username: <span className="text-white/60">admin</span> | Password: <span className="text-white/60">admin123</span>
              </div>
            </div>
          </form>
        </AdminHologramPanel>

        {/* Decorative elements */}
        <div className="flex justify-center gap-2">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="w-0.5 bg-[#FF8C42]/30"
              style={{ height: `${Math.random() * 15 + 5}px` }}
              animate={{
                height: [`${Math.random() * 15 + 5}px`, `${Math.random() * 15 + 5}px`],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatDelay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Back button */}
        <div className="text-center mt-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm text-[#FF8C42]/60 hover:text-[#FF8C42] transition-colors tracking-wider mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK TO HOME
          </button>
        </div>
      </div>
    </div>
  );
}