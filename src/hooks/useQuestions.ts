import { useState, useEffect } from "react";
import { projectId, publicAnonKey } from "../utils/supabase/info";

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

interface UseQuestionsResult {
  questions: Question[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useQuestions(level?: "easy" | "medium" | "hard"): UseQuestionsResult {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);

    try {
      const url = level
        ? `https://${projectId}.supabase.co/functions/v1/make-server-99be6423/questions?level=${level}`
        : `https://${projectId}.supabase.co/functions/v1/make-server-99be6423/questions`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setQuestions(data.questions);
      } else {
        setError(data.error || "Failed to fetch questions");
      }
    } catch (err) {
      console.error("Error fetching questions:", err);
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();

    // Auto-refresh every 5 seconds to catch admin changes
    const interval = setInterval(fetchQuestions, 5000);

    return () => clearInterval(interval);
  }, [level]);

  return {
    questions,
    loading,
    error,
    refetch: fetchQuestions,
  };
}
