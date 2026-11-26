# Web Profil & Portofolio (HTML & JavaScript)

Aplikasi web profil statis bertema terang (*light theme*) dengan gaya bahasa semi formal, dirancang menggunakan **HTML dan JavaScript murni** agar dapat dijalankan langsung di browser lokal (`file://`) maupun di-upload ke **Vercel**.

## Struktur Berkas

- `index.html` — Halaman Utama (sambutan, foto profil, gambar ilustrasi, sorotan karya, dan jejaring komunitas Instagram)
- `profil.html` — Halaman Profil lengkap (foto profil, deskripsi diri, ilustrasi, keahlian, dan riwayat pembelajaran)
- `kontak.html` — Halaman Kontak & formulir pesan lokal (tanpa nomor HP, alamat, maupun email)
- `admin.html` — Menu Login Admin & Panel Pengelola
- `js/config.js` — Data profil, kontak, dan hash password admin (siap ekspor untuk publish permanen)
- `js/app.js` — Logika aplikasi, enkripsi SHA-256 lokal, manajemen profil, dan sinkronisasi data
- `assets/foto-profil.jpg` — Foto profil default
- `assets/ilustrasi-utama.jpg` — Gambar ilustrasi utama
- `vercel.json` — Konfigurasi deployment untuk Vercel

## Penggunaan Lokal

1. Buka file `index.html` langsung di browser (Chrome, Edge, Firefox).
2. Untuk mengelola profil, klik **Login Admin** pada bilah navigasi (`admin.html`):
   - **Username default:** `admin`
   - **Password default:** `admin123`
3. Segera ubah password melalui tab **3. Ganti Password** setelah masuk.

## Cara Publish ke Vercel agar Profil Tetap Permanen

1. **Jika mengedit lewat Panel Admin (`admin.html`):**
   - Simpan perubahan pada tab Profil / Kontak / Password.
   - Buka tab **4. Simpan Permanen (Publish)** lalu klik **Unduh File `config.js` Terbaru**.
   - Ganti file `js/config.js` di folder proyek dengan file yang baru diunduh, lalu upload/deploy ke Vercel.
2. **Jika mengedit teks langsung di file HTML (`index.html`, `profil.html`, `kontak.html`):**
   - Aplikasi akan menjaga teks HTML Anda agar tidak tertimpa saat dipublikasikan ke Vercel.
