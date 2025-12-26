# 🔐 Admin Panel Guide - Zenless Quiz Protocol

## 🎯 Akses Admin Panel

### URL Akses
- **Web**: Klik tombol "ADMIN ACCESS" di home screen
- **Direct**: Tambahkan `#admin` di URL (contoh: `yourapp.com/#admin`)

### Default Credentials
```
Username: admin
Password: admin123
```

⚠️ **Security Note**: Ganti kredensial default di production!

---

## 📋 Fitur Admin Panel

### 1. **Dashboard Overview**
Menampilkan statistik real-time:
- Total jumlah soal
- Jumlah soal per level (Easy, Medium, Hard)
- Filter dan search questions

### 2. **Manage Questions (CRUD)**

#### ➕ **Add Question**
1. Klik tombol **"ADD QUESTION"**
2. Isi form:
   - **Level**: Pilih Easy/Medium/Hard
   - **Question**: Tulis pertanyaan
   - **Answers**: Isi 4 pilihan jawaban
   - **Correct Answer**: Tandai jawaban yang benar dengan radio button
   - **Hint**: Tulis petunjuk untuk hint system
3. Klik **"CREATE"**
4. Soal baru akan langsung muncul di quiz player

#### ✏️ **Edit Question**
1. Cari soal yang ingin diedit di daftar
2. Klik tombol **Edit (ikon pensil)**
3. Ubah field yang diperlukan
4. Klik **"UPDATE"**
5. Perubahan langsung tersinkronisasi ke player

#### 🗑️ **Delete Question**
1. Cari soal yang ingin dihapus
2. Klik tombol **Delete (ikon trash)**
3. Konfirmasi penghapusan
4. Soal akan dihilangkan dari database dan player

#### 🔄 **Refresh Questions**
- Klik tombol **"REFRESH"** untuk memuat ulang daftar soal

### 3. **Seed Initial Data**
Klik tombol **"SEED DATA"** untuk mengisi database dengan 10 soal sample (3 Easy, 3 Medium, 4 Hard).

---

## 🔄 Real-Time Sync

### Bagaimana Cara Kerjanya?
- **Auto-refresh**: Quiz player memuat ulang questions setiap 5 detik
- **Instant update**: Perubahan dari admin langsung terlihat di player
- **Fallback system**: Jika database kosong, player menggunakan hardcoded questions

### Alur Kerja
```
Admin CRUD → Supabase Database → Auto-refresh (5s) → Quiz Player Updated
```

---

## 🎨 Design System

### Color Scheme (Admin Mode)
- **Primary**: `#FF8C42` (Amber Orange) - Membedakan dari player mode
- **Danger**: `#FF4B4B` (Red) - Delete actions
- **Secondary**: `#9CA3AF` (Gray) - Cancel/back buttons

### Komponen Khusus Admin
- `AmberNeonButton` - Button dengan accent orange
- `AdminHologramPanel` - Panel dengan border amber
- `AdminDashboard` - Main dashboard component

---

## 🔧 Technical Details

### API Endpoints
```
POST   /admin/init          - Initialize default admin
POST   /admin/login         - Login admin
GET    /admin/verify        - Verify session
POST   /admin/logout        - Logout admin
GET    /questions           - Get all questions
GET    /questions/:id       - Get single question
POST   /questions           - Create question (protected)
PUT    /questions/:id       - Update question (protected)
DELETE /questions/:id       - Delete question (protected)
POST   /admin/seed          - Seed initial data (protected)
```

### Authentication
- Session-based authentication
- Token expires after 24 hours
- Stored in Supabase KV store

### Data Structure
```typescript
{
  id: string,
  level: "easy" | "medium" | "hard",
  question: string,
  answers: string[],  // 4 options
  correct: number,    // 0-3 (index of correct answer)
  hint: string,
  created_at: number,
  updated_at: number
}
```

---

## 🐛 Troubleshooting

### Login Gagal
- Pastikan username dan password benar
- Coba refresh halaman
- Cek console untuk error messages

### Soal Tidak Muncul di Player
- Tunggu hingga 5 detik untuk auto-refresh
- Klik "REFRESH" di dashboard
- Cek apakah soal tersimpan dengan benar (lihat level yang dipilih)

### Database Kosong
- Klik "SEED DATA" untuk mengisi soal sample
- Atau tambah soal manual dengan "ADD QUESTION"

---

## 📱 Responsive Design
Admin panel fully responsive untuk:
- Desktop (optimal experience)
- Tablet
- Mobile (touch-friendly controls)

---

## 🚀 Best Practices

1. **Seed Data Dulu**: Sebelum testing, seed data untuk mendapatkan soal sample
2. **Test di Player**: Setelah CRUD, test di quiz player untuk memastikan
3. **Backup Questions**: Export/backup soal penting sebelum delete massal
4. **Logout Setelah Selesai**: Jangan lupa logout untuk keamanan

---

## 🎮 Navigation Flow
```
Home Screen
    ↓ (Click "ADMIN ACCESS")
Admin Login
    ↓ (Login Success)
Admin Dashboard
    ↓ (Manage Questions)
    ├─ Add Question
    ├─ Edit Question
    ├─ Delete Question
    ├─ Seed Data
    └─ Logout → Home Screen
```

---

## 💡 Tips & Tricks

### 1. Efficient Question Management
- Use filter untuk fokus pada level tertentu
- Copy-paste format soal untuk konsistensi
- Gunakan hint yang jelas dan membantu

### 2. Level Difficulty Guidelines
- **Easy**: Aritmatika dasar, operasi sederhana
- **Medium**: Aljabar, persentase, akar kuadrat
- **Hard**: Kalkulus, limit, integral, matriks

### 3. Writing Good Hints
- Jangan kasih jawaban langsung
- Berikan strategi/approach
- Gunakan bahasa yang mudah dipahami

---

## 🔒 Security Notes

⚠️ **PENTING untuk Production:**
1. Ganti default admin password
2. Gunakan HTTPS untuk koneksi
3. Implement rate limiting
4. Add role-based access control (RBAC)
5. Regular security audits

---

## 📞 Support

Jika menemukan bug atau butuh bantuan:
1. Check console untuk error messages
2. Review ADMIN_GUIDE.md ini
3. Test di environment lokal terlebih dahulu

---

**Zenless Quiz Protocol: ADMIN ACCESS MODE**  
*CLEARANCE LEVEL: ADMINISTRATOR*  
*NEW ERIDU INTELLIGENCE NETWORK*
