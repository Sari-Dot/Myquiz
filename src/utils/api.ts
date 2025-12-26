// API utility functions for Quiz App
import { projectId, publicAnonKey } from "./supabase/info";

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-99be6423`;

export interface Question {
  id: string;
  level: "easy" | "medium" | "hard";
  question: string;
  answers: string[];
  correct: number;
  hint: string;
  created_at: number;
  updated_at: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Helper function to make API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${publicAnonKey}`,
        ...options.headers,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API call failed:", error);
    return {
      success: false,
      error: "Connection error",
    };
  }
}

// Admin API functions
export const adminApi = {
  // Initialize default admin
  init: () => apiCall("/admin/init", { method: "POST" }),

  // Login
  login: (username: string, password: string) =>
    apiCall<{ token: string; username: string }>("/admin/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  // Verify session
  verify: (token: string) =>
    apiCall<{ username: string }>("/admin/verify", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  // Logout
  logout: (token: string) =>
    apiCall("/admin/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }),

  // Seed data
  seed: (token: string) =>
    apiCall<{ message: string }>("/admin/seed", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }),
};

// Question API functions
export const questionApi = {
  // Get all questions (with optional level filter)
  getAll: (level?: "easy" | "medium" | "hard") => {
    const query = level ? `?level=${level}` : "";
    return apiCall<{ questions: Question[] }>(`/questions${query}`);
  },

  // Get single question
  getById: (id: string) =>
    apiCall<{ question: Question }>(`/questions/${id}`),

  // Create question
  create: (
    token: string,
    data: Omit<Question, "id" | "created_at" | "updated_at">
  ) =>
    apiCall<{ question: Question }>("/questions", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    }),

  // Update question
  update: (
    token: string,
    id: string,
    data: Omit<Question, "id" | "created_at" | "updated_at">
  ) =>
    apiCall<{ question: Question }>(`/questions/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    }),

  // Delete question
  delete: (token: string, id: string) =>
    apiCall(`/questions/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }),
};
