import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createHash } from "node:crypto";
import { Buffer } from "node:buffer";

const app = new Hono();

// In-memory session storage (fallback if KV fails)
const sessionStore = new Map<string, { username: string; expiresAt: number }>();

// =============== GLOBAL REQUEST INTERCEPTOR ===============
// Log EVERY request that hits the server
app.use('*', async (c, next) => {
  const method = c.req.method;
  const url = c.req.url;
  const path = new URL(url).pathname;
  const authHeader = c.req.header("Authorization");
  
  console.log("╔═══════════════════════════════════════════");
  console.log("║ [REQUEST MASUK]");
  console.log("║ Method:", method);
  console.log("║ Path:", path);
  console.log("║ Header Auth:", authHeader ? `Bearer ${authHeader.substring(7, 27)}...` : "TIDAK ADA");
  console.log("╚═══════════════════════════════════════════");
  
  try {
    await next();
    console.log("✅ [REQUEST SELESAI]", method, path, "- Status:", c.res.status);
  } catch (err) {
    console.error("❌ [REQUEST ERROR]", method, path, "- Error:", err);
    throw err;
  }
});

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "X-Admin-Token"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Helper functions
function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

function generateToken(): string {
  return createHash('sha256').update(Date.now() + Math.random().toString()).digest('hex');
}

// Generate signed JWT-like token (self-contained) - SIMPLE VERSION
function generateSignedToken(username: string): string {
  const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
  const payload = `${username}:${expiresAt}`;
  const signature = createHash('sha256').update(payload + ':SECRET_KEY_ZZZ_2024').digest('hex');
  
  // Format: username:timestamp:signature (simple, no base64)
  const token = `${payload}:${signature}`;
  console.log("[generateSignedToken] Token dibuat:", token);
  return token;
}

