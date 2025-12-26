# 🔧 Technical Documentation - Admin Panel System

## 📐 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐           ┌──────────────┐           │
│  │ Quiz Player  │           │ Admin Panel  │           │
│  │              │           │              │           │
│  │ - QuizScreen │           │ - AdminLogin │           │
│  │ - useQuestions()         │ - AdminDashboard         │
│  │ - Auto-refresh│           │ - CRUD Forms │           │
│  └──────┬───────┘           └──────┬───────┘           │
│         │                          │                    │
│         │      API Requests        │                    │
│         └──────────┬───────────────┘                    │
│                    │                                     │
└────────────────────┼─────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │   Supabase Edge Fn    │
         │  (Hono Web Server)    │
         ├───────────────────────┤
         │ - Auth Endpoints      │
         │ - Question CRUD       │
         │ - Validation Logic    │
         │ - Error Handling      │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │   Supabase KV Store   │
         ├───────────────────────┤
         │ - admin:user:*        │
         │ - admin:session:*     │
         │ - question:{level}:*  │
         └───────────────────────┘
```

---

## 🗄️ Database Schema

### KV Store Key Patterns

#### Admin Users

```
Key: admin:user:{username}
Value: {
  username: string,
  passwordHash: string,
  createdAt: number
}
```

#### Admin Sessions

```
Key: admin:session:{token}
Value: {
  username: string,
  expiresAt: number  // timestamp + 24 hours
}
```

#### Questions

```
Key: question:{level}:{id}
Value: {
  id: string,
  level: "easy" | "medium" | "hard",
  question: string,
  answers: string[],  // length = 4
  correct: number,    // 0-3
  hint: string,
  created_at: number,
  updated_at: number
}
```

---

## 🛣️ API Endpoints

### Authentication

#### POST `/make-server-99be6423/admin/init`

Initialize default admin user (idempotent)

- **Body**: None
- **Response**: `{ success: boolean, message: string }`

#### POST `/make-server-99be6423/admin/login`

Login admin and create session

- **Body**: `{ username: string, password: string }`
- **Response**: `{ success: boolean, token?: string, username?: string, error?: string }`

#### GET `/make-server-99be6423/admin/verify`

Verify admin session

- **Headers**: `Authorization: Bearer {token}`
- **Response**: `{ success: boolean, username?: string, error?: string }`

#### POST `/make-server-99be6423/admin/logout`

Logout admin and destroy session

- **Headers**: `Authorization: Bearer {token}`
- **Response**: `{ success: boolean }`

### Questions CRUD

#### GET `/make-server-99be6423/questions?level={level}`

Get all questions (optional level filter)

- **Query**: `level?: "easy" | "medium" | "hard"`
- **Response**: `{ success: boolean, questions: Question[] }`

#### GET `/make-server-99be6423/questions/:id`

Get single question by ID

- **Params**: `id: string`
- **Response**: `{ success: boolean, question?: Question, error?: string }`

#### POST `/make-server-99be6423/questions`

Create new question (protected)

- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ level, question, answers, correct, hint }`
- **Response**: `{ success: boolean, question?: Question, error?: string }`

#### PUT `/make-server-99be6423/questions/:id`

Update existing question (protected)

- **Headers**: `Authorization: Bearer {token}`
- **Params**: `id: string`
- **Body**: `{ level, question, answers, correct, hint }`
- **Response**: `{ success: boolean, question?: Question, error?: string }`

#### DELETE `/make-server-99be6423/questions/:id`

Delete question (protected)

- **Headers**: `Authorization: Bearer {token}`
- **Params**: `id: string`
- **Response**: `{ success: boolean, error?: string }`

### Utility

#### POST `/make-server-99be6423/admin/seed`

Seed initial questions (protected)

- **Headers**: `Authorization: Bearer {token}`
- **Response**: `{ success: boolean, message?: string, error?: string }`

---

## 🔐 Authentication Flow

### Login Sequence

