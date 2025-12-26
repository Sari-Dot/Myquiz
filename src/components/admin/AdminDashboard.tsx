import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Plus, Edit2, Trash2, Eye, EyeOff, Save, LogOut, Database, CheckCircle, AlertTriangle, XCircle, RefreshCw, Filter } from "lucide-react";
import { projectId, publicAnonKey } from "../../utils/supabase/info";
import { DebugToken } from "./DebugToken";
import { AmberNeonButton, AdminHologramPanel, GlitchText } from "./AdminComponents";

interface Question {
  id: string;
  level: "easy" | "medium" | "hard";
  question: string;
  answers: string[];
  correct: number;
  hint: string;
  created_at: number;
  updated_at: number;
}

interface AdminDashboardProps {
  token: string;
  username: string;
  onLogout: () => void;
}

export function AdminDashboard({ token, username, onLogout }: AdminDashboardProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredLevel, setFilteredLevel] = useState<"all" | "easy" | "medium" | "hard">("all");
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Log token on mount
  console.log("AdminDashboard mounted with token:", token);
  console.log("AdminDashboard username:", username);

  // Fetch questions
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const url = filteredLevel === "all"
        ? `https://${projectId}.supabase.co/functions/v1/make-server-99be6423/questions`
        : `https://${projectId}.supabase.co/functions/v1/make-server-99be6423/questions?level=${filteredLevel}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setQuestions(data.questions);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      showNotification("error", "Failed to fetch questions");
    } finally {
      setLoading(false);
    }
  };

  // Seed initial data
  const handleSeed = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-99be6423/admin/seed`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        showNotification("success", data.message);
        fetchQuestions();
      } else {
        showNotification("error", data.error);
      }
    } catch (error) {
      console.error("Error seeding:", error);
      showNotification("error", "Failed to seed data");
    }
  };

  // Delete question
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-99be6423/questions/${id}`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${publicAnonKey}`,
            "X-Admin-Token": token,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        showNotification("success", "Question deleted successfully");
        fetchQuestions();
      } else {
        showNotification("error", data.error);
      }
    } catch (error) {
      console.error("Error deleting question:", error);
      showNotification("error", "Failed to delete question");
    } finally {
      setDeleteConfirm(null);
    }
  };

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    fetchQuestions();
  }, [filteredLevel]);

  const levelColors = {
    easy: { color: "#4EE1FF", label: "EASY" },
    medium: { color: "#FFD059", label: "MEDIUM" },
    hard: { color: "#FF4B91", label: "HARD" },
  };

  const stats = {
    total: questions.length,
    easy: questions.filter((q) => q.level === "easy").length,
    medium: questions.filter((q) => q.level === "medium").length,
    hard: questions.filter((q) => q.level === "hard").length,
  };

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <GlitchText className="text-4xl text-[#FF8C42]">
              PANEL KONTROL ADMIN
            </GlitchText>
            <div className="text-sm text-white/60 tracking-wider">
              TEROTORISASI: {username.toUpperCase()} | IZIN AKSES: PENUH
            </div>
          </div>

          <AmberNeonButton onClick={onLogout} variant="secondary">
            <div className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              KELUAR
            </div>
          </AmberNeonButton>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "TOTAL PERTANYAAN", value: stats.total, color: "#FF8C42", icon: Database },
          { label: "MUDAH", value: stats.easy, color: "#4EE1FF", icon: CheckCircle },
          { label: "SEDANG", value: stats.medium, color: "#FFD059", icon: AlertTriangle },
          { label: "SULIT", value: stats.hard, color: "#FF4B91", icon: XCircle },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative border-2 p-6 backdrop-blur-md"
            style={{
              borderColor: stat.color,
              backgroundColor: `${stat.color}10`,
              boxShadow: `0 0 20px ${stat.color}40`,
            }}
          >
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2" style={{ borderColor: stat.color }} />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2" style={{ borderColor: stat.color }} />
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-white/60 tracking-wider">{stat.label}</div>
                <div className="text-3xl mt-2" style={{ color: stat.color }}>
                  {stat.value}
                </div>
              </div>
              <stat.icon className="w-8 h-8" style={{ color: stat.color }} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Actions bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-6 flex flex-wrap gap-4 items-center"
      >
        <AmberNeonButton onClick={() => setShowAddModal(true)}>
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            TAMBAH PERTANYAAN
          </div>
        </AmberNeonButton>

        <AmberNeonButton onClick={handleSeed} variant="secondary">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            ISI DATA AWAL
          </div>
        </AmberNeonButton>

        <AmberNeonButton onClick={fetchQuestions} variant="secondary">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            PERBARUI
          </div>
        </AmberNeonButton>

        {/* Level filter */}
        <div className="flex items-center gap-2 ml-auto">
          <Filter className="w-4 h-4 text-[#FF8C42]" />
          <select
            value={filteredLevel}
            onChange={(e) => setFilteredLevel(e.target.value as any)}
            className="bg-black/50 border-2 border-[#FF8C42]/30 px-4 py-2 text-white focus:border-[#FF8C42] focus:outline-none"
          >
            <option value="all">SEMUA LEVEL</option>
            <option value="easy">MUDAH</option>
            <option value="medium">SEDANG</option>
            <option value="hard">SULIT</option>
          </select>
        </div>
      </motion.div>

      {/* Questions list */}
      <AdminHologramPanel>
        {loading ? (
          <div className="text-center py-12 text-[#FF8C42]">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
            MEMUAT PERTANYAAN...
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-12 text-white/60">
            <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <div className="text-lg">TIDAK ADA PERTANYAAN</div>
            <div className="text-sm mt-2">Klik "TAMBAH PERTANYAAN" atau "ISI DATA AWAL" untuk memulai</div>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((question, index) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative border-2 p-6 backdrop-blur-sm"
                style={{
                  borderColor: levelColors[question.level].color,
                  backgroundColor: `${levelColors[question.level].color}10`,
                }}
              >
                {/* Corner brackets */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2" style={{ borderColor: levelColors[question.level].color }} />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2" style={{ borderColor: levelColors[question.level].color }} />

                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    {/* Level badge */}
                    <div
                      className="inline-block px-3 py-1 text-xs tracking-wider"
                      style={{
                        borderLeft: `3px solid ${levelColors[question.level].color}`,
                        color: levelColors[question.level].color,
                        backgroundColor: `${levelColors[question.level].color}20`,
                      }}
                    >
                      {levelColors[question.level].label}
                    </div>

                    {/* Question */}
                    <div className="text-lg text-white">{question.question}</div>

                    {/* Answers */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {question.answers.map((answer, i) => (
                        <div
                          key={i}
                          className={`p-2 border ${
                            i === question.correct
                              ? "border-[#4EE1FF] text-[#4EE1FF] bg-[#4EE1FF]/10"
                              : "border-white/20 text-white/60"
                          }`}
                        >
                          {i === question.correct && "✓ "}
                          {answer}
                        </div>
                      ))}
                    </div>

                    {/* Hint */}
                    <div className="text-xs text-white/40 italic">
                      Hint: {question.hint}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setEditingQuestion(question)}
                      className="p-2 border-2 border-[#FFD059] text-[#FFD059] hover:bg-[#FFD059]/10 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(question.id)}
                      className="p-2 border-2 border-red-500 text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AdminHologramPanel>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {(showAddModal || editingQuestion) && (
          <QuestionModal
            token={token}
            question={editingQuestion}
            onClose={() => {
              setShowAddModal(false);
              setEditingQuestion(null);
            }}
            onSuccess={() => {
              setShowAddModal(false);
              setEditingQuestion(null);
              fetchQuestions();
              showNotification("success", editingQuestion ? "Pertanyaan berhasil diperbarui" : "Pertanyaan berhasil ditambahkan");
            }}
            onError={(msg) => showNotification("error", msg)}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md w-full mx-4"
            >
              <AdminHologramPanel>
                <div className="space-y-6">
                  <div className="text-center">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl text-red-500">KONFIRMASI PENGHAPUSAN</h3>
                    <p className="text-white/60 mt-2">
                      Tindakan ini tidak dapat dibatalkan. Apakah Anda yakin?
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <AmberNeonButton
                      onClick={() => handleDelete(deleteConfirm)}
                      variant="danger"
                      fullWidth
                    >
                      HAPUS
                    </AmberNeonButton>
                    <AmberNeonButton
                      onClick={() => setDeleteConfirm(null)}
                      variant="secondary"
                      fullWidth
                    >
                      BATAL
                    </AmberNeonButton>
                  </div>
                </div>
              </AdminHologramPanel>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-8 right-8 z-50"
          >
            <div
              className={`p-4 border-2 backdrop-blur-md ${
                notification.type === "success"
                  ? "border-[#4EE1FF] bg-[#4EE1FF]/10"
                  : "border-red-500 bg-red-500/10"
              }`}
            >
              <div className="flex items-center gap-3">
                {notification.type === "success" ? (
                  <CheckCircle className="w-5 h-5 text-[#4EE1FF]" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <span className={notification.type === "success" ? "text-[#4EE1FF]" : "text-red-500"}>
                  {notification.message}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Debug Token Component */}
      <DebugToken />
    </div>
  );
}

// Question Modal Component
function QuestionModal({
  token,
  question,
  onClose,
  onSuccess,
  onError,
}: {
  token: string;
  question: Question | null;
  onClose: () => void;
  onSuccess: () => void;
  onError: (msg: string) => void;
}) {
  const [level, setLevel] = useState(question?.level || "easy");
  const [questionText, setQuestionText] = useState(question?.question || "");
  const [answers, setAnswers] = useState(question?.answers || ["", "", "", ""]);
  const [correct, setCorrect] = useState(question?.correct || 0);
  const [hint, setHint] = useState(question?.hint || "");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Validate all answers are filled
      const emptyAnswers = answers.filter(a => !a.trim());
      if (emptyAnswers.length > 0) {
        onError("All 4 answers must be filled");
        setSaving(false);
        return;
      }

      // Validate question and hint
      if (!questionText.trim()) {
        onError("Question text is required");
        setSaving(false);
        return;
      }

      if (!hint.trim()) {
        onError("Hint is required");
        setSaving(false);
        return;
      }

      const url = question
        ? `https://${projectId}.supabase.co/functions/v1/make-server-99be6423/questions/${question.id}`
        : `https://${projectId}.supabase.co/functions/v1/make-server-99be6423/questions`;

      console.log("[QuestionModal] Sending request to:", url);
      console.log("[QuestionModal] Token received as prop:", token);
      console.log("[QuestionModal] Token length:", token?.length);
      console.log("[QuestionModal] Using X-Admin-Token header:", token);
      console.log("[QuestionModal] Using Authorization with publicAnonKey");
      console.log("[QuestionModal] Request body:", {
        level,
        question: questionText,
        answers,
        correct,
        hint,
      });

      const response = await fetch(url, {
        method: question ? "PUT" : "POST",
        headers: {
          "Authorization": `Bearer ${publicAnonKey}`,
          "X-Admin-Token": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          level,
          question: questionText,
          answers,
          correct,
          hint,
        }),
      });

      console.log("[QuestionModal] Response status:", response.status);
      const data = await response.json();
      console.log("[QuestionModal] Response data:", data);

      if (data.success) {
        onSuccess();
      } else {
        onError(data.error || "Failed to save question");
      }
    } catch (error) {
      console.error("Error saving question:", error);
      onError(`Failed to save question: ${error.message || "Unknown error"}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm overflow-y-auto p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="max-w-2xl w-full my-8"
      >
        <AdminHologramPanel>
          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-2xl text-[#FF8C42] tracking-wider">
              {question ? "EDIT PERTANYAAN" : "TAMBAH PERTANYAAN BARU"}
            </h3>

            {/* Level */}
            <div className="space-y-2">
              <label className="text-sm text-[#FF8C42] tracking-wider">TINGKAT KESULITAN</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
                className="w-full bg-black/50 border-2 border-[#FF8C42]/30 px-4 py-3 text-white focus:border-[#FF8C42] focus:outline-none"
                required
              >
                <option value="easy">MUDAH</option>
                <option value="medium">SEDANG</option>
                <option value="hard">SULIT</option>
              </select>
            </div>

            {/* Question */}
            <div className="space-y-2">
              <label className="text-sm text-[#FF8C42] tracking-wider">PERTANYAAN</label>
              <textarea
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                className="w-full bg-black/50 border-2 border-[#FF8C42]/30 px-4 py-3 text-white focus:border-[#FF8C42] focus:outline-none min-h-[80px]"
                required
              />
            </div>

            {/* Answers */}
            <div className="space-y-2">
              <label className="text-sm text-[#FF8C42] tracking-wider">PILIHAN JAWABAN (4 OPSI)</label>
              <div className="space-y-2">
                {answers.map((answer, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="radio"
                      name="correct"
                      checked={correct === i}
                      onChange={() => setCorrect(i)}
                      className="mt-4"
                    />
                    <input
                      type="text"
                      value={answer}
                      onChange={(e) => {
                        const newAnswers = [...answers];
                        newAnswers[i] = e.target.value;
                        setAnswers(newAnswers);
                      }}
                      placeholder={`Jawaban ${i + 1}`}
                      className="flex-1 bg-black/50 border-2 border-[#FF8C42]/30 px-4 py-3 text-white focus:border-[#FF8C42] focus:outline-none"
                      required
                    />
                  </div>
                ))}
              </div>
              <div className="text-xs text-white/40">Pilih jawaban yang benar dengan tombol radio</div>
            </div>

            {/* Hint */}
            <div className="space-y-2">
              <label className="text-sm text-[#FF8C42] tracking-wider">PETUNJUK</label>
              <textarea
                value={hint}
                onChange={(e) => setHint(e.target.value)}
                className="w-full bg-black/50 border-2 border-[#FF8C42]/30 px-4 py-3 text-white focus:border-[#FF8C42] focus:outline-none min-h-[60px]"
                required
              />
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <AmberNeonButton type="submit" disabled={saving} fullWidth>
                {saving ? "MENYIMPAN..." : question ? "PERBARUI" : "BUAT"}
              </AmberNeonButton>
              <AmberNeonButton type="button" onClick={onClose} variant="secondary" fullWidth>
                BATAL
              </AmberNeonButton>
            </div>
          </form>
        </AdminHologramPanel>
      </motion.div>
    </motion.div>
  );
}