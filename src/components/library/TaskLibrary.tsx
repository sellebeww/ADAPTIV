/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { ChangeCategory, TaskVariation } from '../../types/adaptiv';
import { SEED_BASE_TASK, SEED_VARIATION_A, SEED_VARIATION_B } from '../../data/seedData';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  FileCheck2,
  GitBranch,
  Layers,
  Lightbulb,
  Plus,
  Sliders,
  ShieldCheck,
  Wrench,
  Package,
  X
} from 'lucide-react';

import { CircuitVisualizer } from '../circuit/CircuitVisualizer';

const CATEGORY_LABEL: Record<ChangeCategory, string> = {
  bahan: 'Bahan',
  alat: 'Alat',
  ukuran: 'Ukuran',
  beban: 'Beban Daya',
  waktu: 'Waktu Kerja',
  spesifikasi: 'Spesifikasi Kendali',
  lingkungan: 'Lingkungan',
  kegagalan_komponen: 'Kegagalan Komponen'
};

const ACCENTS = ['#3F55F0', '#B45309', '#0E9F6E', '#9333EA', '#DB2777', '#0891B2'];

interface Item {
  v: TaskVariation;
  title: string;
}

const SEEDS: Item[] = [
  { v: SEED_VARIATION_A, title: 'Saklar Tukar 2 Titik Kendali (Hotel Switch)' },
  { v: SEED_VARIATION_B, title: 'Beban Sorot Halogen 1500W & Upgrade MCB' }
];

const CHECKS = [
  { key: 'singleConditionChanged', label: 'Tepat 1 kondisi yang diubah', hint: 'Isolasi variabel, tidak ada perubahan kedua.' },
  { key: 'brandIndependent', label: 'Bebas dari merek alat tertentu', hint: 'Hasil tidak bergantung keakraban dengan satu merek.' },
  { key: 'timeProportional', label: 'Waktu pengerjaan sepadan', hint: 'Sekitar 30 menit, setara tugas dasar.' },
  { key: 'materialsReadilyAvailable', label: 'Bahan siap pakai di bengkel', hint: 'Tersedia di bengkel SMK tanpa pengadaan khusus.' }
] as const;

const HINT_TONE = ['bg-emerald-50 text-emerald-700 border-emerald-200', 'bg-amber-50 text-amber-700 border-amber-200', 'bg-red-50 text-red-700 border-red-200'];


const HINT_PENALTY = [0.2, 0.4, 0.8];
const HINT_TITLE = ['Pertanyaan Pemandu (Tingkat 1)', 'Petunjuk Arah Diagram (Tingkat 2)', 'Contoh Langkah Konkret (Tingkat 3)'];

const FIELD = 'w-full rounded-xl border border-[#E3E8F8] bg-[#F6F8FF] px-3.5 py-2.5 text-sm text-[#0F1B4A] focus:bg-white focus:border-[#3F55F0] focus:outline-hidden';

