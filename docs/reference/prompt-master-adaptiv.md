Prompt Master Pembuatan Aplikasi Adaptiv
Salin seluruh isi dokumen ini ke AI pembuat aplikasi (Claude Code, Cursor, Lovable, Bolt, dan sejenisnya). Dokumen ini ditulis sebagai satu instruksi utuh: konsep, merek, peran pengguna, fitur, basis data, API, tampilan, aturan penilaian, keamanan, dan urutan pengerjaan.
1. PERAN DAN TUJUAN
Kamu adalah tim senior full-stack (product engineer, backend engineer, UI/UX engineer, QA). Bangun aplikasi web lengkap bernama Adaptiv, platform penilaian yang membuktikan apakah seseorang benar-benar bisa menyesuaikan keterampilan ketika kondisi tugas berubah, bukan sekadar mengulang demonstrasi.
Aturan kerja:
• Tulis kode produksi yang rapi, bertipe (TypeScript), bisa dijalankan, dan diberi komentar seperlunya.
• Jangan memakai data palsu yang tidak ditandai. Semua data contoh masuk ke file seed.
• Semua teks antarmuka berbahasa Indonesia yang jelas dan ramah untuk siswa SMK. Siapkan struktur i18n agar bahasa Inggris bisa ditambah kelak.
• Kerjakan bertahap sesuai Bagian 15, dan setelah tiap tahap pastikan aplikasi berjalan sebelum lanjut.
• Jika ada keputusan yang belum ditentukan di dokumen ini, pilih opsi paling sederhana yang aman, lalu catat di DECISIONS.md.
2. MASALAH DAN KONSEP INTI
Masalah: portofolio, sertifikat, video praktik, dan ujian tugas tetap bisa menunjukkan hasil bagus, tetapi tidak membuktikan kemampuan menghadapi variasi pekerjaan nyata.
Solusi: peserta menyelesaikan satu tugas dasar. Penilai lalu mengubah satu kondisi relevan. Peserta harus (1) memprediksi akibat perubahan, (2) menyesuaikan pekerjaan, dan (3) mengevaluasi hasilnya. Aplikasi menghasilkan bukti kemampuan beradaptasi sekaligus batas kemampuan peserta.
Pembeda: yang dinilai adalah proses berpikir saat situasi berubah, bukan hanya keberhasilan mengulang prosedur. Dasar konseptualnya adalah dynamic assessment dan pengujian transfer ke konteks baru.
Pengguna:
1. Siswa SMK dan peserta pelatihan vokasi (Peserta)
2. Guru produktif, instruktur, dan pembimbing (Penilai)
3. Perusahaan penerima magang (Mitra Industri)
4. Admin lembaga (SMK, BLK, LPK)
5. Admin platform (Super Admin)
3. IDENTITAS MEREK (WAJIB DIIKUTI)
Logo resmi sudah diunggah sebagai Adaptiv_Dynamic_Arrow_Logo.png. Simpan di /public/brand/adaptiv-logo.png. Pakai file ini apa adanya di halaman login, landing, email, dan PDF sertifikat. Buat juga turunan: favicon (huruf A saja, dipotong dari logo), versi horizontal, dan versi satu warna putih untuk latar gelap.
Deskripsi logo: huruf A tebal berwarna biru indigo dengan sudut membulat, dilewati panah melengkung biru muda yang naik ke kanan atas (melambangkan penyesuaian dan perkembangan). Wordmark "Adaptiv" memakai sans-serif geometris membulat berwarna navy gelap, dengan titik pada huruf i berwarna biru muda.
Palet warna (jadikan design token Tailwind):
• brand-indigo: #3F55F0 (primer, tombol utama, huruf A)
• brand-sky: #4A8BFF (aksen, panah, tautan, titik pada i)
• brand-navy: #0F1B4A (teks utama, judul)
• brand-indigo-dark: #2A38B8 (hover dan bayangan)
• Netral: putih #FFFFFF, #F6F8FF (latar bagian), #E3E8F8 (garis), #5B6585 (teks sekunder)
• Status: sukses #16A34A, peringatan #F59E0B, bahaya #DC2626, info = brand-sky
Tipografi: Plus Jakarta Sans (judul dan isi), JetBrains Mono (angka skor dan kode). Sudut membulat besar (radius 12 sampai 20 px), bayangan lembut, banyak ruang putih.
Gaya antarmuka: modern, bersih, ramah, dan mobile-first. Motif panah melengkung dipakai sebagai elemen visual (garis penghubung antar-fase, animasi progres, ilustrasi kosong). Mode gelap disediakan. Kontras warna memenuhi WCAG AA.
Nada tulisan: hangat, jelas, memotivasi, tidak menghakimi. Contoh: "Situasi berubah. Ayo lihat bagaimana kamu menyesuaikan."
4. TEKNOLOGI (STACK)
Frontend
• Next.js 14+ (App Router) dengan TypeScript ketat
• Tailwind CSS + shadcn/ui + lucide-react
• TanStack Query untuk data server, Zustand untuk status UI lokal
• React Hook Form + Zod untuk formulir dan validasi
• Recharts untuk grafik, Framer Motion untuk animasi halus
• PWA (bisa dipasang di ponsel, tampilan tetap berfungsi dengan koneksi lemah)
Backend
• NestJS (Node.js, TypeScript) dengan arsitektur modular, REST API, dokumentasi OpenAPI/Swagger
• PostgreSQL 15+ dengan Prisma ORM dan migrasi
• Redis untuk sesi, antrean, dan rate limiting; BullMQ untuk pekerjaan latar (PDF, email, analitik)
• Penyimpanan berkas kompatibel S3 (MinIO untuk lokal) untuk foto, video, dan dokumen bukti
• Socket.io untuk sesi penilaian langsung (waktu nyata)
• Autentikasi JWT (access 15 menit + refresh token dalam cookie httpOnly), hash kata sandi argon2
• Email via SMTP (Nodemailer) dengan templat berlogo Adaptiv
Infrastruktur
• Docker Compose (web, api, postgres, redis, minio, mailhog)
• Variabel lingkungan di .env.example lengkap
• GitHub Actions: lint, tes, build
• Monorepo (pnpm workspace): apps/web, apps/api, packages/shared (tipe, skema Zod, konstanta)
5. PERAN DAN HAK AKSES (RBAC)
Peran
Dapat melakukan
Peserta
Mengerjakan sesi, mengunggah bukti, menulis prediksi dan refleksi, melihat hasil dan paspor kemampuan sendiri, membagikan tautan bukti
Penilai
Membuat dan memimpin sesi, memilih variasi, mengubah kondisi, mengisi rubrik, memberi umpan balik, melihat peserta bimbingannya
Mitra Industri
Melihat paspor kemampuan peserta yang memberi izin, membuat permintaan variasi dari kondisi kerja nyata, memberi validasi tugas baru
Admin Lembaga
Mengelola pengguna, kelas, kompetensi, paket lisensi, dan laporan lembaga
Super Admin
Mengelola semua lembaga, lisensi, templat kompetensi global, dan audit
Terapkan pengecekan hak akses di backend (guard) dan di frontend (menu dan tombol tersembunyi). Setiap data terikat ke institution_id (multi-tenant) dan tidak boleh bocor antar-lembaga.
6. ALUR UTAMA SESI PENILAIAN
Satu Sesi Adaptiv melalui fase berurutan. Tiap fase punya status, batas waktu opsional, dan jejak waktu.
1. Fase 0 – Persiapan. Penilai membuat sesi: pilih kompetensi, peserta, tugas dasar, dan variasi cadangan. Peserta menerima undangan dan membaca instruksi, alat yang boleh dipakai, serta aturan.
2. Fase 1 – Tugas Dasar. Peserta mengerjakan tugas standar dan mengunggah bukti (foto, video, berkas, ukuran, catatan). Penilai mengisi rubrik dasar. Ini menetapkan garis awal kemampuan.
3. Fase 2 – Perubahan Kondisi. Penilai mengubah tepat satu kondisi (misalnya bahan, alat, ukuran, beban, batas waktu, spesifikasi pelanggan). Perubahan ditampilkan ke peserta dengan jelas, bergaya kartu "Situasi berubah" dengan animasi panah.
4. Fase 3 – Prediksi. Sebelum bertindak, peserta menulis atau merekam suara: apa yang akan berubah, risikonya, dan rencana penyesuaian. Jawaban dikunci setelah dikirim, lalu dicap waktu.
5. Fase 4 – Penyesuaian. Peserta mengerjakan tugas variasi dan mengunggah bukti baru. Peserta boleh meminta petunjuk bertingkat (lihat Bagian 7.6); tiap petunjuk memengaruhi skor.
6. Fase 5 – Evaluasi Diri. Peserta membandingkan prediksi dengan kenyataan, menjelaskan hasil, apa yang berhasil, apa yang meleset, dan apa yang akan dilakukan berbeda.
7. Fase 6 – Penilaian dan Umpan Balik. Penilai mengisi rubrik adaptasi, memberi komentar, dan menetapkan tingkat kemampuan. Sistem menghitung Indeks Adaptasi dan membuat Paspor Kemampuan.
8. Fase 7 – Tindak Lanjut. Sistem menyarankan latihan berikutnya sesuai batas kemampuan yang terlihat.
7. FITUR DETAIL PER MODUL
7.1 Autentikasi dan Akun
• Daftar dengan undangan (tautan dari lembaga) atau kode kelas. Masuk dengan email atau NISN + kata sandi.
• Lupa dan atur ulang kata sandi lewat email. Verifikasi email.
• Profil: foto, nama, jurusan, kelas, lembaga, bio singkat, bahasa.
• Pengaturan privasi: pilih siapa yang boleh melihat paspor (hanya saya, pembimbing, perusahaan tertentu, publik via tautan).
• Pembatasan percobaan masuk (rate limit), sesi perangkat, dan keluar dari semua perangkat.
7.2 Manajemen Lembaga (Admin Lembaga)
• Impor pengguna massal dari CSV (templat bisa diunduh, ada pratinjau dan laporan galat per baris).
• Kelola kelas, angkatan, jurusan, dan penugasan penilai ke peserta.
• Dasbor lembaga: jumlah sesi, rata-rata Indeks Adaptasi per kompetensi, peserta yang perlu perhatian, tren bulanan.
• Lisensi dan paket: lihat kuota sesi, tanggal berakhir, riwayat tagihan.
7.3 Pustaka Kompetensi dan Tugas
• Kompetensi: nama, jurusan, deskripsi, tingkat (dasar, menengah, lanjut), dan daftar indikator.
• Tugas dasar: judul, tujuan, instruksi langkah, bahan dan alat, kriteria keberhasilan, estimasi waktu, lampiran gambar atau gambar teknik.
• Variasi tugas: terhubung ke tugas dasar, dengan kolom wajib: kondisi yang diubah (satu saja), kategori perubahan (bahan, alat, ukuran, beban, waktu, spesifikasi, lingkungan, kegagalan komponen), tingkat kesulitan (1 sampai 5), alasan relevansi dunia kerja, hasil yang diharapkan dari prediksi, dan catatan kesetaraan.
• Pemeriksa kesetaraan tugas: formulir daftar periksa (Apakah hanya satu kondisi berubah? Apakah tidak bergantung pada merek alat tertentu? Apakah waktu sepadan? Apakah bahan tersedia?). Variasi baru hanya bisa dipublikasikan setelah lolos daftar periksa dan ditinjau satu penilai lain.
• Versi (versioning) tugas: perubahan tidak merusak sesi yang sudah berjalan.
• Templat kompetensi global dari Super Admin yang bisa disalin ke lembaga.
7.4 Pembuatan dan Pelaksanaan Sesi (Penilai)
• Wizard tiga langkah: pilih kompetensi, pilih peserta (satu atau satu kelas), pilih tugas dasar dan satu sampai tiga variasi.
• Ruang Kendali Penilai (tampilan waktu nyata): garis waktu fase, penghitung waktu, bukti masuk, tombol "Terapkan perubahan kondisi", tombol jeda dan lanjut, catatan pengamatan cepat dengan cap waktu, dan penanda kejadian (misalnya "peserta salah ukur", "minta petunjuk").
• Mode pengamatan luring: catatan dan skor tersimpan lokal lalu disinkronkan saat daring.
• Penilai tidak boleh mengubah lebih dari satu kondisi per variasi (validasi di sistem).
• Penilaian ganda opsional: penilai kedua mengisi rubrik secara terpisah untuk mengukur kesepakatan antar-penilai.
7.5 Ruang Kerja Peserta
• Beranda: sesi yang akan datang, sesi berjalan, hasil terakhir, dan ringkasan paspor.
• Layar fase berurutan dengan langkah yang jelas dan penghubung panah melengkung antar-fase.
• Pengunggahan bukti: foto (kompresi di sisi klien), video pendek (maks 2 menit, 100 MB), berkas PDF, rekaman suara, dan catatan teks. Tampilkan progres dan percobaan ulang bila koneksi putus.
• Formulir prediksi terstruktur: "Apa yang berubah?", "Apa akibat yang kamu perkirakan?" (pilih kategori + teks), "Apa risiko terbesar?", "Apa rencana penyesuaianmu?", dan "Seberapa yakin kamu?" (skala 1 sampai 5). Tingkat keyakinan dipakai untuk mengukur kalibrasi diri.
• Formulir evaluasi: perbandingan prediksi dan hasil nyata, bagian yang berhasil dan meleset, serta rencana perbaikan.
• Penyimpanan otomatis draf setiap beberapa detik.
7.6 Petunjuk Bertingkat
• Tiga tingkat: (1) pertanyaan pemandu, (2) petunjuk arah, (3) contoh langkah. Penilai menulis isi petunjuk saat membuat variasi.
• Setiap petunjuk yang dibuka tercatat dan mengurangi sub-skor kemandirian sesuai bobot yang bisa diatur lembaga. Peserta melihat peringatan sebelum membukanya.
7.7 Rubrik dan Penilaian
Rubrik default memiliki lima dimensi, masing-masing berskala 0 sampai 4 dengan deskriptor perilaku di setiap angka:
1. Ketepatan Prediksi – seberapa sesuai perkiraan akibat dengan kenyataan.
2. Kualitas Penyesuaian – apakah langkah penyesuaian logis, aman, dan efisien.
3. Hasil Kerja pada Variasi – mutu hasil akhir terhadap kriteria keberhasilan.
4. Kemandirian – seberapa sedikit petunjuk dan bantuan yang dibutuhkan.
5. Evaluasi Diri – kejujuran dan ketajaman refleksi, termasuk mengenali batas kemampuan.
Rumus Indeks Adaptasi (0 sampai 100), dapat dikonfigurasi per lembaga: IA = 100 x (0.20*Prediksi + 0.30*Penyesuaian + 0.25*Hasil + 0.15*Kemandirian + 0.10*Evaluasi) / 4
Tambahan metrik:
• Selisih Transfer = skor tugas dasar dikurangi skor variasi (menunjukkan seberapa turun kemampuan saat kondisi berubah).
• Kalibrasi Diri = selisih antara tingkat keyakinan peserta dan hasil sebenarnya.
• Tingkat Adaptasi: Tergantung Prosedur (IA < 40), Berkembang (40 sampai 59), Cakap Beradaptasi (60 sampai 79), Mahir Beradaptasi (80 ke atas).
• Batas Kemampuan: sistem menandai kategori perubahan (bahan, alat, dst.) tempat skor peserta paling rendah.
• Penilai wajib mengisi alasan tertulis untuk skor 0 dan 4.
7.8 Paspor Kemampuan (Output Utama)
• Halaman profil bukti: daftar kompetensi, Tingkat Adaptasi, grafik radar lima dimensi, tren dari waktu ke waktu, dan peta batas kemampuan (kategori perubahan yang sudah dikuasai dan yang belum).
• Setiap entri bisa dibuka untuk melihat bukti asli (foto, video, prediksi, refleksi) dan komentar penilai.
• Ekspor sebagai PDF berlogo Adaptiv dengan kode QR dan nomor verifikasi unik.
• Halaman verifikasi publik adaptiv.id/verifikasi/{kode} yang menampilkan keaslian tanpa data sensitif.
• Tautan berbagi dengan masa berlaku dan opsi cabut.
7.9 Portal Mitra Industri
• Daftar peserta magang dengan izin akses, filter berdasarkan kompetensi dan Tingkat Adaptasi.
• Formulir Permintaan Variasi: perusahaan menuliskan situasi kerja nyata yang sering berubah, dan lembaga bisa mengubahnya menjadi variasi tugas.
• Validasi lapangan: setelah magang, perusahaan memberi penilaian singkat kinerja peserta pada tugas baru di tempat kerja (skala yang sama). Data ini dipakai untuk validasi pada Bagian 11.
7.10 Analitik dan Validasi
• Dasbor lembaga: distribusi Tingkat Adaptasi, kategori perubahan tersulit, perbandingan antarkelas, dan tren.
• Laporan kesesuaian (validitas prediktif): korelasi (Pearson dan Spearman) antara Indeks Adaptasi dan skor kinerja pada tugas baru yang tidak pernah dipakai dalam sesi. Tampilkan diagram sebar dan koefisien.
• Kesepakatan antar-penilai: Cohen's kappa berbobot dan ICC untuk sesi yang dinilai ganda.
• Analisis kesetaraan tugas: bandingkan rata-rata skor antar-variasi pada kompetensi yang sama; tandai variasi yang terlalu sulit (rata-rata rendah dengan sebaran sempit) atau yang mengukur pengalaman dengan alat tertentu (skor berbeda tajam antar-kelompok pengguna alat).
• Ekspor CSV dan PDF laporan.
7.11 Notifikasi
• Dalam aplikasi, email, dan (opsional) tautan WhatsApp: undangan sesi, pengingat tenggat, bukti diunggah, hasil siap, permintaan validasi dari perusahaan.
• Preferensi notifikasi per pengguna.
7.12 Penagihan dan Lisensi
• Dua model: Lisensi Lembaga (tahunan, kuota peserta) dan Paket Penilaian (kuota sesi, sekali beli).
• Halaman paket, penggunaan kuota, dan faktur PDF. Integrasikan gateway pembayaran Indonesia (Midtrans atau Xendit) lewat antarmuka yang bisa dipasang-lepas; untuk MVP cukup status pembayaran manual oleh Super Admin.
7.13 Log Audit
• Catat siapa mengubah apa dan kapan: perubahan skor, kondisi, izin, penghapusan. Log tidak bisa diedit.
8. MODEL DATA (PostgreSQL, Prisma)
Semua tabel punya id (UUID), created_at, updated_at, dan institution_id bila relevan. Gunakan soft delete (deleted_at) untuk data penilaian.
• institutions: name, type (SMK, BLK, LPK, perusahaan), npsn, address, logo_url, plan_id, license_expires_at
• users: institution_id, role, name, email, nisn, password_hash, avatar_url, locale, email_verified_at, last_login_at
• classes: institution_id, name, major, year; class_members: class_id, user_id
• mentor_assignments: mentor_id, participant_id, class_id
• competencies: institution_id (null = global), name, major, level, description; competency_indicators: competency_id, text, order
• base_tasks: competency_id, title, objective, instructions (JSON langkah), materials, tools, success_criteria (JSON), est_minutes, version, status
• task_variations: base_task_id, changed_condition, change_category (enum), difficulty (1 sampai 5), relevance_reason, expected_prediction, equivalence_checklist (JSON), status (draft, ditinjau, terbit), reviewed_by, version
• hints: variation_id, level (1 sampai 3), text
• rubrics: institution_id, name, weights (JSON); rubric_dimensions: rubric_id, key, label, descriptors (JSON 0 sampai 4)
• sessions: institution_id, participant_id, assessor_id, second_assessor_id, base_task_id, variation_id, rubric_id, status, current_phase, scheduled_at, started_at, finished_at
• session_phases: session_id, phase, started_at, submitted_at, locked (boolean)
• evidence: session_id, phase, type (foto, video, berkas, audio, catatan), storage_key, mime, size, note, measured_values (JSON)
• predictions: session_id, change_summary, expected_effects (JSON), main_risk, plan, confidence (1 sampai 5), locked_at
• reflections: session_id, outcome_vs_prediction, worked, missed, next_time
• hint_usages: session_id, hint_id, opened_at
• observations: session_id, assessor_id, text, tag, occurred_at
• scores: session_id, assessor_id, stage (dasar, variasi), dimension_key, value (0 sampai 4), rationale
• results: session_id, adaptation_index, transfer_gap, calibration, level, weakest_category, computed_at
• passports: participant_id, public_code, visibility, share_expires_at; passport_entries: passport_id, result_id
• industry_links: company_id, participant_id, consent_at, revoked_at
• variation_requests: company_id, description, status, linked_variation_id
• field_validations: participant_id, company_id, task_description, score (0 sampai 4 per dimensi), notes, validated_at
• notifications, audit_logs, plans, subscriptions, invoices
Buat indeks pada institution_id, participant_id, session_id, dan kolom filter yang sering dipakai.
9. API (REST, prefiks /api/v1)
Semua respons memakai format { data, meta, error }. Validasi dengan Zod/class-validator, paginasi ?page=&limit=, urutan ?sort=, dan kode galat yang konsisten.
• Auth: POST /auth/register, /auth/login, /auth/refresh, /auth/logout, /auth/forgot, /auth/reset, GET /auth/me
• Pengguna dan lembaga: GET/POST/PATCH/DELETE /users, POST /users/import (CSV), GET/PATCH /institutions/:id, GET/POST /classes, POST /classes/:id/members
• Kompetensi dan tugas: GET/POST/PATCH /competencies, GET/POST/PATCH /base-tasks, GET/POST/PATCH /variations, POST /variations/:id/review, POST /variations/:id/publish, GET/POST /rubrics
• Sesi: GET/POST /sessions, GET /sessions/:id, POST /sessions/:id/start, POST /sessions/:id/apply-change (menerapkan variasi, hanya sekali), POST /sessions/:id/phases/:phase/submit, POST /sessions/:id/pause, POST /sessions/:id/finish
• Bukti: POST /sessions/:id/evidence/presign (URL unggah bertanda tangan), POST /sessions/:id/evidence, DELETE /evidence/:id
• Isi peserta: PUT /sessions/:id/prediction (terkunci setelah submit), PUT /sessions/:id/reflection, POST /sessions/:id/hints/:hintId/open
• Penilai: POST /sessions/:id/observations, PUT /sessions/:id/scores, POST /sessions/:id/compute-result
• Paspor: GET /passports/me, GET /passports/:participantId, POST /passports/share, DELETE /passports/share/:id, GET /passports/:participantId/pdf, GET /public/verify/:code
• Mitra: GET /industry/participants, POST /industry/variation-requests, POST /industry/field-validations
• Analitik: GET /analytics/overview, /analytics/validity, /analytics/inter-rater, /analytics/task-equivalence, GET /analytics/export
• Lainnya: GET /notifications, PATCH /notifications/:id/read, GET /audit-logs, GET /billing/plan, GET /billing/invoices
Socket.io (namespace /sessions): kejadian phase:changed, change:applied, evidence:added, timer:tick, observation:added, presence. Pastikan hanya penilai dan peserta pada sesi itu yang bisa bergabung ke ruangnya.
Logika bisnis penting (wajib diuji):
• Perubahan kondisi hanya sekali per sesi, dan hanya ketika fase Tugas Dasar sudah diserahkan.
• Prediksi tidak bisa diubah setelah dikunci, dan cap waktunya harus lebih awal daripada bukti fase Penyesuaian pertama.
• Perhitungan Indeks Adaptasi, Selisih Transfer, dan Kalibrasi dijalankan di layanan terpisah yang mudah diuji.
• Variasi tidak bisa terbit tanpa lolos daftar periksa kesetaraan dan peninjauan penilai lain.
10. DAFTAR HALAMAN DAN TAMPILAN
Publik: Beranda pemasaran (hero dengan logo, penjelasan alur "Dasar, Berubah, Prediksi, Sesuaikan, Evaluasi", fitur, untuk siapa, harga, FAQ, kontak), Masuk, Daftar, Lupa Kata Sandi, Verifikasi Paspor.
Peserta: Beranda, Daftar Sesi, Ruang Sesi (per fase), Hasil Sesi, Paspor Kemampuan, Pengaturan Privasi, Profil.
Penilai: Beranda, Peserta Bimbingan, Buat Sesi (wizard), Ruang Kendali Penilai, Formulir Rubrik, Pustaka Tugas dan Variasi, Peninjauan Variasi, Laporan.
Mitra Industri: Daftar Peserta, Detail Paspor, Permintaan Variasi, Validasi Lapangan.
Admin Lembaga: Dasbor, Pengguna dan Impor, Kelas, Kompetensi, Rubrik, Analitik Validasi, Lisensi dan Tagihan, Log Audit.
Super Admin: Lembaga, Templat Global, Lisensi, Pemantauan Sistem.
Komponen UI khusus: kartu "Situasi Berubah" (animasi panah melengkung), penghubung fase (stepper bertema panah), radar lima dimensi, peta batas kemampuan, pemutar bukti (foto, video, audio), editor rubrik, tabel dengan filter, dan keadaan kosong berilustrasi.
Aksesibilitas dan performa: navigasi keyboard, label ARIA, dukungan pembaca layar, ukuran sentuh minimal 44 px, skor Lighthouse di atas 90 pada halaman utama, gambar dimuat malas, dan tampilan nyaman di ponsel 360 px.
11. VALIDASI DAN KUALITAS PENILAIAN
Bangun fitur yang memudahkan lembaga membuktikan bahwa penilaian Adaptiv benar-benar bermakna:
• Bandingkan Indeks Adaptasi dengan kinerja peserta pada tugas baru (diamati langsung di bengkel atau oleh perusahaan magang).
• Bandingkan hasil dengan pengamatan langsung penilai independen.
• Periksa kesetaraan tugas antarvariasi dan hindari variasi yang hanya mengukur keakraban dengan alat tertentu (tandai bila skor berbeda tajam antar-kelompok alat).
• Tampilkan peringatan bila variasi terlalu sulit (misalnya lebih dari 70 persen peserta mendapat skor 0 atau 1 pada Kualitas Penyesuaian).
12. KEAMANAN DAN PRIVASI
• Patuhi UU Pelindungan Data Pribadi (UU PDP). Siswa di bawah 18 tahun: persetujuan lembaga atau wali dicatat. Tampilkan persetujuan eksplisit sebelum perusahaan boleh melihat paspor.
• Validasi masukan di server, sanitasi teks, batasi tipe dan ukuran berkas, pindai ekstensi, dan simpan berkas di penyimpanan privat dengan URL bertanda tangan yang kedaluwarsa.
• Rate limiting, proteksi CSRF, header keamanan (Helmet), CORS ketat, dan log galat tanpa data pribadi.
• Enkripsi saat transit (HTTPS) dan data sensitif saat disimpan. Cadangan basis data harian.
• Fitur ekspor dan penghapusan data pribadi atas permintaan pengguna.
• Tidak ada pelacak pihak ketiga pada ruang sesi.
13. PENGUJIAN
• Tes unit untuk perhitungan skor, aturan fase, dan hak akses.
• Tes integrasi API (Jest + Supertest) untuk alur penuh satu sesi dari Fase 0 sampai 7.
• Tes end-to-end (Playwright) untuk: masuk sebagai penilai, buat sesi, masuk sebagai peserta, selesaikan seluruh fase, lihat paspor.
• Tes tampilan responsif dan aksesibilitas (axe).
• Cakupan minimal 70 persen pada modul penilaian.
14. DATA CONTOH (SEED) UNTUK MVP
MVP hanya memuat satu kompetensi, dua variasi, dan penilai manusia. Seed:
• Lembaga: SMK Contoh Nusantara. Pengguna: 1 admin, 2 penilai, 10 peserta, 1 mitra industri.
• Kompetensi: Instalasi Penerangan Listrik Rumah Tinggal (jurusan Teknik Instalasi Tenaga Listrik).
• Tugas dasar: merakit dan menguji satu rangkaian saklar tunggal dengan satu lampu pada papan latihan, lengkap dengan kriteria keselamatan (MCB, pembumian, polaritas).
• Variasi A (kategori: spesifikasi): rangkaian diubah menjadi saklar tukar (dua titik kendali) untuk lampu yang sama.
• Variasi B (kategori: beban): lampu pijar diganti beban lebih besar sehingga rating pengaman dan penampang kabel harus ditinjau ulang.
• Isi deskriptor rubrik 0 sampai 4 untuk lima dimensi, tiga petunjuk bertingkat per variasi, dan satu sesi contoh yang sudah selesai agar dasbor tidak kosong.
Susun kode agar kompetensi lain (otomotif, tata boga, TKJ, akuntansi, dan seterusnya) cukup ditambah lewat data tanpa mengubah kode.
15. URUTAN PENGERJAAN (MILESTONE)
1. Fondasi: monorepo, Docker Compose, tema merek (token warna, font, logo), autentikasi, RBAC, multi-tenant.
2. Pustaka: kompetensi, tugas dasar, variasi, rubrik, pemeriksa kesetaraan, peninjauan.
3. Mesin sesi: fase, status, penguncian prediksi, penerapan perubahan kondisi, unggah bukti, socket waktu nyata.
4. Penilaian: formulir rubrik, perhitungan Indeks Adaptasi dan metrik, hasil sesi.
5. Paspor Kemampuan: halaman, grafik, PDF berlogo, QR, verifikasi publik.
6. Portal Mitra dan Admin Lembaga: impor CSV, dasbor, permintaan variasi, validasi lapangan.
7. Analitik validasi: korelasi, kesepakatan antar-penilai, kesetaraan tugas.
8. Pelengkap: notifikasi, lisensi dan tagihan, log audit, PWA, halaman pemasaran.
9. Penyelesaian: pengujian, optimasi performa dan aksesibilitas, dokumentasi.
16. KRITERIA SELESAI
• Satu sesi penuh bisa dijalankan dari awal sampai Paspor Kemampuan tanpa galat.
• Logo dan palet Adaptiv tampil konsisten di seluruh antarmuka, email, dan PDF.
• Hak akses dan isolasi antar-lembaga lolos pengujian.
• docker compose up menjalankan seluruh sistem, dengan seed yang bisa dimuat satu perintah.
• Tersedia README.md (cara menjalankan, struktur, variabel lingkungan), DECISIONS.md, dokumentasi OpenAPI, dan panduan singkat untuk peserta, penilai, dan admin.
17. HASIL AKHIR YANG DIMINTA
Serahkan: seluruh kode sumber (web, api, shared), skema Prisma dan migrasi, file seed, Docker Compose, .env.example, tes, dokumentasi, dan ringkasan singkat di akhir tiap milestone yang menjelaskan apa yang sudah selesai, cara mencobanya, dan apa yang belum. Mulai dari Milestone 1 dan lanjutkan berurutan.