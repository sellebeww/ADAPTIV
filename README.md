# Adaptiv

Platform penilaian kemampuan beradaptasi vokasi & keterampilan kerja dinamis.
SPA statis: Vite + React 19 + TypeScript + Tailwind 4. Data contoh ada di `src/data/seedData.ts`.

## Prasyarat
Node.js 20+ dan npm (atau Bun; lockfile bawaan repo adalah `bun.lock`).

## Perintah
| Perintah | Fungsi |
|---|---|
| `npm install` | pasang dependensi |
| `npm run dev` | server dev di http://localhost:3000 |
| `npm run typecheck` / `npm run lint` | pemeriksaan tipe (`tsc --noEmit`) |
| `npm run build` | build produksi ke `dist/` |
| `npm run preview` | pratinjau hasil build |

## Struktur
- `src/components/` komponen per fitur (admin, assessment, brand, circuit, company, industry, layout, library, passport)
- `src/data/`, `src/types/`, `src/utils/` data seed, tipe, logika skor
- `public/brand/` logo & ikon, `public/images/` foto
- `docs/` dokumentasi; `docs/audit/` laporan audit

## Variabel lingkungan
Belum ada yang dipakai. Lihat `.env.example`.