const VariationModal: React.FC<{ onClose: () => void; onSave: (item: Item) => void }> = ({ onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [condition, setCondition] = useState('');
  const [category, setCategory] = useState<ChangeCategory>('spesifikasi');
  const [difficulty, setDifficulty] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [relevance, setRelevance] = useState('');
  const [hints, setHints] = useState(['', '', '']);
  const [checks, setChecks] = useState({
    singleConditionChanged: true,
    brandIndependent: true,
    timeProportional: true,
    materialsReadilyAvailable: true
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // `required` accepts whitespace-only text; flag it with the native validation message
  const noBlank = (set: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.setCustomValidity(e.target.value && !e.target.value.trim() ? 'Isian tidak boleh hanya spasi.' : '');
    set(e.target.value);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `var-custom-${Date.now()}`;
    onSave({
      title: title.trim(),
      v: {
        id,
        baseTaskId: SEED_BASE_TASK.id,
        changedCondition: condition.trim(),
        changeCategory: category,
        difficulty,
        relevanceReason: relevance.trim(),
        expectedPrediction: '',
        hints: hints
          .map((text, i) => ({ id: `${id}-h${i + 1}`, level: (i + 1) as 1 | 2 | 3, levelTitle: HINT_TITLE[i], penalty: HINT_PENALTY[i], text: text.trim() }))
          .filter((h) => h.text),
        equivalenceChecklist: checks,
        status: 'draft'
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center overflow-y-auto bg-[#0F1B4A]/50 backdrop-blur-sm p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form
        onSubmit={submit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="var-modal-title"
        className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-[#E3E8F8] p-6 sm:p-8 space-y-5 my-auto"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 id="var-modal-title" className="text-lg font-bold text-[#0F1B4A]">Tambah Variasi Tugas Baru</h3>
            <p className="text-xs text-[#5B6585] mt-1">Variasi baru tersimpan sebagai draf sampai ditinjau penilai sejawat.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Tutup" className="p-2 -m-2 rounded-full text-[#5B6585] hover:bg-[#F6F8FF]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <label className="block space-y-1.5">
          <span className="text-xs font-bold text-[#0F1B4A]">Judul singkat</span>
          <input required autoFocus value={title} onChange={noBlank(setTitle)} placeholder="Contoh: Kabel NYA diganti NYM 3x1.5" className={FIELD} />
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs font-bold text-[#0F1B4A]">Kondisi yang diubah (tepat satu)</span>
          <textarea required rows={3} value={condition} onChange={noBlank(setCondition)} placeholder="Jelaskan satu kondisi yang berubah dari tugas dasar." className={FIELD} />
        </label>

        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block space-y-1.5">
            <span className="text-xs font-bold text-[#0F1B4A]">Kategori perubahan</span>
            <select value={category} onChange={(e) => setCategory(e.target.value as ChangeCategory)} className={FIELD}>
              {(Object.keys(CATEGORY_LABEL) as ChangeCategory[]).map((c) => (
                <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>
              ))}
            </select>
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-bold text-[#0F1B4A]">Tingkat kesulitan: {difficulty}/5</span>
            <input type="range" min={1} max={5} value={difficulty} onChange={(e) => setDifficulty(Number(e.target.value) as 1 | 2 | 3 | 4 | 5)} className="w-full accent-[#3F55F0] mt-2" />
          </label>
        </div>

        <label className="block space-y-1.5">
          <span className="text-xs font-bold text-[#0F1B4A]">Alasan relevansi industri</span>
          <textarea required rows={2} value={relevance} onChange={noBlank(setRelevance)} placeholder="Mengapa perubahan ini sering terjadi di dunia kerja?" className={FIELD} />
        </label>

        <fieldset className="space-y-2">
          <legend className="text-xs font-bold text-[#0F1B4A] mb-1">Petunjuk bertingkat (opsional)</legend>
          {hints.map((h, i) => (
            <input key={i} value={h} onChange={(e) => setHints(hints.map((x, j) => (j === i ? e.target.value : x)))} placeholder={HINT_TITLE[i]} className={FIELD} />
          ))}
        </fieldset>

        <fieldset className="space-y-2">
          <legend className="text-xs font-bold text-[#0F1B4A] mb-1">Pemeriksaan kesetaraan</legend>
          <div className="grid sm:grid-cols-2 gap-2">
            {CHECKS.map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2.5 rounded-xl border border-[#E3E8F8] bg-[#F6F8FF] px-3.5 py-2.5 text-sm text-[#0F1B4A] cursor-pointer">
                <input type="checkbox" checked={checks[key]} onChange={(e) => setChecks({ ...checks, [key]: e.target.checked })} className="accent-[#3F55F0] w-4 h-4" />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-[#E3E8F8] text-sm font-semibold text-[#0F1B4A] hover:bg-[#F6F8FF]">Batal</button>
          <button type="submit" className="px-5 py-2.5 rounded-xl bg-[#3F55F0] hover:bg-[#2A38B8] text-white text-sm font-semibold shadow-xs">Simpan Variasi</button>
        </div>
      </form>
    </div>
  );
};

export const TaskLibrary: React.FC = () => {
  const [items, setItems] = useState<Item[]>(SEEDS);
  const [selectedId, setSelectedId] = useState(SEED_VARIATION_A.id);
  const [modalOpen, setModalOpen] = useState(false);
  const activeIdx = Math.max(0, items.findIndex((x) => x.v.id === selectedId));
  const selectedVariation = items[activeIdx].v;
  const accent = ACCENTS[activeIdx % ACCENTS.length];
  const checklist = selectedVariation.equivalenceChecklist;
  const passed = CHECKS.filter((c) => checklist[c.key]).length;

  const saveVariation = (item: Item) => {
    setItems((prev) => [...prev, item]);
    setSelectedId(item.v.id);
    setModalOpen(false);
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F1B4A] via-[#1E2888] to-[#3F55F0] p-6 sm:p-10 text-white shadow-lg shadow-[#3F55F0]/20">
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-[#4A8BFF]/30 blur-3xl" />
        <div className="relative flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-2xl space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur">Pustaka Kompetensi &amp; Tugas</span>
              <span className="text-xs text-white/70">Kurikulum Vokasi SMK TITL</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">Instalasi Penerangan Listrik Rumah Tinggal</h2>
            <p className="text-sm text-white/75 leading-relaxed">
              Satu tugas dasar terstandar dengan variasi kondisi lapangan yang siap diuji, masing-masing
              memiliki status pemeriksaan kesetaraan tugasnya sendiri.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center gap-3">
            <dl className="grid grid-cols-3 gap-3">
              {[
                { k: 'Tugas Dasar', v: '1' },
                { k: 'Variasi', v: String(items.length) },
                { k: 'Durasi', v: `${SEED_BASE_TASK.estMinutes}'` }
              ].map((s) => (
                <div key={s.k} className="rounded-2xl bg-white/10 px-4 py-3 text-center backdrop-blur">
                  <dd className="text-2xl font-extrabold leading-none">{s.v}</dd>
                  <dt className="mt-1.5 text-xs text-white/70">{s.k}</dt>
                </div>
              ))}
            </dl>
            <button onClick={() => setModalOpen(true)} className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-[#2A38B8] hover:bg-[#EEF2FF] text-sm font-bold transition-colors shadow-xs">
              <Plus className="w-4 h-4" />
              Tambah Variasi Baru
            </button>
          </div>
        </div>
      </div>

      {/* Variation selector */}
      <div role="tablist" aria-label="Pilih variasi tugas" className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map(({ v, title }, idx) => {
          const on = v.id === selectedId;
          const color = ACCENTS[idx % ACCENTS.length];
          return (
            <button
              key={v.id}
              role="tab"
              aria-selected={on}
              onClick={() => setSelectedId(v.id)}
              style={on ? { borderColor: color, boxShadow: `0 0 0 3px ${color}22` } : undefined}
              className={`group flex items-start gap-4 p-5 rounded-2xl border bg-white text-left transition-all ${
                on ? 'shadow-md' : 'border-[#E3E8F8] hover:border-[#B9C3EE] hover:shadow-sm'
              }`}
            >
              <span className="w-11 h-11 rounded-xl grid place-items-center shrink-0" style={{ background: `${color}1A`, color }}>
                <GitBranch className="w-5 h-5" />
              </span>
              <span className="flex-1 min-w-0">
                <span className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color }}>
                    Variasi {String.fromCharCode(65 + idx)} · {CATEGORY_LABEL[v.changeCategory]}
                  </span>
                  <span className="flex items-center gap-1.5">
                    {v.status === 'draft' && <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">Draf</span>}
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F1F4FF] text-[#3B4670]">Tingkat {v.difficulty}/5</span>
                  </span>
                </span>
                <span className="block mt-2 text-base font-bold leading-snug text-[#0F1B4A]">{title}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left: base task, sticky so the column never leaves dead space */}
        <aside className="lg:col-span-5 lg:sticky lg:top-24 rounded-3xl bg-white border border-[#E3E8F8] shadow-xs p-6 sm:p-7 space-y-6">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-bold text-[#0F1B4A] uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#3F55F0]" />
              Tugas Dasar
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              Terverifikasi SOP
            </span>
          </div>

          <div className="space-y-2.5">
            <h3 className="text-lg font-bold leading-snug text-[#0F1B4A]">{SEED_BASE_TASK.title}</h3>
            <p className="text-sm text-[#5B6585] leading-relaxed">{SEED_BASE_TASK.objective}</p>
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3F55F0]">
              <Clock className="w-3.5 h-3.5" />
              Estimasi {SEED_BASE_TASK.estMinutes} menit
            </p>
          </div>

          <section className="space-y-3">
            <h4 className="text-xs font-bold text-[#0F1B4A] uppercase tracking-wider">Kriteria Keberhasilan</h4>
            <ul className="space-y-3">
              {SEED_BASE_TASK.successCriteria.map((c, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[#3B4670] leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-1" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-3 pt-6 border-t border-[#E3E8F8]">
            <h4 className="text-xs font-bold text-[#0F1B4A] uppercase tracking-wider flex items-center gap-2">
              <Package className="w-4 h-4 text-[#3F55F0]" />
              Bahan
            </h4>
            <ul className="flex flex-wrap gap-2">
              {SEED_BASE_TASK.materials.map((m) => (
                <li key={m} className="px-3 py-1.5 rounded-lg bg-[#F6F8FF] border border-[#E3E8F8] text-xs text-[#3B4670] leading-snug">{m}</li>
              ))}
            </ul>
          </section>

          <section className="space-y-3">
            <h4 className="text-xs font-bold text-[#0F1B4A] uppercase tracking-wider flex items-center gap-2">
              <Wrench className="w-4 h-4 text-[#3F55F0]" />
              Alat
            </h4>
            <ul className="flex flex-wrap gap-2">
              {SEED_BASE_TASK.tools.map((t) => (
                <li key={t} className="px-3 py-1.5 rounded-lg bg-[#F6F8FF] border border-[#E3E8F8] text-xs text-[#3B4670] leading-snug">{t}</li>
              ))}
            </ul>
          </section>
        </aside>

        {/* Right */}
        <div className="lg:col-span-7 space-y-8">

          {/* Changed condition */}
          <section className="rounded-3xl bg-white border border-[#E3E8F8] shadow-xs p-6 sm:p-7 space-y-5">
            <div className="space-y-3">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider" style={{ background: `${accent}1A`, color: accent }}>
                Kondisi yang Diubah
              </span>
              <h3 className="text-xl font-bold leading-snug text-[#0F1B4A]">{selectedVariation.changedCondition}</h3>
            </div>
            <div className="flex items-start gap-3 rounded-2xl bg-[#F6F8FF] border border-[#E3E8F8] p-4">
              <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-sm text-[#3B4670] leading-relaxed">
                <strong className="text-[#0F1B4A]">Relevansi industri.</strong> {selectedVariation.relevanceReason}
              </p>
            </div>
          </section>

          {/* Equivalence checker */}
          <section className="rounded-3xl bg-white border border-[#E3E8F8] shadow-xs p-6 sm:p-7 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="flex items-start gap-3.5">
                <span className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 grid place-items-center shrink-0">
                  <FileCheck2 className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-[#0F1B4A]">Pemeriksa Kesetaraan Tugas</h3>
                  <p className="text-xs text-[#5B6585] mt-1 leading-relaxed">Task Equivalence Checklist, memastikan variasi adil dibandingkan tugas dasar.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <p className="text-2xl font-extrabold leading-none text-[#0F1B4A]">{passed}/{CHECKS.length}</p>
                  <p className="text-xs text-[#5B6585] mt-1">kriteria lolos</p>
                </div>
                <svg viewBox="0 0 44 44" className="w-12 h-12 -rotate-90" aria-hidden>
                  <circle cx="22" cy="22" r="18" fill="none" stroke="#E3E8F8" strokeWidth="5" />
                  <circle
                    cx="22" cy="22" r="18" fill="none" stroke="#16A34A" strokeWidth="5" strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 18}
                    strokeDashoffset={2 * Math.PI * 18 * (1 - passed / CHECKS.length)}
                  />
                </svg>
              </div>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CHECKS.map(({ key, label, hint }) => {
                const ok = checklist[key];
                return (
                  <li
                    key={key}
                    className={`flex items-start gap-3 rounded-2xl border p-4 ${ok ? 'bg-emerald-50/60 border-emerald-200' : 'bg-[#F6F8FF] border-[#E3E8F8]'}`}
                  >
                    {ok ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-5 h-5 text-[#9AA5C8] shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="text-sm font-bold leading-snug text-[#0F1B4A]">{label}</p>
                      <p className="text-xs text-[#5B6585] mt-1 leading-relaxed">{hint}</p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-5 border-t border-[#E3E8F8] text-xs text-[#5B6585]">
              <span>
                {selectedVariation.reviewedBy ? (
                  <>Ditinjau dan disahkan oleh <span className="font-semibold text-[#0F1B4A]">{selectedVariation.reviewedBy}</span></>
                ) : (
                  'Belum ditinjau penilai sejawat'
                )}
              </span>
              {selectedVariation.reviewedBy ? (
                <span className="inline-flex items-center gap-1.5 font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Lolos Validasi Penilai Sejawat
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800">Draf, menunggu tinjauan</span>
              )}
            </div>
          </section>

          {/* Hints */}
          <section className="rounded-3xl bg-white border border-[#E3E8F8] shadow-xs p-6 sm:p-7 space-y-5">
            <div>
              <h3 className="text-base font-bold text-[#0F1B4A] flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#3F55F0]" />
                Petunjuk Bertingkat
              </h3>
              <p className="text-xs text-[#5B6585] mt-1">Semakin dalam petunjuk dibuka, semakin besar pengurangan skor Kemandirian.</p>
            </div>
            {selectedVariation.hints.length === 0 && <p className="text-sm text-[#5B6585]">Belum ada petunjuk untuk variasi ini.</p>}
            <ol className="space-y-4">
              {selectedVariation.hints.map((h, i) => (
                <li key={h.id} className="flex items-start gap-4">
                  <span className="w-9 h-9 rounded-full bg-[#3F55F0] text-white text-sm font-bold grid place-items-center shrink-0">{h.level}</span>
                  <div className="flex-1 rounded-2xl bg-[#F6F8FF] border border-[#E3E8F8] p-4 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-bold text-[#0F1B4A]">{h.levelTitle}</p>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${HINT_TONE[i] ?? HINT_TONE[2]}`}>
                        -{h.penalty} Kemandirian
                      </span>
                    </div>
                    <p className="text-sm text-[#3B4670] leading-relaxed">{h.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Circuit visualizer */}
          <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 px-1">
              <h3 className="text-sm font-bold text-[#0F1B4A] flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#3F55F0]" />
                Simulasi Verifikasi Diagram Sirkuit
              </h3>
              <span className="text-xs text-[#5B6585]">Interaktif, aliran arus real-time</span>
            </div>
            <CircuitVisualizer
              mode="compact"
              key={selectedVariation.id}
              initialState={selectedVariation.id === SEED_VARIATION_B.id ? 'base' : 'variation'}
            />
          </section>

        </div>
      </div>
      {modalOpen && <VariationModal onClose={() => setModalOpen(false)} onSave={saveVariation} />}
    </div>
  );
};
