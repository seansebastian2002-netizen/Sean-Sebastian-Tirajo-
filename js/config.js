/**
 * Konfigurasi Utama Aplikasi Web Profil
 * -------------------------------------
 * File ini menyimpan data default sekaligus data hasil ekspor dari Panel Admin.
 * Ketika Anda mengunduh ulang file config.js dari menu Admin -> Simpan Permanen,
 * lalu mengganti file js/config.js ini sebelum diunggah ke Vercel, seluruh perubahan
 * profil, kontak, foto, maupun password akan tetap tersimpan secara permanen.
 */
window.APP_CONFIG = {
  version: 1,
  isCustomized: false,
  publishedAt: "2026-11-26T09:50:00+07:00",
  admin: {
    username: "admin",
    // Default password: "admin123" (segera ubah melalui menu Login Admin -> Keamanan)
    passwordHash: "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9"
  },
  profile: {
    nama: "Raka Pratama",
    peran: "Pelajar & Pengembang Web",
    tagline: "Membangun antarmuka web yang rapi, cepat, dan nyaman digunakan di berbagai perangkat.",
    sambutanHero: "Selamat datang di ruang profil digital saya. Melalui situs ini, Anda dapat mengenal latar belakang, keahlian utama, serta karya yang sedang saya kembangkan.",
    bio: "Saya adalah seorang pelajar di bidang teknologi informasi yang memiliki ketertarikan besar pada pengembangan web modern, perancangan antarmuka bertema cerah (light theme), serta pengelolaan konten digital yang terstruktur.\n\nSaya senang mengeksplorasi teknologi dasar seperti HTML dan JavaScript murni untuk menciptakan aplikasi web yang ringan, responsif, dan siap dipublikasikan dengan mudah.",
    foto: "assets/foto-profil.jpg",
    ilustrasi: "assets/ilustrasi-utama.jpg",
    ketersediaan: "Terbuka untuk Diskusi & Kolaborasi Proyek",
    keahlian: [
      { nama: "HTML5 & Struktur Semantik", tingkat: "Mahir", kategori: "Frontend" },
      { nama: "JavaScript Lokal & Interaktif", tingkat: "Menengah - Mahir", kategori: "Logika Web" },
      { nama: "Desain Antarmuka Light Theme", tingkat: "Mahir", kategori: "UI/UX" },
      { nama: "Publikasi Web Statis (Vercel)", tingkat: "Menengah", kategori: "Deployment" }
    ],
    sorotan: [
      {
        judul: "Pengembangan Web Profil Statis",
        deskripsi: "Merancang portal profil pribadi yang berjalan penuh di browser lokal maupun platform cloud seperti Vercel tanpa dependensi server.",
        tag: "HTML & JavaScript"
      },
      {
        judul: "Eksplorasi Antarmuka Minimalis",
        deskripsi: "Mengutamakan keterbacaan teks, hierarki visual yang jelas, serta palet warna terang yang nyaman dipandang.",
        tag: "UI Design"
      },
      {
        judul: "Kolaborasi Komunitas Kreatif",
        deskripsi: "Aktif berdiskusi dan berbagi inspirasi seputar pemrograman web dasar bersama rekan pelajar melalui jejaring Instagram.",
        tag: "Komunitas"
      }
    ],
    riwayat: [
      {
        periode: "2024 - Sekarang",
        judul: "Rekayasa Perangkat Lunak & Pengembangan Web",
        instansi: "Pembelajaran Mandiri & Proyek Sekolah",
        deskripsi: "Mempelajari dasar arsitektur web statis, manipulasi DOM dengan JavaScript, serta praktik baik publikasi aplikasi web."
      },
      {
        periode: "2023 - 2024",
        judul: "Dasar Desain Antarmuka Digital",
        instansi: "Kegiatan Ekstrakurikuler Teknologi",
        deskripsi: "Melatih kepekaan tata letak halaman web, pemilihan warna light theme, dan penyusunan aset ilustrasi."
      }
    ]
  },
  contact: {
    sambutan: "Silakan terhubung atau kirimkan pesan melalui kanal digital di bawah ini. Demi menjaga privasi, halaman ini hanya menampilkan tautan kanal daring tanpa mencantumkan nomor telepon, alamat fisik, maupun surel pribadi.",
    komunitasJudul: "Jejaring Komunitas",
    komunitasDeskripsi: "Ikuti pembaruan karya, catatan belajar, dan aktivitas komunitas melalui akun Instagram resmi berikut.",
    instagramHandle: "@rakapratama.dev",
    instagramUrl: "https://instagram.com/rakapratama.dev",
    links: [
      {
        label: "Instagram Komunitas",
        nilai: "@rakapratama.dev",
        url: "https://instagram.com/rakapratama.dev",
        ikon: "instagram"
      },
      {
        label: "GitHub Portofolio",
        nilai: "github.com/rakapratama",
        url: "https://github.com/rakapratama",
        ikon: "github"
      },
      {
        label: "Portal Karya Web",
        nilai: "rakapratama.vercel.app",
        url: "https://vercel.com",
        ikon: "globe"
      }
    ]
  }
};
