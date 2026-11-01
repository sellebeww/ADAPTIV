# Keputusan Arsitektur & Identitas Merek Adaptiv (DECISIONS.md)

Dokumen ini mencatat keputusan desain, token warna, dan pengelolaan aset merek Adaptiv sesuai panduan Prompt Master.

## 1. Identitas Merek & Penyesuaian Warna Logo

Berdasarkan analisis visual logo resmi (`Adaptiv_Dynamic_Arrow_Logo.png`) dan spesifikasi Bagian 3:
- **Huruf A Primer**: `#3F55F0` (`brand-indigo`) — digunakan pada tombol primer, header aktif, elemen navigasi utama, dan visual huruf A.
- **Panah Melengkung Dinamis**: `#4A8BFF` (`brand-sky`) — digunakan pada aksen panah, tautan, titik huruf 'i' pada kata Adaptiv, dan badge informasi.
- **Teks Utama & Wordmark**: `#0F1B4A` (`brand-navy`) — teks judul, kontras tinggi yang memenuhi standar aksesibilitas WCAG AA.
- **Shading / Hover**: `#2A38B8` (`brand-indigo-dark`) — status hover tombol dan bayangan berbobot.
- **Surface**: `#F6F8FF` (`brand-surface`) — latar belakang bagian dan halaman.
- **Borders**: `#E3E8F8` (`brand-border`) — garis pemisah kartu dan tabel.
- **Teks Sekunder**: `#5B6585` (`brand-muted`) — deskripsi dan metadata.

## 2. Aset Logo Tanpa Background (No-BG)

Dibuat varian logo transparan (alpha channel) yang tersimpan di `/public/brand/`:
1. `adaptiv-logo-nobg.png`: Logo lengkap (simbol A + wordmark) vertikal transparan (resolusi tinggi).
2. `adaptiv-horizontal-nobg.png`: Format horizontal (simbol di kiri, wordmark di kanan) transparan, dioptimalkan untuk header, navbar, dan kop surat.
3. `adaptiv-symbol-nobg.png`: Simbol huruf A dengan panah dinamis transparan untuk favicon, avatar, dan motif grafis.
4. `adaptiv-wordmark-nobg.png`: Wordmark tipografi Adaptiv dengan titik huruf 'i' biru langit transparan.
5. `adaptiv-horizontal-white.png` & `adaptiv-logo-white.png`: Versi monokrom putih bersih untuk latar belakang gelap / night mode.
6. `favicon.png` & `favicon.ico`: Ikon web browser berbasis simbol huruf A.

## 3. Fitur Studio Logo & Brand Kit

Disediakan modal interaktif **"Logo & Brand Kit"** langsung di aplikasi:
- Tombol unduh 1-klik untuk setiap varian logo transparan (PNG).
- Pratinjau latar belakang dinamis: Grid Transparansi (Checkerboard), Latar Putih (#FFF), dan Latar Gelap Navy (#0F1B4A).
- Swatch warna interaktif dengan fitur salin kode HEX 1-klik.

## 4. Mesin Penilaian Dinamis (Dynamic Assessment)

- **8 Fase Lengkap (Fase 0 hingga Fase 7)**: Persiapan, Tugas Dasar (Instalasi TITL), Situasi Berubah, Prediksi Terkunci & Dicap Waktu, Penyesuaian dengan Petunjuk Bertingkat (Level 1-3), Evaluasi Diri, Penilaian Rubrik 5 Dimensi (0-4), dan Penerbitan Paspor Kemampuan.
- **Perhitungan Indeks Adaptasi (IA)**: $IA = 100 \times (0.20P + 0.30K + 0.25H + 0.15M + 0.10E) / 4$
- **Metrik Tambahan**: Selisih Transfer ($Skor_{dasar} - Skor_{variasi}$) dan Kalibrasi Diri ($Keyakinan - Skor_{aktual}$).
- **Paspor Kemampuan**: Grafik radar 5 dimensi native SVG, kode verifikasi unik (`ADAPT-2026-TITL-0891`), dan matriks peta batas kemampuan 8 kategori perubahan.
