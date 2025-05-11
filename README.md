# 🥋 Aplikasi Turnamen Pencak Silat

Aplikasi web untuk mengelola turnamen Pencak Silat secara digital. Aplikasi ini mendukung sistem penilaian oleh 3 juri, pencatatan peserta berdasarkan organisasi, dan pengelolaan bagan pertandingan secara otomatis. Data disimpan dan disinkronisasi menggunakan **Supabase**.

## 🚀 Fitur Utama

- ✍️ **Formulir Pendaftaran Peserta**
  - Nama lengkap, usia, jenis kelamin, kategori berat badan
  - Organisasi → Cabang → Sub-cabang
  - Wilayah asal

- ⚖️ **Sistem Penilaian oleh 3 Juri**
  - Setiap pertandingan terdiri dari 3 ronde (1 menit per ronde)
  - Juri memberikan nilai setiap ronde
  - Perhitungan otomatis skor rata-rata dan penentuan pemenang

- 🏆 **Bagan Turnamen**
  - Tampilan visual pertandingan secara eliminasi
  - Update otomatis berdasarkan hasil pertandingan

- 🗂️ **Manajemen Organisasi**
  - Klasifikasi peserta berdasarkan organisasi, cabang, dan sub-cabang
  - Filter dan pencarian peserta

- ⏱️ **Timer Pertandingan**
  - Kontrol waktu pertandingan 1 menit per ronde
  - Admin panel untuk kontrol alur pertandingan

## 🧰 Teknologi yang Digunakan

- **Frontend**: React + Vite + TailwindCSS  
- **Backend**: FastAPI (opsional, jika perlu server-side logic)  
- **Database**: Supabase (PostgreSQL + Realtime)

## 🗃️ Struktur Database (Supabase)

**Tabel Utama:**
- `participants` — Data biodata peserta
- `organizations` — Daftar organisasi, cabang, dan sub-cabang
- `matches` — Jadwal dan hasil pertandingan
- `scores` — Penilaian per ronde dari tiap juri
- `judges` — Akun juri (opsional dengan autentikasi)
  
**Contoh Data Awal:**
Supabase sudah diisi dengan data dummy:
- 10 peserta
- 2 organisasi, masing-masing dengan 2 cabang dan sub-cabang
- 3 juri

## 📦 Instalasi Lokal

```bash
git clone https://github.com/namakamu/pencak-silat-tournament-app.git
cd pencak-silat-tournament-app
npm install
npm run dev
````

> Pastikan Anda sudah mengatur `.env` dengan URL Supabase dan API Key Anda.

## 🔐 Konfigurasi Supabase

1. Buat proyek di [https://supabase.com](https://supabase.com)
2. Salin `SUPABASE_URL` dan `SUPABASE_ANON_KEY`
3. Tambahkan ke `.env`:

```
VITE_SUPABASE_URL=your-url
VITE_SUPABASE_ANON_KEY=your-key
```

4. Jalankan script SQL (akan disediakan) untuk membuat tabel dan mengisi data awal.

## 🛠️ TODO

* [ ] Tambahkan autentikasi juri dan admin
* [ ] Fitur live scoring dengan Supabase Realtime
* [ ] Statistik peserta dan pertandingan
* [ ] Export hasil turnamen (PDF/Excel)

## 📄 Lisensi

Proyek ini bersifat open-source dengan lisensi MIT.

Dibuat dengan ❤️ untuk mendukung digitalisasi olahraga bela diri tradisional Indonesia.

```

---

Jika kamu ingin, aku juga bisa bantu buatkan isi `.env.example`, struktur tabel Supabase SQL, atau file seeder-nya. Mau dilanjut ke bagian mana dulu?
```
