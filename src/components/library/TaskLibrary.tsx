/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BaseTask, TaskVariation } from '../../types/adaptiv';
import { SEED_BASE_TASK, SEED_VARIATION_A, SEED_VARIATION_B } from '../../data/seedData';
import { 
  BookOpen, 
  CheckCircle2, 
  Sliders, 
  Sparkles, 
  FileCheck2, 
  Layers, 
  AlertCircle,
  HelpCircle,
  Plus
} from 'lucide-react';

import { CircuitVisualizer } from '../circuit/CircuitVisualizer';

export const TaskLibrary: React.FC = () => {
  const [selectedVariation, setSelectedVariation] = useState<TaskVariation>(SEED_VARIATION_A);
  const [activeChecklist, setActiveChecklist] = useState(SEED_VARIATION_A.equivalenceChecklist);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-[#E3E8F8] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#3F55F0]/10 text-[#3F55F0]">
              Pustaka Kompetensi &amp; Tugas
            </span>
            <span className="text-xs text-[#5B6585]">
              Kurikulum Vokasi SMK TITL
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#0F1B4A] mt-1">
            Instalasi Penerangan Listrik Rumah Tinggal
          </h2>
          <p className="text-xs text-[#5B6585] mt-0.5">
            1 Tugas Dasar Terstandar dengan 2 Variasi Kondisi Lapangan Siap Uji.
          </p>
        </div>

        <button className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#3F55F0] hover:bg-[#2A38B8] text-white text-xs font-semibold transition-colors shadow-xs">
          <Plus className="w-4 h-4" />
          Tambah Variasi Tugas Baru
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Base Task Details */}
        <div className="p-6 rounded-3xl bg-white border border-[#E3E8F8] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#0F1B4A] uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#3F55F0]" />
              Tugas Dasar (Baseline)
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
              Terverifikasi SOP
            </span>
          </div>

          <h3 className="text-base font-bold text-[#0F1B4A]">
            {SEED_BASE_TASK.title}
          </h3>
          <p className="text-xs text-[#5B6585] leading-relaxed">
            {SEED_BASE_TASK.objective}
          </p>

          <div className="space-y-3 pt-2">
            <div className="text-xs">
              <span className="font-bold text-[#0F1B4A] block mb-1">Kriteria Keberhasilan:</span>
              <ul className="space-y-1.5 text-[#5B6585]">
                {SEED_BASE_TASK.successCriteria.map((c, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-xs pt-2 border-t border-[#E3E8F8]">
              <span className="font-bold text-[#0F1B4A] block mb-1">Estimasi Durasi:</span>
              <span className="font-mono text-[#3F55F0] font-semibold">{SEED_BASE_TASK.estMinutes} Menit</span>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Task Variations & Equivalence Checker */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Variation Selector Tabs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedVariation(SEED_VARIATION_A);
                setActiveChecklist(SEED_VARIATION_A.equivalenceChecklist);
              }}
              className={`flex-1 p-4 rounded-2xl border text-left transition-all ${
                selectedVariation.id === SEED_VARIATION_A.id
                  ? 'bg-white border-[#3F55F0] shadow-md ring-2 ring-[#3F55F0]/20'
                  : 'bg-white border-[#E3E8F8] hover:border-[#3F55F0]/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#3F55F0]">
                  Variasi A • Spesifikasi Kendali
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  Diff: Level 3/5
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#0F1B4A]">
                Saklar Tukar 2 Titik Kendali (Hotel Switch)
              </h4>
            </button>

            <button
              onClick={() => {
                setSelectedVariation(SEED_VARIATION_B);
                setActiveChecklist(SEED_VARIATION_B.equivalenceChecklist);
              }}
              className={`flex-1 p-4 rounded-2xl border text-left transition-all ${
                selectedVariation.id === SEED_VARIATION_B.id
                  ? 'bg-white border-[#3F55F0] shadow-md ring-2 ring-[#3F55F0]/20'
                  : 'bg-white border-[#E3E8F8] hover:border-[#3F55F0]/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                  Variasi B • Beban Daya
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                  Diff: Level 4/5
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#0F1B4A]">
                Beban Sorot Halogen 1500W &amp; Upgrade MCB
              </h4>
            </button>
          </div>

          {/* Active Variation Card Details */}
          <div className="p-6 rounded-3xl bg-white border border-[#E3E8F8] shadow-xs space-y-5">
            <div>
              <span className="text-xs font-semibold text-[#3F55F0] uppercase tracking-wider">
                Kondisi yang Diubah
              </span>
              <h3 className="text-lg font-bold text-[#0F1B4A] mt-1">
                {selectedVariation.changedCondition}
              </h3>
              <p className="text-xs text-[#5B6585] mt-1">
                <strong>Alasan Relevansi Industri:</strong> {selectedVariation.relevanceReason}
              </p>
            </div>

            {/* Equivalence Checklist (Daftar Periksa Kesetaraan Tugas) */}
            <div className="p-4 rounded-2xl bg-[#F6F8FF] border border-[#E3E8F8] space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#0F1B4A] uppercase tracking-wider flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 text-[#16A34A]" />
                  Pemeriksa Kesetaraan Tugas (Task Equivalence Checklist)
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Lolos Validasi Penilai Sejawat
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[#0F1B4A]">
                <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-[#E3E8F8]">
                  <input
                    type="checkbox"
                    checked={activeChecklist.singleConditionChanged}
                    readOnly
                    className="rounded text-[#3F55F0]"
                  />
                  <span>Tepat 1 kondisi yang diubah (Isolasi variabel)</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-[#E3E8F8]">
                  <input
                    type="checkbox"
                    checked={activeChecklist.brandIndependent}
                    readOnly
                    className="rounded text-[#3F55F0]"
                  />
                  <span>Bebas dari keakraban merek alat tertentu</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-[#E3E8F8]">
                  <input
                    type="checkbox"
                    checked={activeChecklist.timeProportional}
                    readOnly
                    className="rounded text-[#3F55F0]"
                  />
                  <span>Waktu pengerjaan sepadan (~30 menit)</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-[#E3E8F8]">
                  <input
                    type="checkbox"
                    checked={activeChecklist.materialsReadilyAvailable}
                    readOnly
                    className="rounded text-[#3F55F0]"
                  />
                  <span>Bahan tersedia siap pakai di bengkel SMK</span>
                </label>
              </div>

              <div className="text-[11px] text-[#5B6585] pt-1">
                Ditinjau &amp; disahkan oleh: <span className="font-semibold text-[#0F1B4A]">{selectedVariation.reviewedBy}</span>
              </div>
            </div>

            {/* Hints in Variation */}
            <div>
              <h4 className="text-xs font-bold text-[#0F1B4A] uppercase tracking-wider mb-2">
                Petunjuk Bertingkat Terintegrasi (3 Tingkat)
              </h4>
              <div className="space-y-2">
                {selectedVariation.hints.map((h) => (
                  <div key={h.id} className="p-3 rounded-xl bg-[#F6F8FF] border border-[#E3E8F8] flex items-start gap-3 text-xs">
                    <span className="font-bold text-[#3F55F0] shrink-0">Tingkat {h.level}:</span>
                    <div className="flex-1 text-[#0F1B4A]">{h.text}</div>
                    <span className="text-[10px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded shrink-0">
                      -{h.penalty} Kemandirian
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Embedded Interactive Circuit Visualizer for Evaluators */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-[#0F1B4A] uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-[#3F55F0]" />
                Simulasi Verifikasi Diagram Skematik Sirkuit
              </span>
              <span className="text-[11px] text-[#5B6585]">
                Interaktif • Aliran Arus Real-time
              </span>
            </div>
            <CircuitVisualizer 
              mode="compact" 
              initialState={selectedVariation.id === SEED_VARIATION_A.id ? 'variation' : 'base'} 
            />
          </div>

        </div>

      </div>

    </div>
  );
};
