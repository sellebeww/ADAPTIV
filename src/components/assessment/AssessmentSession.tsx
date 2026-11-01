/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  AssessmentPhase,
  AssessmentSession as SessionType,
  UserRole,
  RubricDimensionScore,
} from '../../types/adaptiv';
import {
  computeSessionResult,
  RUBRIC_DIMENSIONS,
  calculateAdaptationIndex,
} from '../../utils/scoring';
import {
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Lock,
  Upload,
  FileCheck,
  Clock,
  Lightbulb,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AssessmentSessionProps {
  session: SessionType;
  onUpdateSession: (updated: SessionType) => void;
  currentRole: UserRole;
  onViewPassport: () => void;
  onResetSession?: () => void;
  onSwitchRole?: (role: UserRole) => void;
}

export const AssessmentSession: React.FC<AssessmentSessionProps> = ({
  session,
  onUpdateSession,
  currentRole,
  onViewPassport,
  onResetSession,
  onSwitchRole
}) => {
  const [activeHintModal, setActiveHintModal] = useState<string | null>(null);
  // Highest phase reached; the stepper never jumps past it so a session cannot skip to the passport without a result.
  const [furthest, setFurthest] = useState<number>(session.currentPhase);
  const reached = Math.max(furthest, session.currentPhase);

  const ROLE_FOR: Partial<Record<number, { role: UserRole; label: string }>> = {
    3: { role: 'peserta', label: 'Siswa SMK (Peserta)' },
    5: { role: 'peserta', label: 'Siswa SMK (Peserta)' },
    6: { role: 'penilai', label: 'Guru Produktif (Penilai)' }
  };
  const locked = (phase: number) => {
    const need = ROLE_FOR[phase];
    return !!need && currentRole !== need.role && currentRole !== 'super_admin';
  };
  const RoleNotice: React.FC<{ phase: number }> = ({ phase }) => {
    const need = ROLE_FOR[phase];
    if (!need || !locked(phase)) return null;
    return (
      <div role="status" className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-sm text-amber-900">
        <span>Fase ini diisi oleh <strong>{need.label}</strong>. Peran aktif saat ini hanya bisa melihat.</span>
        {onSwitchRole && (
          <button type="button" onClick={() => onSwitchRole(need.role)} className="shrink-0 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold">
            Ganti ke peran ini
          </button>
        )}
      </div>
    );
  };
  
  // Prediction Form State
  const [changeSummary, setChangeSummary] = useState(
    session.prediction?.changeSummary || 
    'Sirkuit kendali diubah dari saklar tunggal 1 titik menjadi saklar tukar (SPDT) 2 titik kendali untuk lampu yang sama.'
  );
  const [mainRisk, setMainRisk] = useState(
    session.prediction?.mainRisk || 
    'Tertukarnya kawat terminal common dengan strapping terminal yang memicu hubung singkat atau lampu hanya menyala di satu sisi.'
  );
  const [plan, setPlan] = useState(
    session.prediction?.plan || 
    '1. Putus suplai daya di MCB. 2. Tarik dua kawat strapping 1.5mm². 3. Ganti fiting/saklar ke unit SPDT. 4. Uji kontinuitas tanpa tegangan.'
  );
  const [confidence, setConfidence] = useState<number>(session.prediction?.confidence || 4);

  // Reflection Form State
  const [reflectionOutcome, setReflectionOutcome] = useState(
    session.reflection?.outcomeVsPrediction || 
    'Lampu berhasil dikendalikan dari kedua saklar tukar secara independen sesuai prediksi awal.'
  );
  const [reflectionWorked, setReflectionWorked] = useState(
    session.reflection?.worked || 
    'Pemasangan dua kabel strapping dan penguncian baut terminal berjalan tanpa trip pengaman.'
  );
  const [reflectionMissed, setReflectionMissed] = useState(
    session.reflection?.missed || 
    'Sempat terjadi gesekan isolasi kawat saat ditarik ke pipa konduit yang penuh.'
  );
  const [reflectionNextTime, setReflectionNextTime] = useState(
    session.reflection?.nextTime || 
    'Akan menggunakan kawat pancing dan pelumas kabel khusus instalatur listrik.'
  );

  // Rubric Scores State (for Assessor)
  const [currentScores, setCurrentScores] = useState<RubricDimensionScore[]>(
    session.scores || [
      { key: 'prediksi', label: 'Ketepatan Prediksi', weight: 0.20, score: 3, rationale: 'Prediksi alur strapping kawat sangat tepat.' },
      { key: 'penyesuaian', label: 'Kualitas Penyesuaian', weight: 0.30, score: 4, rationale: 'Pengerjaan rapi sesuai standar PUIL 2020.' },
      { key: 'hasil', label: 'Hasil Kerja Variasi', weight: 0.25, score: 3, rationale: 'Kedua titik kendali berfungsi prima.' },
      { key: 'kemandirian', label: 'Kemandirian', weight: 0.15, score: 3, rationale: 'Hanya menggunakan 1 pertanyaan pemandu.' },
      { key: 'evaluasi', label: 'Evaluasi Diri', weight: 0.10, score: 4, rationale: 'Refleksi tajam pada hambatan penarikan kawat.' }
    ]
  );

  const phasesList: { phase: AssessmentPhase; label: string }[] = [
    { phase: 0, label: '0. Persiapan' },
    { phase: 1, label: '1. Tugas Dasar' },
    { phase: 2, label: '2. Situasi Berubah' },
    { phase: 3, label: '3. Prediksi' },
    { phase: 4, label: '4. Penyesuaian' },
    { phase: 5, label: '5. Evaluasi Diri' },
    { phase: 6, label: '6. Penilaian Rubrik' },
    { phase: 7, label: '7. Paspor Siap' }
  ];

  const handleNextPhase = () => {
    if (session.currentPhase < 7) {
      const nextPhase = (session.currentPhase + 1) as AssessmentPhase;
      setFurthest((f) => Math.max(f, nextPhase));
      onUpdateSession({
        ...session,
        currentPhase: nextPhase,
        status: nextPhase === 7 ? 'selesai' : 'berjalan'
      });
    }
  };

  const predictionIncomplete = [changeSummary, mainRisk, plan].some((v) => !v.trim());
  const reflectionIncomplete = [reflectionOutcome, reflectionWorked, reflectionMissed, reflectionNextTime].some((v) => !v.trim());

  const handleLockPrediction = () => {
    if (predictionIncomplete) return;
    const updatedPrediction = {
      changeSummary,
      expectedEffects: [
        { category: 'Sirkuit', description: 'Memerlukan 2 titik saklar tukar (SPDT)' },
        { category: 'Kabeling', description: 'Penambahan 2 kawat strapping dalam pipa konduit' }
      ],
      mainRisk,
      plan,
      confidence,
      lockedAt: new Date().toISOString()
    };
    onUpdateSession({
      ...session,
      prediction: updatedPrediction,
      currentPhase: 4
    });
    setFurthest((f) => Math.max(f, 4));
  };

  const handleOpenHint = (hintId: string) => {
    if (!session.openedHintIds.includes(hintId)) {
      onUpdateSession({
        ...session,
        openedHintIds: [...session.openedHintIds, hintId]
      });
    }
    setActiveHintModal(null);
  };

  const handleSaveReflection = () => {
    if (reflectionIncomplete) return;
    const updatedReflection = {
      outcomeVsPrediction: reflectionOutcome,
      worked: reflectionWorked,
      missed: reflectionMissed,
      nextTime: reflectionNextTime,
      submittedAt: new Date().toISOString()
    };
    onUpdateSession({
      ...session,
      reflection: updatedReflection,
      currentPhase: 6
    });
    setFurthest((f) => Math.max(f, 6));
  };

  const handleScoreChange = (index: number, newScore: number) => {
    setCurrentScores(currentScores.map((c, i) => (i === index ? { ...c, score: newScore } : c)));
  };

  const handleRationaleChange = (index: number, rationale: string) => {
    setCurrentScores(currentScores.map((c, i) => (i === index ? { ...c, rationale } : c)));
  };

  const missingRationale = currentScores.filter((c) => (c.score === 0 || c.score === 4) && !(c.rationale ?? '').trim()).length;

  const handleFinalizeEvaluation = () => {
    if (missingRationale > 0) return;
    const calculatedResult = computeSessionResult(
      currentScores,
      3.5, // Base task score baseline
      session.prediction?.confidence || confidence,
      session.variation.changeCategory
    );

    onUpdateSession({
      ...session,
      scores: currentScores,
      result: calculatedResult,
      currentPhase: 7,
      status: 'selesai'
    });
    setFurthest(7);
  };

  return (
    <div className="space-y-6">
      
      {/* Session Breadcrumb & Dynamic Arrow Stepper */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white border border-[#E3E8F8] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#E3E8F8]">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-[#3F55F0]/10 flex items-center justify-center text-[#3F55F0] font-bold text-2xl">
              TITL
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#3F55F0] uppercase tracking-wider">
                  Sesi Penilaian Adaptiv # {session.id}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#16A34A]/10 text-[#166534]">
                  {session.status.toUpperCase()}
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-[#0F1B4A]">
                {session.competency.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#5B6585]">
            <span className="font-semibold text-[#0F1B4A]">Peserta:</span> {session.participant.name} ({session.participant.class})
            <span className="mx-1">•</span>
            <span className="font-semibold text-[#0F1B4A]">Penilai:</span> {session.assessor.name}
          </div>
        </div>

        {/* 8-Phase Visual Flow Connected by Dynamic Curve Motif */}
        <div className="mt-5 overflow-x-auto px-4 pt-3 pb-5">
          <div className="flex items-start min-w-260 justify-between">
            {phasesList.map((p, idx) => {
              const isCurrent = session.currentPhase === p.phase;
              const isPassed = session.currentPhase > p.phase;
              return (
                <React.Fragment key={p.phase}>
                  <button
                    onClick={() => onUpdateSession({ ...session, currentPhase: p.phase })}
                    disabled={p.phase > reached}
                    className={`flex flex-col items-center gap-2.5 transition-all text-center focus:outline-hidden ${
                      isCurrent
                        ? 'scale-105 font-bold text-[#3F55F0]'
                        : isPassed
                        ? 'text-[#15803D] hover:text-[#0F1B4A]'
                        : 'text-[#5B6585] opacity-60'
                    } disabled:cursor-not-allowed`}
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold transition-all ${
                        isCurrent
                          ? 'bg-[#3F55F0] text-white shadow-md shadow-[#3F55F0]/30 ring-4 ring-[#4A8BFF]/20'
                          : isPassed
                          ? 'bg-[#16A34A] text-white'
                          : 'bg-[#F6F8FF] text-[#5B6585] border border-[#E3E8F8]'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-5 h-5" /> : p.phase}
                    </div>
                    <span className="text-xs whitespace-nowrap">{p.label}</span>
                  </button>
                  {idx < phasesList.length - 1 && (
                    <div className="flex-1 min-w-8 mx-3 mt-[22px] h-1 rounded-full bg-[#E3E8F8] relative overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#3F55F0] to-[#4A8BFF] transition-all duration-300"
                        style={{
                          width: session.currentPhase > p.phase ? '100%' : '0%'
                        }}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Animated Dynamic Phase Container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={session.currentPhase}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.22 }}
        >

      {/* PHASE 0: PERSIAPAN */}
      {session.currentPhase === 0 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E3E8F8] shadow-xs space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#3F55F0]/10 text-[#3F55F0]">
                Fase 0: Persiapan &amp; Garis Awal
              </span>
              <h2 className="text-xl font-bold text-[#0F1B4A] mt-2">
                {session.baseTask.title}
              </h2>
              <p className="text-sm text-[#5B6585] mt-1 max-w-2xl">
                {session.baseTask.objective}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#5B6585]">Estimasi Waktu:</span>
              <div className="text-sm font-bold text-[#0F1B4A]">
                {session.baseTask.estMinutes} Menit
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 rounded-2xl bg-[#F6F8FF] border border-[#E3E8F8]">
              <h3 className="text-sm font-bold text-[#0F1B4A] flex items-center gap-2 mb-3">
                <ShieldCheck className="w-4 h-4 text-[#3F55F0]" />
                Instruksi Langkah Standar (SOP PUIL 2020)
              </h3>
              <ul className="space-y-2 text-xs text-[#0F1B4A]">
                {session.baseTask.instructions.map((ins, i) => (
                  <li key={i} className="leading-relaxed">{ins}</li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-[#F6F8FF] border border-[#E3E8F8] space-y-4">
              <div>
                <h4 className="text-xs font-bold text-[#0F1B4A] uppercase tracking-wider mb-2">
                  Bahan &amp; Komponen yang Disiapkan
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {session.baseTask.materials.map((m, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-white border border-[#E3E8F8] text-xs text-[#0F1B4A]">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#0F1B4A] uppercase tracking-wider mb-2">
                  Alat Uji &amp; Keselamatan Kerja
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {session.baseTask.tools.map((t, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-white border border-[#E3E8F8] text-xs text-[#3F55F0] font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-[#E3E8F8]">
            <button
              onClick={handleNextPhase}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#3F55F0] hover:bg-[#2A38B8] text-white text-sm font-semibold transition-all shadow-md shadow-[#3F55F0]/20"
            >
              Mulai Tugas Dasar (Fase 1)
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* PHASE 1: TUGAS DASAR */}
      {session.currentPhase === 1 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E3E8F8] shadow-xs space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#16A34A]/10 text-[#166534]">
                Fase 1: Pengerjaan Tugas Dasar
              </span>
              <h2 className="text-xl font-bold text-[#0F1B4A] mt-2">
                Demonstrasi Prosedur Standar Perakitan
              </h2>
              <p className="text-sm text-[#5B6585] mt-1">
                Lakukan perakitan saklar tunggal &amp; 1 lampu pada papan kerja. Unggah bukti uji tahanan isolasi dan tegangan kerja.
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F6F8FF] border border-[#E3E8F8] text-xs font-semibold text-[#0F1B4A]">
              <Clock className="w-3.5 h-3.5 text-[#3F55F0]" />
              Waktu Berjalan: 18:42
            </div>
          </div>

          {/* Evidence uploaded */}
          <div className="p-5 rounded-2xl border border-[#E3E8F8] bg-[#F6F8FF] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0F1B4A] uppercase tracking-wider flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#15803D]" />
                Bukti Pengerjaan Tugas Dasar Terverifikasi
              </span>
              <span className="text-xs text-[#166534] font-semibold bg-[#16A34A]/10 px-2 py-0.5 rounded-md">
                Baseline Lulus (Skor 3.5 / 4.0)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {session.evidence.filter(e => e.phase === 1).map((ev) => (
                <div key={ev.id} className="p-3 bg-white rounded-xl border border-[#E3E8F8] flex gap-3 items-center">
                  <img
                    src={ev.url}
                    alt={ev.title}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-[#0F1B4A] truncate">{ev.title}</h5>
                    <p className="text-xs text-[#5B6585] line-clamp-1">{ev.note}</p>
                    <div className="text-xs text-[#3F55F0] font-mono mt-0.5">
                      V: 221.4V | Isolasi: &gt;100 MΩ
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-3">
            <Info className="w-5 h-5 text-amber-700 shrink-0" />
            <div>
              <strong>Garis Awal Tercapai:</strong> Peserta telah membuktikan mampu mengulang prosedur dasar dengan baik. Penilai kini dapat memicu <em>Perubahan Kondisi</em> untuk menguji adaptabilitas.
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-[#E3E8F8]">
            <button
              onClick={handleNextPhase}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#3F55F0] hover:bg-[#2A38B8] text-white text-sm font-semibold transition-all shadow-md shadow-[#3F55F0]/20"
            >
              Lanjut ke Perubahan Kondisi (Fase 2)
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* PHASE 2: PERUBAHAN KONDISI (THE SIGNATURE "SITUASI BERUBAH" CARD) */}
      {session.currentPhase === 2 && (
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#0F1B4A] via-[#1E2888] to-[#2A38B8] text-white shadow-2xl relative overflow-hidden space-y-6 border border-[#4A8BFF]/40"
        >
          
          {/* Subtle Dynamic Arrow Motif Background */}
          <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none translate-x-12 translate-y-12 animate-pulse">
            <img
              src="/brand/adaptiv-symbol-nobg.png"
              alt="Arrow Motif"
              className="w-96 h-96 object-contain"
            />
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-[#4A8BFF]">
              <Sparkles className="w-4 h-4 text-[#4A8BFF] animate-pulse" />
              Fase 2: Dynamic Assessment Trigger
            </div>
            <div className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              Validasi Sistem: Tepat 1 Kondisi Diubah
            </div>
          </div>

          {/* Card "Situasi Berubah" */}
          <div className="relative z-10 p-6 sm:p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#4A8BFF] text-[#0F1B4A] flex items-center justify-center font-black text-2xl shadow-lg">
                2
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#4A8BFF]">
                  Situasi Lapangan Berubah!
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {session.variation.changedCondition}
                </h3>
              </div>
            </div>

            <p className="text-sm text-blue-100/90 leading-relaxed max-w-3xl">
              <strong>Relevansi Dunia Kerja:</strong> {session.variation.relevanceReason}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/10 text-xs">
              <div className="p-3 rounded-xl bg-black/20">
                <span className="text-blue-200 block text-[11px] uppercase font-bold">Kategori Variasi</span>
                <span className="font-semibold text-white capitalize">{session.variation.changeCategory}</span>
              </div>
              <div className="p-3 rounded-xl bg-black/20">
                <span className="text-blue-200 block text-[11px] uppercase font-bold">Tingkat Kesulitan</span>
                <span className="font-semibold text-white">Level {session.variation.difficulty} dari 5</span>
              </div>
              <div className="p-3 rounded-xl bg-black/20">
                <span className="text-blue-200 block text-[11px] uppercase font-bold">Aturan Penilaian</span>
                <span className="font-semibold text-white">Prediksi Wajib Terkunci Dahulu</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="text-xs text-blue-200">
              <em>Ingat: Jangan langsung bertindak. Rumuskan prediksimu pada Fase 3.</em>
            </div>
            <button
              onClick={handleNextPhase}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-[#4A8BFF] hover:bg-white text-[#0F1B4A] text-sm font-bold transition-all shadow-lg shadow-[#4A8BFF]/30 hover:scale-105"
            >
              Masuk ke Lembar Prediksi (Fase 3)
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </motion.div>
      )}

      {/* PHASE 3: PREDIKSI (TERSTRUKTUR & TERKUNCI) */}
      {session.currentPhase === 3 && (
        <>
        <RoleNotice phase={3} />
        <fieldset disabled={locked(3)} className="contents min-w-0">
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E3E8F8] shadow-xs space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#3F55F0]/10 text-[#3F55F0]">
                Fase 3: Prediksi Terstruktur Sebelum Tindakan
              </span>
              <h2 className="text-xl font-bold text-[#0F1B4A] mt-2">
                Apa yang Akan Terjadi Ketika Kondisi Berubah?
              </h2>
              <p className="text-sm text-[#5B6585] mt-1">
                Jawab 4 pertanyaan metakognitif di bawah ini. Jawaban akan <strong>dikunci permanen</strong> dan dicap waktu sebelum Anda boleh menyentuh peralatan.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#F6F8FF] border border-[#E3E8F8] text-xs font-semibold text-[#3F55F0]">
              <Lock className="w-3.5 h-3.5" />
              Sistem Anti-Cheat Timestamp
            </div>
          </div>

          <div className="space-y-4">
            
            {/* 1. Apa yang berubah */}
            <div>
              <label htmlFor="as-field-0" className="block text-xs font-bold text-[#0F1B4A] uppercase tracking-wider mb-1.5">
                1. Apa saja yang berubah dari konfigurasi awal?
              </label>
              <textarea id="as-field-0"
                value={changeSummary}
                onChange={(e) => setChangeSummary(e.target.value)}
                rows={2}
                className="w-full p-3.5 rounded-2xl border border-[#E3E8F8] bg-[#F6F8FF] text-xs text-[#0F1B4A] focus:bg-white focus:border-[#3F55F0] focus:ring-2 focus:ring-[#3F55F0]/20 transition-all"
                placeholder="Jelaskan komponen dan alur sirkuit yang berubah..."
              />
            </div>

            {/* 2. Risiko Terbesar */}
            <div>
              <label htmlFor="as-field-1" className="block text-xs font-bold text-[#0F1B4A] uppercase tracking-wider mb-1.5">
                2. Apa risiko bahaya / kegagalan teknis terbesar jika salah pasang?
              </label>
              <textarea id="as-field-1"
                rows={2}
                value={mainRisk}
                onChange={(e) => setMainRisk(e.target.value)}
                className="w-full p-3.5 rounded-2xl border border-[#E3E8F8] bg-[#F6F8FF] text-xs text-[#0F1B4A] focus:bg-white focus:border-[#3F55F0] focus:ring-2 focus:ring-[#3F55F0]/20 transition-all"
                placeholder="Contoh: Korsleting fasa-nol pada terminal strapping atau lampu mati total..."
              />
            </div>

            {/* 3. Rencana Penyesuaian */}
            <div>
              <label htmlFor="as-field-2" className="block text-xs font-bold text-[#0F1B4A] uppercase tracking-wider mb-1.5">
                3. Apa rencana langkah penyesuaianmu?
              </label>
              <textarea id="as-field-2"
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                rows={3}
                className="w-full p-3.5 rounded-2xl border border-[#E3E8F8] bg-[#F6F8FF] text-xs text-[#0F1B4A] focus:bg-white focus:border-[#3F55F0] focus:ring-2 focus:ring-[#3F55F0]/20 transition-all"
                placeholder="Langkah 1, langkah 2, langkah 3..."
              />
            </div>

            {/* 4. Tingkat Keyakinan (Kalibrasi Diri) */}
            <div className="p-4 rounded-2xl bg-[#F6F8FF] border border-[#E3E8F8] space-y-2">
              <div className="flex items-center justify-between">
                <label id="lbl-keyakinan" className="text-xs font-bold text-[#0F1B4A] uppercase tracking-wider">
                  4. Seberapa yakin kamu dengan rencanamu? (Untuk mengukur Kalibrasi Diri)
                </label>
                <span className="text-xs font-extrabold text-[#3F55F0] bg-white px-2.5 py-0.5 rounded-lg border border-[#E3E8F8]">
                  Skala {confidence} / 5
                </span>
              </div>
              <div role="group" aria-labelledby="lbl-keyakinan" className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setConfidence(level)}
                    aria-pressed={confidence === level}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      confidence === level
                        ? 'bg-[#3F55F0] text-white shadow-sm'
                        : 'bg-white text-[#5B6585] border border-[#E3E8F8] hover:border-[#3F55F0]'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-[#5B6585]" aria-hidden>
                <span>1 = Ragu</span>
                <span>5 = Sangat yakin</span>
              </div>
            </div>

          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-[#E3E8F8]">
            <span className={`text-xs ${predictionIncomplete ? 'font-semibold text-[#DC2626]' : 'text-[#5B6585]'}`} role={predictionIncomplete ? 'alert' : undefined}>
              {predictionIncomplete
                ? 'Lengkapi semua isian prediksi sebelum mengunci.'
                : 'Setelah dikirim, jawaban tidak dapat disunting kembali.'}
            </span>
            <button
              onClick={handleLockPrediction}
              disabled={predictionIncomplete}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap px-6 py-3 rounded-2xl bg-[#3F55F0] hover:bg-[#2A38B8] disabled:opacity-50 disabled:hover:bg-[#3F55F0] text-white text-sm font-semibold transition-all shadow-md shadow-[#3F55F0]/20"
            >
              <Lock className="w-4 h-4" />
              Kunci &amp; Kirim Prediksi
            </button>
          </div>
        </div>
        </fieldset>
        </>
      )}

      {/* PHASE 4: PENYESUAIAN & PETUNJUK BERTINGKAT */}
      {session.currentPhase === 4 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E3E8F8] shadow-xs space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#4A8BFF]/15 text-[#3F55F0]">
                Fase 4: Eksekusi Penyesuaian Variasi Tugas
              </span>
              <h2 className="text-xl font-bold text-[#0F1B4A] mt-2">
                Lakukan Modifikasi Sirkuit di Papan Praktik
              </h2>
              <p className="text-sm text-[#5B6585] mt-1">
                Laksanakan rencana penyesuaianmu. Jika menemui jalan buntu, Anda boleh membuka <strong>Petunjuk Bertingkat</strong> (memengaruhi sub-skor kemandirian).
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-900">
                Petunjuk Terbuka: {session.openedHintIds.length} / 3
              </span>
            </div>
          </div>

          {/* Tiered Hints Accordion / Cards */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#0F1B4A] uppercase tracking-wider flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-[#F59E0B]" />
              Sistem Petunjuk Bertingkat (Tiered Scaffolding)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {session.variation.hints.map((hint) => {
                const isOpened = session.openedHintIds.includes(hint.id);
                return (
                  <div
                    key={hint.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isOpened
                        ? 'bg-amber-50/50 border-amber-200'
                        : 'bg-[#F6F8FF] border-[#E3E8F8] hover:border-[#3F55F0]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#0F1B4A]">
                        {hint.levelTitle}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white border border-[#E3E8F8] text-[#DC2626]">
                        -{hint.penalty} Kemandirian
                      </span>
                    </div>

                    {isOpened ? (
                      <p className="text-xs text-[#0F1B4A] leading-relaxed pt-1 border-t border-amber-200/60">
                        {hint.text}
                      </p>
                    ) : (
                      <div className="space-y-2 pt-1">
                        <p className="text-xs text-[#5B6585]">
                          Terkunci. Buka jika Anda membutuhkan panduan teknis.
                        </p>
                        <button
                          onClick={() => setActiveHintModal(hint.id)}
                          className="w-full py-2 px-3 rounded-xl bg-white border border-[#E3E8F8] hover:border-[#3F55F0] text-xs font-semibold text-[#3F55F0] transition-colors"
                        >
                          Buka Petunjuk Ini
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Evidence Upload Section for Variation */}
          <div className="p-5 rounded-2xl bg-[#F6F8FF] border border-[#E3E8F8] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0F1B4A] uppercase tracking-wider flex items-center gap-2">
                <Upload className="w-4 h-4 text-[#3F55F0]" />
                Bukti Pengerjaan Variasi Tugas
              </span>
              <span className="text-xs text-[#5B6585]">
                Foto/Video hasil wiring saklar tukar
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white border border-[#E3E8F8] flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80"
                  alt="Bukti Variasi"
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-[#0F1B4A] truncate">
                    Hasil Modifikasi Saklar Tukar 2 Titik
                  </div>
                  <div className="text-xs text-[#5B6585]">
                    Pengujian kontinuitas 0.02 Ω lulus
                  </div>
                </div>
              </div>

              <div className="border-2 border-dashed border-[#E3E8F8] rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-white transition-colors cursor-pointer">
                <Upload className="w-5 h-5 text-[#5B6585] mb-1" />
                <span className="text-xs font-semibold text-[#3F55F0]">Unggah Foto/Video Tambahan</span>
                <span className="text-xs text-[#5B6585]">Maks 100MB (Kompresi otomatis)</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-[#E3E8F8]">
            <button
              onClick={handleNextPhase}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#3F55F0] hover:bg-[#2A38B8] text-white text-sm font-semibold transition-all shadow-md shadow-[#3F55F0]/20"
            >
              Lanjut ke Evaluasi Diri (Fase 5)
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* PHASE 5: EVALUASI DIRI */}
      {session.currentPhase === 5 && (
        <>
        <RoleNotice phase={5} />
        <fieldset disabled={locked(5)} className="contents min-w-0">
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E3E8F8] shadow-xs space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#3F55F0]/10 text-[#3F55F0]">
                Fase 5: Evaluasi Diri &amp; Metakognisi
              </span>
              <h2 className="text-xl font-bold text-[#0F1B4A] mt-2">
                Bandingkan Prediksimu dengan Kenyataan
              </h2>
              <p className="text-sm text-[#5B6585] mt-1">
                Refleksi jujur mengasah batas kemampuan dan mencegah overconfidence di tempat kerja nyata.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="as-field-3" className="block text-xs font-bold text-[#0F1B4A] uppercase tracking-wider mb-1.5">
                1. Bagaimana hasil nyata pengujian dibandingkan dengan prediksimu awal?
              </label>
              <textarea id="as-field-3"
                value={reflectionOutcome}
                onChange={(e) => setReflectionOutcome(e.target.value)}
                rows={2}
                className="w-full p-3.5 rounded-2xl border border-[#E3E8F8] bg-[#F6F8FF] text-xs text-[#0F1B4A] focus:bg-white focus:border-[#3F55F0] focus:ring-2 focus:ring-[#3F55F0]/20"
              />
            </div>

            <div>
              <label htmlFor="as-field-4" className="block text-xs font-bold text-[#0F1B4A] uppercase tracking-wider mb-1.5">
                2. Apa bagian rencana yang berjalan sukses?
              </label>
              <input id="as-field-4"
                type="text"
                value={reflectionWorked}
                onChange={(e) => setReflectionWorked(e.target.value)}
                className="w-full p-3.5 rounded-2xl border border-[#E3E8F8] bg-[#F6F8FF] text-xs text-[#0F1B4A] focus:bg-white focus:border-[#3F55F0] focus:ring-2 focus:ring-[#3F55F0]/20"
              />
            </div>

            <div>
              <label htmlFor="as-field-5" className="block text-xs font-bold text-[#0F1B4A] uppercase tracking-wider mb-1.5">
                3. Apa bagian yang meleset atau tak terduga saat praktik?
              </label>
              <input id="as-field-5"
                type="text"
                value={reflectionMissed}
                onChange={(e) => setReflectionMissed(e.target.value)}
                className="w-full p-3.5 rounded-2xl border border-[#E3E8F8] bg-[#F6F8FF] text-xs text-[#0F1B4A] focus:bg-white focus:border-[#3F55F0] focus:ring-2 focus:ring-[#3F55F0]/20"
              />
            </div>

            <div>
              <label htmlFor="as-field-6" className="block text-xs font-bold text-[#0F1B4A] uppercase tracking-wider mb-1.5">
                4. Apa yang akan kamu lakukan berbeda jika menghadapi situasi serupa di proyek berikutnya?
              </label>
              <textarea id="as-field-6"
                value={reflectionNextTime}
                onChange={(e) => setReflectionNextTime(e.target.value)}
                rows={2}
                className="w-full p-3.5 rounded-2xl border border-[#E3E8F8] bg-[#F6F8FF] text-xs text-[#0F1B4A] focus:bg-white focus:border-[#3F55F0] focus:ring-2 focus:ring-[#3F55F0]/20"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 sm:gap-4 pt-4 border-t border-[#E3E8F8]">
            {reflectionIncomplete && (
              <span role="alert" className="text-xs font-semibold text-[#DC2626]">
                Lengkapi semua isian refleksi terlebih dahulu.
              </span>
            )}
            <button
              onClick={handleSaveReflection}
              disabled={reflectionIncomplete}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#3F55F0] hover:bg-[#2A38B8] disabled:opacity-50 disabled:hover:bg-[#3F55F0] text-white text-sm font-semibold transition-all shadow-md shadow-[#3F55F0]/20"
            >
              Simpan Refleksi &amp; Menuju Rubrik Penilai (Fase 6)
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        </fieldset>
        </>
      )}

      {/* PHASE 6: PENILAIAN RUBRIK (5 DIMENSI) */}
      {session.currentPhase === 6 && (
        <>
        <RoleNotice phase={6} />
        <fieldset disabled={locked(6)} className="contents min-w-0">
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E3E8F8] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#16A34A]/10 text-[#166534]">
                Fase 6: Pengisian Rubrik &amp; Umpan Balik Penilai
              </span>
              <h2 className="text-xl font-bold text-[#0F1B4A] mt-2">
                Rubrik 5 Dimensi Adaptabilitas (Skala 0 - 4)
              </h2>
              <p className="text-sm text-[#5B6585] mt-1">
                Wajib sertakan alasan tertulis bila memberikan skor 0 atau 4 sesuai Bagian 7.7.
              </p>
            </div>

            {/* Realtime Live Calculated Adaptation Index Badge */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#3F55F0] to-[#2A38B8] text-white text-center shadow-lg">
              <span className="text-[11px] uppercase font-bold tracking-wider text-blue-200">
                Indeks Adaptasi (IA)
              </span>
              <div className="text-2xl font-black font-mono">
                {calculateAdaptationIndex(currentScores)} / 100
              </div>
            </div>
          </div>

          {/* 2-Column Layout: Rubric Dimension Scorers (Left) & Sticky Live Radar Scorecard (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Rubric Dimensions (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              {RUBRIC_DIMENSIONS.map((dim, idx) => {
                const currentScoreObj = currentScores[idx];
                const scoreVal = currentScoreObj?.score ?? 0;

                return (
                  <div
                    key={dim.key}
                    className="p-5 rounded-2xl bg-[#F6F8FF] border border-[#E3E8F8] space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-[#0F1B4A] flex items-center gap-2">
                          {dim.label}
                          <span className="text-xs font-semibold text-[#3F55F0] bg-white px-2 py-0.5 rounded-md border border-[#E3E8F8]">
                            Bobot {Math.round(dim.weight * 100)}%
                          </span>
                        </h4>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {[0, 1, 2, 3, 4].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => handleScoreChange(idx, num)}
                            className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                              scoreVal === num
                                ? 'bg-[#3F55F0] text-white shadow-md scale-105'
                                : 'bg-white text-[#5B6585] border border-[#E3E8F8] hover:border-[#3F55F0]'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Active Descriptor */}
                    <div className="p-3 rounded-xl bg-white border border-[#E3E8F8] text-xs text-[#0F1B4A] leading-relaxed">
                      <span className="font-bold text-[#3F55F0]">Deskriptor Nilai {scoreVal}: </span>
                      {dim.descriptors[scoreVal]}
                    </div>

                    {/* Rationale if 0 or 4 */}
                    {(scoreVal === 0 || scoreVal === 4) && (
                      <div className="pt-2">
                        <label htmlFor={`rationale-${idx}`} className="block text-[11px] font-bold text-[#DC2626] uppercase mb-1">
                          Alasan Tertulis Wajib (Skor {scoreVal}):
                        </label>
                        <input id={`rationale-${idx}`}
                          type="text"
                          value={currentScoreObj?.rationale ?? ''}
                          onChange={(e) => handleRationaleChange(idx, e.target.value)}
                          aria-invalid={!currentScoreObj?.rationale?.trim()}
                          className="w-full p-2.5 rounded-xl border border-red-200 bg-red-50/30 text-xs text-[#0F1B4A]"
                          placeholder="Tuliskan justifikasi detail..."
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right Column: Sticky Live Radar Scorecard (4 cols) */}
            <div className="lg:col-span-4 sticky top-24 p-5 rounded-2xl bg-white border border-[#E3E8F8] shadow-sm space-y-4 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B6585] block">
                Visualisasi Live Radar Sesi
              </span>

              {/* Dynamic SVG Radar */}
              <div className="w-44 h-44 mx-auto relative flex items-center justify-center">
                <svg viewBox="0 0 160 160" className="w-full h-full overflow-visible">
                  {[0.25, 0.5, 0.75, 1.0].map((scale, sIdx) => {
                    const pts = [0, 1, 2, 3, 4].map(i => {
                      const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
                      const r = scale * 55;
                      return `${80 + r * Math.cos(angle)},${80 + r * Math.sin(angle)}`;
                    }).join(' ');
                    return (
                      <polygon
                        key={sIdx}
                        points={pts}
                        fill="none"
                        stroke="#E3E8F8"
                        strokeWidth="1"
                      />
                    );
                  })}

                  <polygon
                    points={[
                      currentScores.find(s => s.key === 'prediksi')?.score ?? 0,
                      currentScores.find(s => s.key === 'penyesuaian')?.score ?? 0,
                      currentScores.find(s => s.key === 'hasil')?.score ?? 0,
                      currentScores.find(s => s.key === 'kemandirian')?.score ?? 0,
                      currentScores.find(s => s.key === 'evaluasi')?.score ?? 0
                    ].map((score, i) => {
                      const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
                      const r = (score / 4) * 55;
                      return `${80 + r * Math.cos(angle)},${80 + r * Math.sin(angle)}`;
                    }).join(' ')}
                    fill="#4A8BFF"
                    fillOpacity="0.3"
                    stroke="#3F55F0"
                    strokeWidth="2"
                    className="transition-all duration-300"
                  />
                </svg>
              </div>

              <div className="p-3 bg-[#F6F8FF] rounded-xl border border-[#E3E8F8] text-xs">
                <div className="text-xs font-semibold text-[#5B6585]">Prediksi Tingkat:</div>
                <div className="font-bold text-[#3F55F0]">
                  {calculateAdaptationIndex(currentScores) >= 80 ? 'Mahir Beradaptasi' : calculateAdaptationIndex(currentScores) >= 60 ? 'Cakap Beradaptasi' : 'Berkembang'}
                </div>
              </div>

              <button
                onClick={handleFinalizeEvaluation}
                disabled={missingRationale > 0}
                className="w-full py-3 px-4 rounded-xl bg-[#16A34A] hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-[#16A34A] text-white text-xs font-bold transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Terbitkan Paspor (Fase 7)</span>
              </button>
              {missingRationale > 0 && (
                <p role="alert" className="text-xs font-semibold text-[#DC2626]">
                  Isi alasan tertulis untuk {missingRationale} dimensi bernilai 0 atau 4.
                </p>
              )}
            </div>

          </div>
        </div>
        </fieldset>
        </>
      )}

      {/* PHASE 7: PASPOR KEMAMPUAN SIAP */}
      {session.currentPhase === 7 && (
        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#3F55F0] via-[#2A38B8] to-[#0F1B4A] text-white shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-white">
                Fase 7 Selesai: Sesi Berhasil Diuji
              </span>
              <h2 className="text-2xl font-black text-white">
                Paspor Kemampuan Adaptiv Diterbitkan
              </h2>
              <p className="text-xs text-blue-100 max-w-xl">
                Bukti dinamis adaptabilitas {session.participant.name} kini terdaftar secara resmi dengan verifikasi QR code dan indeks terhitung.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
            <button
              onClick={onViewPassport}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-blue-50 text-[#0F1B4A] text-sm font-bold transition-all shadow-lg"
            >
              Lihat Paspor Kemampuan Lengkap
              <ArrowRight className="w-4 h-4 text-[#3F55F0]" />
            </button>
            {onResetSession && (
              <button
                onClick={onResetSession}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl border border-white/40 hover:bg-white/10 text-white text-sm font-bold transition-colors"
              >
                Mulai Sesi Baru
              </button>
            )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/20">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md">
              <span className="text-xs text-blue-200 block">Indeks Adaptasi (IA)</span>
              <span className="text-2xl font-black text-white font-mono">
                {session.result?.adaptationIndex || 82.5}
              </span>
              <span className="text-xs text-emerald-300 block font-semibold mt-0.5">
                {session.result?.level || 'Mahir Beradaptasi'}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md">
              <span className="text-xs text-blue-200 block">Selisih Transfer</span>
              <span className="text-2xl font-black text-white font-mono">
                {session.result?.transferGap || 0.3}
              </span>
              <span className="text-xs text-blue-200 block mt-0.5">
                Tahan terhadap variasi
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md">
              <span className="text-xs text-blue-200 block">Kalibrasi Diri</span>
              <span className="text-2xl font-black text-white font-mono">
                {session.result?.calibration || 0.2}
              </span>
              <span className="text-xs text-blue-200 block mt-0.5">
                Akurasi prediksi seimbang
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md">
              <span className="text-xs text-blue-200 block">Batas Kemampuan Teridentifikasi</span>
              <span className="text-sm font-bold text-amber-300 block capitalize mt-1 truncate">
                {session.result?.weakestCategory || 'Beban / Daya Tinggi'}
              </span>
              <span className="text-xs text-blue-200 block mt-0.5">
                Area target pelatihan
              </span>
            </div>
          </div>
        </div>
      )}
        </motion.div>
      </AnimatePresence>

      {/* TIERED HINT CONFIRMATION MODAL */}
      {activeHintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F1B4A]/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md p-6 bg-white rounded-3xl shadow-2xl border border-[#E3E8F8] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F1B4A]">
                Peringatan Pengurangan Skor Kemandirian
              </h3>
              <p className="text-xs text-[#5B6585] mt-1 leading-relaxed">
                Membuka petunjuk ini akan tercatat dalam log audit sesi dan mengurangi sub-skor dimensi <strong>Kemandirian</strong>. Apakah Anda yakin ingin membuka petunjuk teknis ini?
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setActiveHintModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#5B6585] hover:bg-[#F6F8FF]"
              >
                Batalkan
              </button>
              <button
                onClick={() => handleOpenHint(activeHintModal)}
                className="px-4 py-2 rounded-xl bg-[#3F55F0] hover:bg-[#2A38B8] text-white text-xs font-semibold"
              >
                Ya, Buka Petunjuk
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