```
1. User enters credentials
   └─> POST /admin/init (create default admin if not exists)
   └─> POST /admin/login
       └─> Validate credentials
       └─> Generate session token (SHA256)
       └─> Store session in KV: admin:session:{token}
       └─> Return token to client

2. Client stores token in state
   └─> Used for all protected requests

3. Session validation
   └─> Extract token from Authorization header
   └─> Check admin:session:{token} in KV
   └─> Verify expiresAt > Date.now()
   └─> Return username or null
```

### Logout Sequence

```
1. Client sends logout request with token
   └─> DELETE admin:session:{token} from KV
   └─> Clear client-side token
   └─> Redirect to home
```

---

## 🔄 Real-Time Sync Mechanism

### Implementation

```typescript
// Client-side: useQuestions hook
useEffect(() => {
  fetchQuestions();

  // Auto-refresh every 5 seconds
  const interval = setInterval(fetchQuestions, 5000);

  return () => clearInterval(interval);
}, [level]);
```

### Flow Diagram

```
Admin adds/updates/deletes question
    ↓
Data saved to Supabase KV Store
    ↓
Quiz Player auto-refresh (every 5s)
    ↓
Fetch updated questions from API
    ↓
Update local state
    ↓
Re-render QuizScreen with new data
```

### Optimization Considerations

- **Trade-off**: Polling every 5s vs WebSocket real-time
- **Why polling**: Simpler implementation, adequate for use case
- **Future improvement**: Implement Supabase Realtime subscriptions

---

## 🎨 Component Structure

### Admin Components Tree

```
AdminLogin
├─ AdminHologramPanel
├─ AmberNeonButton
└─ GlitchText

AdminDashboard
├─ AdminHologramPanel
├─ AmberNeonButton
├─ GlitchText
├─ Stats Cards (4x)
├─ Actions Bar
│  ├─ Add Button
│  ├─ Seed Button
│  ├─ Refresh Button
│  └─ Level Filter
├─ Questions List
│  └─ Question Card (repeating)
│     ├─ Level Badge
│     ├─ Question Text
│     ├─ Answers Grid
│     ├─ Hint
│     └─ Action Buttons (Edit, Delete)
├─ QuestionModal (Add/Edit)
│  └─ Form Fields
│     ├─ Level Select
│     ├─ Question Textarea
│     ├─ Answers Inputs (4x)
│     ├─ Correct Radio Group
│     └─ Hint Textarea
├─ Delete Confirmation Dialog
└─ Notification Toast
```

### Quiz Player Integration

```
QuizScreen
├─ useQuestions(level) hook
│  ├─ Fetch from API
│  ├─ Auto-refresh (5s interval)
│  └─ Fallback to hardcoded data
├─ HologramPanel (Question display)
├─ Answer Buttons (4x)
└─ HintPanel
```

---

## 🛡️ Security Considerations

### Current Implementation

✅ Password hashing (SHA256)
✅ Session-based authentication
✅ Token expiration (24h)
✅ Protected endpoints (CRUD)
✅ Input validation

### Production Recommendations

⚠️ **Must implement:**

1. **Stronger hashing**: Use bcrypt/argon2 instead of SHA256
2. **HTTPS only**: Enforce TLS for all connections
3. **Rate limiting**: Prevent brute force attacks
4. **CSRF protection**: Add CSRF tokens
5. **SQL injection**: N/A (using KV store, but validate inputs)
6. **XSS protection**: Sanitize user inputs
7. **Change default credentials**: Update admin/admin123

### Example: Better Password Hashing

```typescript
// Production-ready (use bcrypt)
import { hash, compare } from "npm:bcrypt";

// Hashing
const salt = await genSalt(10);
const hashedPassword = await hash(password, salt);

// Verification
const isValid = await compare(password, hashedPassword);
```

---

## 🧪 Testing Strategy

### Unit Tests (Recommended)

```typescript
// Test authentication
describe("Admin Auth", () => {
  test("should login with valid credentials");
  test("should reject invalid credentials");
  test("should expire session after 24h");
});

// Test CRUD operations
describe("Question CRUD", () => {
  test("should create question");
  test("should update question");
  test("should delete question");
  test("should validate question format");
});
```

