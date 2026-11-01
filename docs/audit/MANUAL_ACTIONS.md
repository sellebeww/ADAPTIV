# Yang harus kamu lakukan

1. **[Memblokir rilis] Jalankan install, typecheck, dan build di mesin dengan internet** (~5 menit).
   `npm install && npm run typecheck && npm run build`, lalu `npm audit`.
   Laporkan balik: error tipe/build (jika ada) dan hasil audit. Pastikan dua foto di `/images/...` tampil.
2. **Hapus dependensi tak terpakai** (~2 menit), setelah #1 lulus:
   `bun remove express dotenv @google/genai autoprefixer esbuild tsx @types/express` (atau `npm uninstall ...`), commit lockfile. Bukti tak terpakai: grep di `src/`, `index.html`, `vite.config.ts` kosong. `metadata.json` mengisyaratkan rencana Gemini sisi-server; hapus hanya jika itu dibatalkan.
3. **Pilih satu package manager** (bun atau npm). Repo hanya punya `bun.lock`.
4. **Putuskan nasib** `src/assets/images/vocational_student_circuit_*.jpg` (tidak dipakai, ~870 KB).
5. **Header keamanan di host** (CSP, HSTS, X-Content-Type-Options, frame-ancestors): atur di platform deploy.
6. Opsional: kompres `public/brand/adaptiv-logo.png` (1,0 MB, og:image) dan foto ~0,8-1 MB; butuh alat gambar + cek visual.
