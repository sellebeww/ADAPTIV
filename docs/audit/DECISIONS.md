# Keputusan (otonom, mudah dibatalkan)

1. **Repo Git lokal baru** (bukan repo sebelumnya): commit `baseline` di `main`, kerja di `chore/audit-20261030`. Tanpa remote/push.
2. **Foto dipindah dari `src/assets/images/` ke `public/images/`** dan diberi nama deskriptif. Alasan: kode merujuk `/src/assets/...` yang hanya jalan di dev, bukan di build produksi. Alternatif ditolak: `import` modul (butuh build untuk memverifikasi, tidak bisa dijalankan di sini).
3. **Duplikat logo** `public/assets/aistudio/Adaptiv_Dynamic_Arrow_Logo_*.png` dihapus (`git rm`); identik byte-per-byte (`cmp`) dengan `public/brand/adaptiv-logo.png`, tanpa referensi.
4. **Prompt master** dipindah dari `public/assets/aistudio/` ke `docs/reference/prompt-master-adaptiv.md` agar tidak ikut terpublikasi.
5. **`vocational_student_circuit_*.jpg` dibiarkan** di `src/assets/images/` (tidak dirujuk, tapi bisa aset yang disiapkan): keputusan Anda.
6. **Dependensi tak terpakai TIDAK dihapus** (`express`, `dotenv`, `@google/genai`, `autoprefixer`, `esbuild`, `tsx`, `@types/express`): lockfile (`bun.lock`) tidak bisa diperbarui tanpa jaringan/bun. Lihat MANUAL_ACTIONS.
7. `package.json`: nama `react-example` menjadi `adaptiv`; skrip `clean` tak lagi menghapus `server.js` (tidak ada); tambah `typecheck`.
8. `index.css`: tambah `:focus-visible` dan `prefers-reduced-motion`.
9. `.env.example` diganti: variabel lama tidak dibaca kode apa pun.
