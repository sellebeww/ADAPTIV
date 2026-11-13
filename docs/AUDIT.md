# Audit kualitas (mode aman)

Cakupan: logika penilaian, aksesibilitas, tampilan 360 px, ukuran file, dan bug. Perubahan perilaku hanya dilakukan bila ada tes yang membuktikan bug. Rumus dan desain penilaian tidak diubah.

## Baseline sebelum perubahan

Node 22.23, `npm ci` pada commit `048dfc7`.

| Langkah | Hasil |
|---|---|
| install (`npm ci`) | berhasil |
| typecheck (`tsc --noEmit`) | lolos |
| lint | skrip `lint` hanya alias `tsc --noEmit`; tidak ada ESLint |
| test | tidak ada skrip `test`, 0 tes |
| build | berhasil; satu chunk JS 975 kB (gzip 283 kB), muncul peringatan > 500 kB |
| CI | tidak ada |

Ukuran: sekitar 6,8 ribu baris; `AssessmentSession.tsx` 1.170 baris, `CompanyProfile.tsx` 762, `Navbar.tsx` 647.

## 1. Logika penilaian

Modul `src/utils/scoring.ts` sudah murni (tanpa React, tanpa DOM). Yang ada di luarnya hanya satu ternary tingkat dan fallback tampilan, keduanya sudah dipindahkan (lihat "Sudah diperbaiki"). Sekarang dilindungi 37 tes di `src/utils/scoring.test.ts`.

### Sudah diperbaiki (dibuktikan tes)

- **Tingkat pada pratinjau skor langsung salah untuk IA < 40.** Ternary di UI hanya mengenal tiga tingkat, jadi IA 30 tampil "Berkembang" padahal `getAdaptationLevel` (dan tipe `AdaptationLevel`) menetapkan "Tergantung Prosedur". Sekarang UI memanggil `getAdaptationLevel`.
- **Nilai 0 yang sah tampil sebagai angka contoh.** `session.result?.transferGap || 0.3` menampilkan 0,3 saat selisih transfer sebenarnya 0 (juga untuk kalibrasi dan IA). Diganti `describeResult` yang memakai `??`.

### Dicatat, tidak diubah (perlu keputusan pemilik)

1. **Rumus meragukan: selisih transfer dan kalibrasi memakai rata-rata biasa.** IA berbobot (0,20/0,30/0,25/0,15/0,10), tetapi `transferGap` dan `calibration` memakai rata-rata lima dimensi tanpa bobot, termasuk dimensi Prediksi dan Evaluasi yang bukan "kinerja variasi". Sebaiknya ditetapkan apakah ini disengaja.
2. **Skor tugas dasar adalah konstanta 3,5** (`handleFinalizeEvaluation`), bukan hasil penilaian tugas dasar. Selisih transfer jadi bergantung pada angka tetap.
3. **Penalti petunjuk tidak dihitung.** Petunjuk menampilkan "-0.2/-0.4/-0.8 Kemandirian", tetapi tidak ada kode yang mengurangi skor; skor Kemandirian diisi manual oleh penilai.
4. **`weakestCategory` bukan hasil perhitungan.** Nilainya sekadar kategori variasi sesi itu.
5. **Daftar skor kosong menghasilkan `NaN`** pada `transferGap` dan `calibration` (pembagian 0/0). Tidak terjangkau dari UI karena selalu ada lima skor; dikunci sebagai tes "KNOWN ISSUE" agar perubahan disadari.
6. **Tidak ada clamp.** Skor di luar 0 sampai 4 atau keyakinan di luar 1 sampai 5 menghasilkan IA/kalibrasi di luar rentang. Aman selama input hanya dari kontrol UI.
7. **Ambang "Batas Kesiapan Industri (IA ≥ 70)"** di grafik tren tidak punya dasar yang tertulis dan tidak sejajar dengan pita tingkat (60 sudah "Cakap Beradaptasi").
8. **Angka validitas di dasbor lembaga hardcoded:** Kappa 0,86, r = 0,79, N = 142, tingkat gagal per kategori. Itu data contoh, tetapi layar dan ekspor CSV/laporan tidak menandainya sebagai contoh. Jangan dibaca sebagai bukti validitas.
9. **Verifikasi paspor hanya mencocokkan kode dengan data contoh di klien.** Tidak ada tanda tangan atau backend, sehingga "terverifikasi" adalah simulasi.
10. **Sinkronisasi ke riwayat paspor menempel pada id `hist-sess-04`** (`App.tsx`), dan paspor kandidat lain dibuat dengan menskalakan satu paspor dasar (`passports.ts`). Cukup untuk demo, bukan model data.