// Verify signed token - SIMPLE VERSION
function verifySignedToken(token: string): { username: string; expiresAt: number } | null {
  try {
    console.log("[verifySignedToken] Verifikasi token:", token);
    
    const parts = token.split(':');
    console.log("[verifySignedToken] Jumlah bagian token:", parts.length);
    
    if (parts.length !== 3) {
      console.log("[verifySignedToken] Format token salah - butuh 3 bagian (username:timestamp:signature)");
      return null;
    }
    
    const [username, expiresAtStr, signature] = parts;
    const expiresAt = parseInt(expiresAtStr);
    
    console.log("[verifySignedToken] Username:", username);
    console.log("[verifySignedToken] Kadaluarsa di:", expiresAt);
    console.log("[verifySignedToken] Signature:", signature);
    
    // Verify signature
    const payload = `${username}:${expiresAtStr}`;
    const expectedSignature = createHash('sha256').update(payload + ':SECRET_KEY_ZZZ_2024').digest('hex');
    console.log("[verifySignedToken] Signature yang diharapkan:", expectedSignature);
    console.log("[verifySignedToken] Signature cocok:", signature === expectedSignature);
    
    if (signature !== expectedSignature) {
      console.log("[verifySignedToken] Signature tidak cocok!");
      return null;
    }
    
    // Check expiration
    if (expiresAt < Date.now()) {
      console.log("[verifySignedToken] Token sudah kadaluarsa");
      return null;
    }
    
    console.log("[verifySignedToken] Token valid!");
    return { username, expiresAt };
  } catch (error) {
    console.error("[verifySignedToken] Error:", error);
    return null;
  }
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Middleware to verify admin token
async function verifyAdmin(token: string | null): Promise<string | null> {
  console.log("[verifyAdmin] Mengecek token:", token);
  
  if (!token) {
    console.log("[verifyAdmin] Token tidak diberikan");
    return null;
  }
  
  // Try to verify as a signed token first (new method - format: username:timestamp:signature)
  if (token.includes(':')) {
    console.log("[verifyAdmin] Mencoba verifikasi signed token");
    const payload = verifySignedToken(token);
    if (payload) {
      console.log("[verifyAdmin] Signed token valid, username:", payload.username);
      return payload.username;
    }
    console.log("[verifyAdmin] Verifikasi signed token gagal");
  }
  
  // Fallback: Check in-memory store (legacy method)
  const memorySession = sessionStore.get(token);
  if (memorySession) {
    console.log("[verifyAdmin] Ditemukan di memory store");
    if (memorySession.expiresAt < Date.now()) {
      console.log("[verifyAdmin] Sesi memory sudah kadaluarsa");
      sessionStore.delete(token);
      return null;
    }
    console.log("[verifyAdmin] Sesi memory valid, username:", memorySession.username);
    return memorySession.username;
  }
  
  // Fallback: Check KV store (legacy method - may have been lost due to cold start)
  const sessionKey = `admin:session:${token}`;
  console.log("[verifyAdmin] Tidak di memory, mengecek KV:", sessionKey);
  
  try {
    const session = await kv.get(sessionKey);
    console.log("[verifyAdmin] Sesi KV ditemukan:", session ? "YA" : "TIDAK");
    
    if (!session) {
      console.log("[verifyAdmin] Sesi tidak ditemukan di mana pun - token tidak valid");
      return null;
    }
    
    const sessionData = JSON.parse(session);
    console.log("[verifyAdmin] Data sesi KV:", sessionData);
    
    if (sessionData.expiresAt < Date.now()) {
      console.log("[verifyAdmin] Sesi KV sudah kadaluarsa");
      await kv.del(sessionKey);
      return null;
    }
    
    // Restore to memory for faster subsequent checks
    console.log("[verifyAdmin] Memulihkan sesi ke memory dari KV");
    sessionStore.set(token, sessionData);
    
    console.log("[verifyAdmin] Sesi KV valid, username:", sessionData.username);
    return sessionData.username;
  } catch (error) {
    console.error("[verifyAdmin] Error mengecek KV:", error);
    return null;
  }
}

// Helper: Extract admin token from request (supports both Authorization and X-Admin-Token)
function getAdminToken(c: any): string | null {
  // First, try X-Admin-Token header (preferred for admin operations)
  const adminToken = c.req.header("X-Admin-Token");
  if (adminToken) {
    console.log("[getAdminToken] Token dari X-Admin-Token header");
    return adminToken;
  }
  
  // Fallback: Try Authorization header (but only if it's not the publicAnonKey)
  const authHeader = c.req.header("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.replace("Bearer ", "");
    // Only accept if it looks like our admin token (contains colons)
    if (token.includes(':')) {
      console.log("[getAdminToken] Token dari Authorization header");
      return token;
    }
  }
  
  console.log("[getAdminToken] Token tidak ditemukan");
  return null;
}

// Health check endpoint
app.get("/make-server-99be6423/health", (c) => {
  return c.json({ status: "ok" });
});

// DEBUG ENDPOINT - Test token verification
app.post("/make-server-99be6423/debug/verify-token", async (c) => {
  try {
    const { token } = await c.req.json();
    
    const result = {
      token,
      tokenLength: token?.length || 0,
      hasColon: token?.includes(':') || false,
      parts: token?.split(':') || [],
      partsCount: token?.split(':').length || 0,
      verification: null as any,
      timestamp: Date.now()
    };
    
    if (token) {
      const verified = verifySignedToken(token);
      result.verification = verified ? { username: verified.username, expiresAt: verified.expiresAt, isExpired: verified.expiresAt < Date.now() } : "FAILED";
    }
    
    return c.json({ success: true, debug: result });
  } catch (error) {
    return c.json({ success: false, error: error.message });
  }
});

// ==================== ADMIN AUTH ENDPOINTS ====================

// Initialize default admin (username: admin, password: admin123)
app.post("/make-server-99be6423/admin/init", async (c) => {
  const existingAdmin = await kv.get("admin:user:admin");
  
  if (!existingAdmin) {
    const adminData = {
      username: "admin",
      passwordHash: hashPassword("admin123"),
      createdAt: Date.now()
    };
    
    await kv.set("admin:user:admin", JSON.stringify(adminData));
    return c.json({ success: true, message: "Default admin created" });
  }
  
  return c.json({ success: true, message: "Admin already exists" });
});

// Admin login
app.post("/make-server-99be6423/admin/login", async (c) => {
  try {
    const { username, password } = await c.req.json();
    console.log("[LOGIN] Attempt with username:", username);
    
    if (!username || !password) {
      return c.json({ success: false, error: "Username and password required" }, 400);
    }
    
    const adminKey = `admin:user:${username}`;
    console.log("[LOGIN] Looking for admin key:", adminKey);
    
    const adminData = await kv.get(adminKey);
    console.log("[LOGIN] Admin data found:", adminData ? "YES" : "NO");
    
    if (!adminData) {
      return c.json({ success: false, error: "Invalid credentials" }, 401);
    }
    
    const admin = JSON.parse(adminData);
    const passwordHash = hashPassword(password);
    
    console.log("[LOGIN] Password hash match:", admin.passwordHash === passwordHash);
    
    if (admin.passwordHash !== passwordHash) {
      return c.json({ success: false, error: "Invalid credentials" }, 401);
    }
    
    // Create self-contained signed token (no database lookup needed)
    const token = generateSignedToken(admin.username);
    console.log("[LOGIN] Generated signed token");
    
    return c.json({ 
      success: true, 
      token,
      username: admin.username
    });
  } catch (error) {
    console.error("[LOGIN] Error:", error);
    return c.json({ success: false, error: "Login failed" }, 500);
  }
});

// Verify admin session
app.get("/make-server-99be6423/admin/verify", async (c) => {
  const token = getAdminToken(c);
  const username = await verifyAdmin(token);
  
  if (!username) {
    return c.json({ success: false, error: "Invalid session" }, 401);
  }
  
  return c.json({ success: true, username });
});

// Admin logout
app.post("/make-server-99be6423/admin/logout", async (c) => {
  const token = c.req.header("Authorization")?.replace("Bearer ", "");
  
  if (token) {
    await kv.del(`admin:session:${token}`);
  }
  
  return c.json({ success: true });
});

// ==================== QUESTION CRUD ENDPOINTS ====================

// Get all questions (with optional level filter)
app.get("/make-server-99be6423/questions", async (c) => {
  try {
    const level = c.req.query("level");
    
    let questions = [];
    
    if (level) {
      // Get questions for specific level
      const keys = await kv.getByPrefix(`question:${level}:`);
      questions = keys.map((q: string) => JSON.parse(q));
    } else {
      // Get all questions
      const allKeys = await kv.getByPrefix("question:");
      questions = allKeys.map((q: string) => JSON.parse(q));
    }
    
    // Sort by created_at descending
    questions.sort((a, b) => b.created_at - a.created_at);
    
    return c.json({ success: true, questions });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return c.json({ success: false, error: "Failed to fetch questions" }, 500);
  }
});

// Get single question
app.get("/make-server-99be6423/questions/:id", async (c) => {
  try {
    const id = c.req.param("id");
    
    // Try to find in all levels
    for (const level of ["easy", "medium", "hard"]) {
      const questionData = await kv.get(`question:${level}:${id}`);
      if (questionData) {
        return c.json({ success: true, question: JSON.parse(questionData) });
      }
    }
    
    return c.json({ success: false, error: "Question not found" }, 404);
  } catch (error) {
    console.error("Error fetching question:", error);
    return c.json({ success: false, error: "Failed to fetch question" }, 500);
  }
});

// Create question (protected)
app.post("/make-server-99be6423/questions", async (c) => {
  try {
    const token = getAdminToken(c);
    console.log("[POST /questions] Token extracted:", token);
    console.log("[POST /questions] Token length:", token?.length);
    console.log("[POST /questions] Token includes colon:", token?.includes(':'));
    
    const username = await verifyAdmin(token);
    console.log("[POST /questions] Verification result - username:", username);
    
    if (!username) {
      console.log("[POST /questions] Admin verification failed - returning 401");
      return c.json({ success: false, error: "Unauthorized - Invalid or expired admin session", code: 401, message: "Invalid JWT" }, 401);
    }
    
    const body = await c.req.json();
    console.log("[POST /questions] Request body:", body);
    const { level, question, answers, correct, hint } = body;
    
    // Validation
    if (!level || !["easy", "medium", "hard"].includes(level)) {
      return c.json({ success: false, error: "Invalid level" }, 400);
    }
    
    if (!question || !answers || answers.length !== 4 || correct === undefined || !hint) {
      return c.json({ success: false, error: "Invalid question data" }, 400);
    }
    
    if (correct < 0 || correct > 3) {
      return c.json({ success: false, error: "Correct answer must be 0-3" }, 400);
    }
    
    const id = generateId();
    const questionData = {
      id,
      level,
      question,
      answers,
      correct,
      hint,
      created_at: Date.now(),
      updated_at: Date.now()
    };
    
    console.log("Creating question with ID:", id);
    await kv.set(`question:${level}:${id}`, JSON.stringify(questionData));
    console.log("Question created successfully");
    
    return c.json({ success: true, question: questionData });
  } catch (error) {
    console.error("Error creating question:", error);
    return c.json({ success: false, error: `Failed to create question: ${error.message}` }, 500);
  }
});

// Update question (protected)
app.put("/make-server-99be6423/questions/:id", async (c) => {
  try {
    const token = getAdminToken(c);
    const username = await verifyAdmin(token);
    
    if (!username) {
      return c.json({ success: false, error: "Unauthorized" }, 401);
    }
    
    const id = c.req.param("id");
    const { level, question, answers, correct, hint } = await c.req.json();
    
    // Validation
    if (!level || !["easy", "medium", "hard"].includes(level)) {
      return c.json({ success: false, error: "Invalid level" }, 400);
    }
    
    if (!question || !answers || answers.length !== 4 || correct === undefined || !hint) {
      return c.json({ success: false, error: "Invalid question data" }, 400);
    }
    
    if (correct < 0 || correct > 3) {
      return c.json({ success: false, error: "Correct answer must be 0-3" }, 400);
    }
    
    // Find and delete old question (might be in different level)
    let oldQuestionData = null;
    for (const lvl of ["easy", "medium", "hard"]) {
      const data = await kv.get(`question:${lvl}:${id}`);
      if (data) {
        oldQuestionData = JSON.parse(data);
        await kv.del(`question:${lvl}:${id}`);
        break;
      }
    }
    
    if (!oldQuestionData) {
      return c.json({ success: false, error: "Question not found" }, 404);
    }
    
    // Create updated question
    const questionData = {
      id,
      level,
      question,
      answers,
      correct,
      hint,
      created_at: oldQuestionData.created_at,
      updated_at: Date.now()
    };
    
    await kv.set(`question:${level}:${id}`, JSON.stringify(questionData));
    
    return c.json({ success: true, question: questionData });
  } catch (error) {
    console.error("Error updating question:", error);
    return c.json({ success: false, error: "Failed to update question" }, 500);
  }
});

// Delete question (protected)
app.delete("/make-server-99be6423/questions/:id", async (c) => {
  try {
    const token = getAdminToken(c);
    const username = await verifyAdmin(token);
    
    if (!username) {
      return c.json({ success: false, error: "Unauthorized" }, 401);
    }
    
    const id = c.req.param("id");
    
    // Find and delete question
    let deleted = false;
    for (const level of ["easy", "medium", "hard"]) {
      const questionData = await kv.get(`question:${level}:${id}`);
      if (questionData) {
        await kv.del(`question:${level}:${id}`);
        deleted = true;
        break;
      }
    }
    
    if (!deleted) {
      return c.json({ success: false, error: "Question not found" }, 404);
    }
    
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting question:", error);
    return c.json({ success: false, error: "Failed to delete question" }, 500);
  }
});

// ==================== SEED DATA ENDPOINT ====================

// Seed initial questions (for development)
app.post("/make-server-99be6423/admin/seed", async (c) => {
  try {
    const token = getAdminToken(c);
    const username = await verifyAdmin(token);
    
    if (!username) {
      return c.json({ success: false, error: "Unauthorized" }, 401);
    }
    
    const seedQuestions = [
      // Easy questions
      { level: "easy", question: "Hitung 12 × 8", answers: ["84", "96", "102", "88"], correct: 1, hint: "Pikirkan 12 kali 8. Pecah menjadi: 10×8 + 2×8." },
      { level: "easy", question: "Berapa 45 + 37?", answers: ["82", "81", "83", "80"], correct: 0, hint: "Tambahkan puluhan dulu: 40+30=70, lalu 5+7=12." },
      { level: "easy", question: "Berapa 144 ÷ 12?", answers: ["11", "13", "12", "14"], correct: 2, hint: "Berapa banyak 12 dalam 144? Pikirkan 12×12." },
      { level: "easy", question: "Berapa 7 × 9?", answers: ["54", "56", "63", "72"], correct: 2, hint: "7×9 mendekati 7×10. Kurangi 7 dari 70." },
      { level: "easy", question: "Berapa 100 - 47?", answers: ["53", "57", "52", "54"], correct: 0, hint: "100 dikurangi 50 adalah 50. Tambahkan 3 karena kita kurangi 3 terlalu banyak." },
      // Medium questions
      { level: "medium", question: "Berapa 17²?", answers: ["279", "289", "299", "309"], correct: 1, hint: "Gunakan (a+b)²: 17² = (20-3)² = 400 - 120 + 9." },
      { level: "medium", question: "Selesaikan: 3x + 7 = 22", answers: ["x = 4", "x = 5", "x = 6", "x = 7"], correct: 1, hint: "Kurangi 7 dari kedua sisi terlebih dahulu, lalu bagi dengan 3." },
      { level: "medium", question: "Berapa √225?", answers: ["13", "14", "15", "16"], correct: 2, hint: "Pikirkan bilangan kuadrat sempurna: 15×15 = 225." },
      // Hard questions
      { level: "hard", question: "Evaluasi: lim(x→0) sin(x)/x", answers: ["0", "1", "∞", "tak terdefinisi"], correct: 1, hint: "Ini adalah limit standar. Perilaku fungsi sinus mendekati nol adalah kuncinya." },
      { level: "hard", question: "Berapa ∫x² dx?", answers: ["x³/3 + C", "x³ + C", "2x + C", "x²/2 + C"], correct: 0, hint: "Aturan pangkat: naikkan pangkat 1, bagi dengan pangkat baru." },
    ];
    
    let seeded = 0;
    for (const q of seedQuestions) {
      const id = generateId();
      const questionData = {
        id,
        ...q,
        created_at: Date.now(),
        updated_at: Date.now()
      };
      await kv.set(`question:${q.level}:${id}`, JSON.stringify(questionData));
      seeded++;
    }
    
    return c.json({ success: true, message: `Seeded ${seeded} questions` });
  } catch (error) {
    console.error("Error seeding questions:", error);
    return c.json({ success: false, error: "Failed to seed questions" }, 500);
  }
});

Deno.serve(app.fetch);