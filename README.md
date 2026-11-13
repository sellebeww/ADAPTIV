![Adaptiv](docs/banner.png)

<p align="center">
  Platform <em>dynamic assessment</em> untuk pendidikan vokasi (SMK) dan industri:
  menguji apakah siswa benar-benar bisa menyesuaikan keterampilan saat kondisi kerja berubah,
  bukan sekadar mengulang prosedur hafalan.
</p>

<p align="center">
  <img alt="React 19" src="https://img.shields.io/badge/React-19-20232a?logo=react&logoColor=61dafb" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white" />
  <img alt="Tailwind CSS 4" src="https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss&logoColor=white" />
</p>

![Beranda Adaptiv](docs/screenshots/01-landing.png)

## Masalah yang diselesaikan

Portofolio, sertifikat, dan ujian tugas bisa menunjukkan hasil bagus, tetapi tidak membuktikan siswa mampu menghadapi variasi pekerjaan nyata. Adaptiv menilai **proses adaptasi**: siswa memprediksi, menyesuaikan diri saat kondisi tugas diubah, lalu mengevaluasi dirinya sendiri. Hasilnya dirangkum dalam **Indeks Adaptasi (IA)** dan **Paspor Kemampuan** yang bisa diverifikasi industri.

## Fitur utama

### Sesi uji 7 fase
Alur penilaian dari persiapan, tugas dasar, situasi berubah, prediksi, penyesuaian, evaluasi diri, sampai penilaian rubrik dan penerbitan paspor.

![Sesi uji](docs/screenshots/03-sesi-uji.png)

### Paspor Kemampuan
Radar 5 dimensi (prediksi, penyesuaian, hasil, kemandirian, evaluasi), tren Indeks Adaptasi antar sesi, peta batas kemampuan, serta QR code untuk verifikasi publik. Bisa dibagikan lewat tautan atau dicetak ke PDF.

![Paspor Kemampuan](docs/screenshots/04-paspor.png)

### Verifikasi publik
Siapa pun yang memindai QR atau membuka tautan paspor melihat keabsahan dan ringkasan hasilnya, tanpa perlu akun.

<p align="center"><img src="docs/screenshots/08-verifikasi.png" alt="Halaman verifikasi paspor" width="640" /></p>

### Pustaka tugas dan visualizer sirkuit
Tugas dasar standar beserta variasinya, daftar kriteria, petunjuk bertingkat yang mengurangi skor kemandirian, dan simulasi diagram sirkuit interaktif.

![Pustaka tugas](docs/screenshots/05-pustaka.png)

<p align="center"><img src="docs/screenshots/09-visualizer-sirkuit.png" alt="Visualizer sirkuit interaktif" width="560" /></p>

### Portal mitra industri
Industri menyaring kandidat menurut tingkat adaptasi, membuka paspor mereka, dan mengirim permintaan variasi kasus lapangan ke tim kurikulum SMK.

![Portal industri](docs/screenshots/06-portal-industri.png)

### Dasbor lembaga
Distribusi tingkat adaptasi siswa, kesepakatan antar-penilai (Kappa), korelasi dengan kinerja lapangan, dan kategori variasi paling menantang. Data bisa diekspor ke CSV.

![Dasbor lembaga](docs/screenshots/07-dashboard-lembaga.png)

### Simulasi lima peran
Ganti peran langsung dari navbar untuk melihat sudut pandang **Siswa**, **Guru Penilai**, **Mitra Industri**, **Admin Lembaga**, dan **Super Admin**.

## Kualitas dan aksesibilitas

- **Tes otomatis:** 37 tes untuk logika penilaian (`src/utils/scoring.ts`): bobot rubrik, Indeks Adaptasi, tingkat adaptasi, selisih transfer, kalibrasi, kasus tepi (tanpa jawaban, semua benar, semua salah), dan urutan acak dengan seed. CI menjalankan typecheck, tes, build, dan pemeriksaan layout.
- **Aksesibilitas:** pemeriksaan otomatis axe-core (WCAG 2.1 A/AA) pada beranda, sesi uji, paspor, pustaka, portal industri, dasbor lembaga, dan verifikasi tidak menemukan pelanggaran. Grafik tren punya ringkasan teks dan tabel data, radar dan diagram sirkuit punya label teks, dan fokus keyboard terlihat. Deteksi otomatis tidak menggantikan uji dengan pembaca layar, yang belum dilakukan.
- **Responsif:** tidak ada gulir horizontal pada halaman di lebar 320, 360, 390, 480, 768, 1024, 1280, 1440, dan 1920 px, mencakup beranda, verifikasi, semua fase sesi yang bisa dibuka, menu, pustaka, paspor, portal industri, dasbor lembaga, dan modal Brand Kit (`npm run check:layout`).
- **Validasi:** prediksi dan refleksi tidak bisa dikunci dalam keadaan kosong, dan isian spasi saja ditolak di form variasi tugas.
- **Ukuran teks:** teks isi minimal 12 px, label huruf kapital minimal 11 px.