## 2. Aksesibilitas

Diukur dengan axe-core 4.10 (WCAG 2.0/2.1 A dan AA) di 360 px pada beranda, verifikasi, sesi, pustaka, paspor, portal industri, dan dasbor lembaga. Ini deteksi otomatis; tidak menggantikan uji dengan pembaca layar.

Sudah diperbaiki:
- Grafik tren (Recharts) tidak punya alternatif teks. Kini ada ringkasan teks untuk pembaca layar dan tabel data ("Lihat data grafik sebagai tabel") dengan `caption`, `scope`, dan wadah gulir yang bisa difokus keyboard.
- Radar SVG (paspor dan skor langsung) dan SVG sirkuit tidak punya nama aksesibel. Kini `role="img"` dengan label berisi nilai/kondisi; sirkuit juga punya `role="status"`.
- Tombol toggle (jenis grafik, sesi, mode sirkuit, daya) kini membawa `aria-pressed`.
- Stepper fase: `opacity-60` pada tombol yang masih aktif membuat kontras gagal (axe `color-contrast`). Opasitas hanya untuk tombol `disabled`; fase aktif memakai `aria-current="step"`.

Dicek dan sudah baik: label form terhubung ke field, fokus keyboard terlihat (gaya global `:focus-visible`), tidak ada `outline-none` yang menghilangkan fokus.

Belum diverifikasi: urutan fokus dan perilaku Escape pada menu peran dan modal, pembaca layar sungguhan, mode kontras tinggi, dan pengumuman perubahan fase sesi.

## 3. Tampilan 360 px

Beranda bergulir horizontal di 360 px (scrollWidth 371) dan 320 px. Penyebab: lebar logo 141 + jarak 24 + aksi 186 + padding 32 = 383 px, lebih besar dari lebar layar. Diperbaiki di akarnya (logo lebih kecil di bawah `sm`, jarak dan padding tombol dikurangi), tanpa `overflow-x:hidden`. Halaman lain sudah lolos. `npm run check:layout` kini memeriksa sekitar 19 tampilan di 9 lebar (320 sampai 1920 px) dan berjalan di CI; sudah dibuktikan gagal pada kode lama. Fase 7 (hasil akhir) belum tercakup karena tombol finalisasi rubrik belum terjangkau oleh skrip.

Catatan: stepper 8 fase memakai wadah gulir horizontal sendiri (`min-w-260`) di dalam kartu. Itu gulir yang disengaja di dalam komponen, bukan gulir halaman.

## 4. File besar dan ukuran bundle

- `AssessmentSession.tsx` (1.170 baris) memuat tujuh fase, form, rubrik, dan radar dalam satu komponen. Disarankan dipecah per fase, tetapi **tidak dilakukan** di sini: belum ada tes komponen, dan memecahnya tanpa jaring pengaman melanggar prinsip mode aman.
- Bundle satu chunk 975 kB karena Recharts, motion, dan qrcode ikut dimuat di awal. Opsi lanjutan: `React.lazy` untuk `SkillTrendChart`, `PassportView`, dan `CompanyProfile`.

## 5. Bug dan kerapihan lain

- `tsconfig.json` belum `strict` meski README menyebutnya. `tsc --strict` ternyata sudah lolos, jadi diaktifkan.
- `lint` hanya alias typecheck. ESLint belum ditambahkan agar tidak membuka ratusan temuan di luar cakupan ini.
- `tsconfig.json` memuat sisa konfigurasi (`experimentalDecorators`, `allowJs`, `paths "@/*"`) yang tidak dipakai.
- `CustomTooltip` di `SkillTrendChart` memakai `any`, dan didefinisikan di dalam komponen sehingga dibuat ulang tiap render.
- README lama menyebut "0 pelanggaran axe" dan "tidak ada overflow di 390, 768, 1440 px". Klaim 360 px sebelumnya salah (lihat bagian 3).
- `DECISIONS.md` menyebut "8 fase" sedangkan README menyebut "7 fase"; kode memakai fase 0 sampai 7 (delapan langkah, tujuh setelah persiapan).
