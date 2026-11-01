# Laporan Audit (parsial, tanpa build)

**Ringkasan:** proyek SPA statis kecil, tanpa backend/secret/sink XSS. Aset yang dirujuk lewat `/src/...` (rusak di produksi) diperbaiki, duplikat 1 MB dan dokumen internal dikeluarkan dari `public/`. Lint/typecheck/test/build **[TIDAK DIUJI]**: registry npm tidak terjangkau (`curl` timeout 10 dtk).

| Temuan | Keparahan | Lokasi | Status |
|---|---|---|---|
| Path foto `/src/assets/...` gagal di build produksi | Sedang | CompanyProfile.tsx:220,600 | Diperbaiki, **[TIDAK DIUJI]** build |
| Prompt master terpublikasi di `public/` | Rendah | public/assets/aistudio | Dipindah ke docs/ |
| Dependensi tak terpakai (express, dotenv, @google/genai, dll.) | Rendah | package.json | Keputusan manual |
| Tanpa header keamanan / CSP | Info | host | Manual |
| Secret | - | seluruh src, public, config | Tidak ada ditemukan (regex api key/secret/token/AIza/sk-, 0 hasil) |
| XSS/eval/localStorage/fetch | - | src | 0 hasil grep |

**Aksesibilitas:** 9/9 `<img>` punya `alt`; tak ada div/span ber-onClick; ditambah `:focus-visible` dan `prefers-reduced-motion`. Hanya 1 `aria-label` dari 84 `<button>`: perlu tinjauan visual manual **[TIDAK DIUJI]**.

**Tidak dilakukan:** audit dependensi, uji responsif/kontras, refactor file besar (AssessmentSession 1083 baris), red-team pass penuh.