### Integration Tests

```typescript
// Test end-to-end flow
describe("Admin to Player Sync", () => {
  test("admin adds question → player receives it");
  test("admin updates question → player shows update");
  test("admin deletes question → player removes it");
});
```

---

## 📊 Performance Optimization

### Current Setup

- **Polling interval**: 5 seconds
- **Database**: Supabase KV Store (fast key-value operations)
- **Caching**: React state caching

### Potential Improvements

#### 1. Implement Caching

```typescript
// Add localStorage cache
const getCachedQuestions = () => {
  const cached = localStorage.getItem("questions");
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < 30000) {
      // 30s cache
      return data;
    }
  }
  return null;
};
```

#### 2. Debounce Auto-refresh

```typescript
// Only refresh if window is focused
useEffect(() => {
  if (!document.hidden) {
    fetchQuestions();
  }
}, [document.hidden]);
```

#### 3. Batch Operations

```typescript
// Batch multiple question updates
const batchUpdateQuestions = async (updates: Question[]) => {
  await Promise.all(updates.map((q) => updateQuestion(q)));
};
```

---

## 🐛 Error Handling

### Client-Side

```typescript
try {
  const response = await fetch(url);
  const data = await response.json();

  if (!data.success) {
    showNotification("error", data.error);
  }
} catch (error) {
  console.error("API Error:", error);
  showNotification("error", "Connection failed");
}
```

### Server-Side

```typescript
app.post("/questions", async (c) => {
  try {
    // Validate
    if (!level || !["easy", "medium", "hard"].includes(level)) {
      return c.json(
        { success: false, error: "Invalid level" },
        400,
      );
    }

    // Process...
  } catch (error) {
    console.error("Create question error:", error);
    return c.json(
      { success: false, error: "Failed to create question" },
      500,
    );
  }
});
```

---

## 🚀 Deployment Checklist

### Pre-deployment

- [ ] Update default admin credentials
- [ ] Enable HTTPS
- [ ] Add rate limiting
- [ ] Test all CRUD operations
- [ ] Test authentication flow
- [ ] Test auto-refresh mechanism
- [ ] Check mobile responsiveness
- [ ] Review console for errors

### Post-deployment

- [ ] Monitor server logs
- [ ] Check database connections
- [ ] Test real-time sync
- [ ] Verify session expiration
- [ ] Test on different devices
- [ ] Backup initial data

---

## 📈 Monitoring & Logging

### Key Metrics to Track

1. **API Response Times**
   - Login latency
   - Question fetch time
   - CRUD operation time

2. **Error Rates**
   - Failed logins
   - API errors (4xx, 5xx)
   - Client-side errors

3. **Usage Stats**
   - Number of questions created
   - Number of active sessions
   - Auto-refresh hit rate

### Logging Best Practices

```typescript
// Structured logging
console.log({
  timestamp: Date.now(),
  event: "question_created",
  level: "info",
  data: { id, level, username },
});

// Error logging with context
console.error({
  timestamp: Date.now(),
  event: "login_failed",
  level: "error",
  error: error.message,
  username,
});
```

---

## 🔄 Future Enhancements

### Short-term

1. **Search functionality**: Search questions by text
2. **Bulk operations**: Import/export questions (CSV/JSON)
3. **Question categories**: Add tagging system
4. **Version history**: Track question changes

### Long-term

1. **WebSocket real-time**: Replace polling with Supabase Realtime
2. **Multi-admin support**: Role-based access control
3. **Analytics dashboard**: Question difficulty analysis
4. **AI-powered hints**: Auto-generate hints
5. **Mobile app**: Native admin app for iOS/Android

---

## 📚 References

- **Hono Framework**: https://hono.dev/
- **Supabase Docs**: https://supabase.com/docs
- **Motion (Framer Motion)**: https://motion.dev/
- **React Hooks**: https://react.dev/reference/react

---

**Document Version**: 1.0.0  
**Last Updated**: December 2025  
**Maintained by**: Zenless Quiz Protocol Dev Team