Temuan audit dan keputusan yang belum diambil ada di [docs/AUDIT.md](docs/AUDIT.md).

## Menjalankan secara lokal

Prasyarat: Node.js 22 (versi yang diuji di CI).

```bash
npm install
npm run dev        # http://localhost:3000
```

| Perintah | Fungsi |
|---|---|
| `npm run dev` | server pengembangan |
| `npm run typecheck` | pemeriksaan tipe (`tsc --noEmit`, mode strict) |
| `npm run lint` | saat ini alias `typecheck`; belum ada ESLint |
| `npm test` | tes unit (Vitest), zona waktu dikunci UTC |
| `npm run test:watch` | tes dalam mode watch |
| `npm run build` | build produksi ke `dist/` |
| `npm run preview` | pratinjau hasil build |
| `npm run check:layout` | memeriksa tidak ada gulir horizontal di 320 sampai 1920 px (butuh `npm run build` dan Chromium Playwright) |

### Tes

Tes ditulis deterministik: tanpa `Math.random` (pengacakan memakai PRNG ber-seed di `src/test/prng.ts`), waktu memakai fake timer, dan zona waktu dikunci UTC di `src/test/global-setup.ts`. `check:layout` memakai Chromium; jika belum ada, jalankan `npx playwright install chromium`.

## Konsep penilaian

Satu sesi mengikuti fase 0 sampai 7: persiapan, tugas dasar, perubahan kondisi, prediksi terkunci, penyesuaian dengan petunjuk bertingkat, evaluasi diri, penilaian rubrik, dan penerbitan paspor. Penilai memberi skor 0 sampai 4 pada lima dimensi, lalu:

```
IA = 100 x (0,20 P + 0,30 K + 0,25 H + 0,15 M + 0,10 E) / 4
```

P = prediksi, K = penyesuaian, H = hasil, M = kemandirian, E = evaluasi diri. Tingkat: IA < 40 Tergantung Prosedur, 40 sampai < 60 Berkembang, 60 sampai < 80 Cakap Beradaptasi, 80 ke atas Mahir Beradaptasi. Selisih transfer dan kalibrasi diri dihitung dari rata-rata skor; cara menghitungnya dan hal yang masih perlu diputuskan ada di [docs/AUDIT.md](docs/AUDIT.md).

## Batasan dan validitas

Adaptiv saat ini adalah prototipe demonstrasi, bukan instrumen yang sudah divalidasi.

- Bobot rubrik, ambang tingkat, dan rumus IA adalah rancangan, belum diuji secara psikometrik (reliabilitas, validitas konstruk, atau norma). Tidak ada klaim bahwa IA memprediksi kinerja kerja.
- Angka di dasbor lembaga (Kappa, korelasi kinerja lapangan, jumlah sesi, tingkat gagal per kategori) adalah data contoh yang ditulis langsung di kode, bukan hasil pengukuran.
- "Verifikasi" paspor mencocokkan kode dengan data contoh di peramban. Belum ada tanda tangan digital, basis data, atau autentikasi, sehingga belum bisa dipercaya sebagai bukti kemampuan.
- Skor rubrik diberikan manual oleh penilai; penalti petunjuk belum otomatis mengurangi skor Kemandirian, dan skor tugas dasar masih konstanta.

## Data dan deployment

Aplikasi ini SPA statis tanpa backend. Seluruh data contoh ada di [src/data/seedData.ts](src/data/seedData.ts) dan tidak ada variabel lingkungan yang wajib diisi.

## Deploy ke Vercel

Konfigurasi sudah disiapkan di [vercel.json](vercel.json) (preset Vite, header keamanan dasar, cache aset). Impor repo di Vercel lalu deploy tanpa pengaturan tambahan. Verifikasi paspor memakai query string (`?verifikasi=KODE`), jadi tidak perlu aturan rewrite.

## Struktur proyek

```
src/
  components/   komponen per fitur: admin, assessment, brand, circuit,
                company, industry, layout, library, passport
  data/         data contoh (seed)
  types/        tipe TypeScript domain
  utils/        logika skor (+ tes), paspor, unduhan
  test/         pembantu tes (PRNG ber-seed, setup zona waktu)
scripts/        check-layout.mjs (pemeriksa gulir horizontal)
.github/        workflow CI
public/         logo, ikon, dan foto
docs/           dokumentasi, AUDIT.md, laporan audit lama, dan screenshot
```

## Catatan

Data siswa, sekolah, dan perusahaan di aplikasi ini adalah contoh fiktif untuk demonstrasi.

## Author & License

Created by Vassel Goleyu. Copyright (c) 2026 Vassel Goleyu. All rights reserved. Lihat [LICENSE](LICENSE).
