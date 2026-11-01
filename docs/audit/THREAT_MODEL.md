# Model Ancaman Singkat

**Sifat proyek:** SPA statis (Vite + React 19 + TS + Tailwind 4). Tidak ada backend, DB, autentikasi, atau pemanggilan jaringan di `src/` (diverifikasi grep: tanpa `fetch`, `process.env`, `import.meta.env`, `innerHTML`, `eval`, `localStorage`). Data berasal dari `src/data/seedData.ts`.

**Aset berharga:** integritas merek/aset publik; kredensial Gemini bila nanti ditambahkan (`.env.example`); rantai pasok dependensi.

**Titik masuk:** input form di UI (state klien), URL aset statis, dependensi npm, build/rilis.

**Batas kepercayaan:** browser pengguna ↔ host statis. Tidak ada batas server saat ini.

| # | Ancaman | Status |
|---|---------|--------|
| 1 | Secret ter-bundle ke klien bila `GEMINI_API_KEY` dipakai di frontend | Tidak ada pemakaian saat ini; dicatat sebagai risiko masa depan |
| 2 | Dependensi tak terpakai (`express`, `dotenv`, `@google/genai`) memperluas permukaan supply chain | Dievaluasi di Fase 1/2 |
| 3 | Kerentanan dependensi (audit) | Dijalankan di Fase 1 |
| 4 | Aset yang dirujuk lewat `/src/...` rusak di build produksi | Dievaluasi di Fase 3 |
| 5 | Tanpa CSP/header keamanan di host | Bergantung host; masuk MANUAL_ACTIONS |
| 6 | Font dari Google Fonts (pihak ketiga, tanpa SRI) | Dicatat |
| 7 | Kode verifikasi paspor hanya data seed (bukan verifikasi nyata) | Risiko produk bila dipakai nyata |
| 8 | Dokumen internal (prompt master) ada di `public/` sehingga terpublikasi | Dipindah di Fase 2 |

**Lingkungan uji:** Node v25.2.1, npm; bun tidak terpasang. Browser headless belum dicek.
