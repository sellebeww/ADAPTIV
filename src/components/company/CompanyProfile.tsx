/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Logo } from '../brand/Logo';
import { 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Award, 
  Sparkles, 
  Layers, 
  TrendingUp, 
  Building2, 
  GraduationCap, 
  Users, 
  Download, 
  Palette, 
  ExternalLink, 
  Cpu, 
  Zap, 
  FileCheck2, 
  Compass, 
  BarChart3, 
  ChevronRight,
  BookOpen,
  Sliders,
  AlertTriangle,
  RotateCcw,
  Play,
  ChevronDown,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CircuitVisualizer } from '../circuit/CircuitVisualizer';

interface CompanyProfileProps {
  onEnterDemo: (tab?: string) => void;
  onOpenBrandKit: () => void;
}

export const CompanyProfile: React.FC<CompanyProfileProps> = ({
  onEnterDemo,
  onOpenBrandKit
}) => {
  // Live Scenario Switcher state in Hero
  const [heroScenario, setHeroScenario] = useState<'standar' | 'berubah'>('berubah');

  // Interactive Live Radar Simulator State
  const [simScores, setSimScores] = useState({
    prediksi: 3,
    penyesuaian: 4,
    hasil: 3,
    kemandirian: 3,
    evaluasi: 4
  });

  // Calculate simulated IA
  const p = simScores.prediksi;
  const k = simScores.penyesuaian;
  const h = simScores.hasil;
  const m = simScores.kemandirian;
  const e = simScores.evaluasi;
  const calculatedIA = Math.round(100 * ((0.20 * p) + (0.30 * k) + (0.25 * h) + (0.15 * m) + (0.10 * e)) / 4 * 10) / 10;
  
  const getSimLevel = (score: number) => {
    if (score < 40) return { title: 'Tergantung Prosedur', color: 'text-red-600 bg-red-50' };
    if (score < 60) return { title: 'Berkembang', color: 'text-amber-600 bg-amber-50' };
    if (score < 80) return { title: 'Cakap Beradaptasi', color: 'text-[#3F55F0] bg-blue-50' };
    return { title: 'Mahir Beradaptasi', color: 'text-emerald-700 bg-emerald-50' };
  };

  const simLevel = getSimLevel(calculatedIA);

  // SVG Radar coordinates for the simulator
  const radarDimensions = [
    { label: 'Prediksi', score: simScores.prediksi },
    { label: 'Penyesuaian', score: simScores.penyesuaian },
    { label: 'Hasil Kerja', score: simScores.hasil },
    { label: 'Kemandirian', score: simScores.kemandirian },
    { label: 'Evaluasi Diri', score: simScores.evaluasi }
  ];

  const cx = 110;
  const cy = 110;
  const maxR = 75;
  const polygonPoints = radarDimensions.map((d, i) => {
    const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
    const r = (d.score / 4) * maxR;
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(' ');

  // Active step in interactive process flow
  const [activeStep, setActiveStep] = useState<number>(2);

  const processSteps = [
    { num: 1, title: 'Tugas Dasar', desc: 'Siswa merakit saklar tunggal & lampu, menguji keselamatan awal MCB.' },
    { num: 2, title: 'Situasi Berubah', desc: 'Tepat 1 kondisi diubah: Klien minta saklar tukar kendali 2 arah.' },
    { num: 3, title: 'Prediksi Terkunci', desc: 'Menuliskan risiko korsleting & rencana kerja sebelum bertindak.' },
    { num: 4, title: 'Penyesuaian Mandiri', desc: 'Mengeksekusi kabel strapping dengan opsi petunjuk bertingkat.' },
    { num: 5, title: 'Evaluasi Diri', desc: 'Membandingkan prediksi vs hasil nyata untuk mengenali batas kemampuan.' },
    { num: 6, title: 'Paspor Kemampuan', desc: 'Indeks Adaptasi terbit dengan grafik radar & verifikasi QR code.' }
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[#F6F8FF] text-[#0F1B4A] font-sans selection:bg-[#4A8BFF]/20 selection:text-[#0F1B4A] overflow-x-hidden">
      
      {/* 1. HERO SECTION WITH VIBRANT ANIMATION & INTERACTIVE SCENARIO SIMULATOR */}
      <section id="hero" className="relative pt-10 pb-20 lg:pt-16 lg:pb-28 overflow-hidden">
        
        {/* Animated Background Gradient Blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#3F55F0]/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-[#4A8BFF]/15 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Content Column (7 cols) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 space-y-6"
            >
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E3E8F8] shadow-2xs text-xs font-bold text-[#3F55F0]">
                <span className="w-2 h-2 rounded-full bg-[#4A8BFF] animate-ping" />
                <span>Dynamic Assessment Platform Vokasi &amp; Industri</span>
              </div>

              <h1 
                className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F1B4A] tracking-tight leading-[1.14]" 
                style={{ textWrap: 'balance' }}
              >
                Buktikan Kemampuan Beradaptasi Nyata, Bukan Sekadar Menghafal Prosedur.
              </h1>

              <p className="text-base sm:text-lg text-[#5B6585] leading-relaxed max-w-2xl">
                Portofolio dan ujian biasa hanya membuktikan siswa bisa mengulang langkah yang sama. <strong>Adaptiv</strong> menguji proses berpikir saat kondisi kerja berubah tak terduga—menghasilkan bukti adaptabilitas nyata dan batas kemampuan yang diakui dunia industri.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <button
                  onClick={() => onEnterDemo('sesi')}
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-[#3F55F0] hover:bg-[#2A38B8] text-white text-sm font-bold transition-all shadow-lg shadow-[#3F55F0]/25 hover:scale-[1.02] active:scale-95 group"
                >
                  <Play className="w-4 h-4 fill-white text-white group-hover:scale-110 transition-transform" />
                  <span>Jalankan Sesi Simulasi di Demo</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <a
                  href="#simulator"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white border border-[#E3E8F8] hover:border-[#3F55F0] text-[#0F1B4A] text-sm font-semibold transition-colors shadow-2xs"
                >
                  <Sliders className="w-4 h-4 text-[#3F55F0]" />
                  <span>Coba Simulator Skor Radar</span>
                </a>
              </div>

              {/* Quantitative Rigor Stats */}
              <div className="pt-6 border-t border-[#E3E8F8] grid grid-cols-3 gap-4">
                <div className="p-3 bg-white/70 backdrop-blur-xs rounded-2xl border border-[#E3E8F8]">
                  <div className="text-xl sm:text-2xl font-black text-[#0F1B4A] font-mono tabular-nums">140+</div>
                  <div className="text-[11px] text-[#5B6585] mt-0.5 font-medium">Sesi Uji Terverifikasi</div>
                </div>
                <div className="p-3 bg-white/70 backdrop-blur-xs rounded-2xl border border-[#E3E8F8]">
                  <div className="text-xl sm:text-2xl font-black text-[#16A34A] font-mono tabular-nums">0.86</div>
                  <div className="text-[11px] text-[#5B6585] mt-0.5 font-medium">Reliabilitas Antar-Penilai</div>
                </div>
                <div className="p-3 bg-white/70 backdrop-blur-xs rounded-2xl border border-[#E3E8F8]">
                  <div className="text-xl sm:text-2xl font-black text-[#3F55F0] font-mono tabular-nums">r = 0.79</div>
                  <div className="text-[11px] text-[#5B6585] mt-0.5 font-medium">Validitas Lapangan Industri</div>
                </div>
              </div>

            </motion.div>

            {/* Right Interactive Scenario Switcher (5 cols) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="lg:col-span-5 space-y-3"
            >
              
              {/* Scenario Switcher Tabs */}
              <div className="flex items-center justify-between p-1.5 bg-white rounded-2xl border border-[#E3E8F8] shadow-xs">
                <button
                  onClick={() => setHeroScenario('standar')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    heroScenario === 'standar'
                      ? 'bg-[#0F1B4A] text-white shadow-xs'
                      : 'text-[#5B6585] hover:text-[#0F1B4A]'
                  }`}
                >
                  1. Kondisi Standar (Normal)
                </button>
                <button
                  onClick={() => setHeroScenario('berubah')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    heroScenario === 'berubah'
                      ? 'bg-[#3F55F0] text-white shadow-xs ring-2 ring-[#4A8BFF]/30'
                      : 'text-[#3F55F0] hover:bg-[#F6F8FF]'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-[#4A8BFF]" />
                  <span>2. Situasi Berubah!</span>
                </button>
              </div>

              {/* Dynamic Interactive Card with Motion AnimatePresence */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-white bg-slate-900 group min-h-[380px] flex flex-col justify-end">
                <img
                  src="/src/assets/images/adaptiv_hero_vocational_lab_1792696958145.jpg"
                  alt="Modern Vocational Assessment Lab Adaptiv"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-80"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#0F1B4A] via-[#0F1B4A]/50 to-transparent" />

                {/* Animated Scenario Card Content */}
                <AnimatePresence mode="wait">
                  {heroScenario === 'berubah' ? (
                    <motion.div
                      key="berubah"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.25 }}
                      className="relative z-10 p-5 sm:p-6 bg-[#0F1B4A]/95 backdrop-blur-md rounded-2xl m-3 border border-[#4A8BFF]/40 shadow-xl space-y-2.5 text-white"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#4A8BFF]/20 text-[#4A8BFF] text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                          <Zap className="w-3 h-3 text-[#4A8BFF]" />
                          Tantangan Adaptasi Aktif
                        </span>
                        <span className="text-[10px] text-amber-300 font-mono">Tepat 1 Kondisi Diubah</span>
                      </div>

                      <h4 className="text-sm sm:text-base font-black text-white leading-snug">
                        Permintaan Kendali 2 Arah: Saklar Tunggal dialihkan ke Saklar Tukar (SPDT)!
                      </h4>

                      <p className="text-xs text-blue-100/80 leading-relaxed">
                        Siswa tidak boleh langsung merakit. Sistem mengunci lembar prediksi untuk memverifikasi pemahaman strapping wire dan pencegahan korsleting.
                      </p>

                      <div className="pt-2 flex items-center justify-between border-t border-white/10">
                        <span className="text-[10px] text-blue-200">Relevan dengan proyek hotel &amp; tangga</span>
                        <button
                          onClick={() => onEnterDemo('sesi')}
                          className="px-3 py-1.5 rounded-lg bg-[#4A8BFF] hover:bg-white text-[#0F1B4A] text-xs font-bold transition-all shadow-xs"
                        >
                          Uji di Demo →
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="standar"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.25 }}
                      className="relative z-10 p-5 sm:p-6 bg-white/95 backdrop-blur-md rounded-2xl m-3 border border-white shadow-xl space-y-2 text-[#0F1B4A]"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                          Tugas Dasar (Garis Awal)
                        </span>
                        <span className="text-[10px] text-[#5B6585] font-mono">PUIL 2020</span>
                      </div>

                      <h4 className="text-sm sm:text-base font-bold text-[#0F1B4A]">
                        Perakitan Sirkuit Saklar Tunggal 1 Lampu Standar
                      </h4>

                      <p className="text-xs text-[#5B6585] leading-relaxed">
                        Siswa mendemonstrasikan SOP instalasi kabel NYA 1.5mm², MCB 2A, dan pembumian. Baseline tercapai dengan nilai 3.5 / 4.0.
                      </p>

                      <div className="pt-2 flex items-center justify-between border-t border-[#E3E8F8]">
                        <span className="text-[10px] text-[#16A34A] font-bold">Lulus Prosedur Dasar</span>
                        <button
                          onClick={() => setHeroScenario('berubah')}
                          className="text-xs text-[#3F55F0] font-bold hover:underline"
                        >
                          Coba Pemicu Berubah →
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>

            </motion.div>

          </div>

        </div>
      </section>

      {/* 2. INTERACTIVE 8-PHASE PROCESS FLOW (ANIMATED STEPPER) */}
      <section className="py-16 bg-white border-y border-[#E3E8F8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold text-[#3F55F0] uppercase tracking-wider">
              Alur Penilaian Dinamis
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F1B4A]">
              Dari Tugas Dasar Hingga Paspor Kemampuan
            </h2>
            <p className="text-xs sm:text-sm text-[#5B6585]">
              Klik tiap tahapan di bawah untuk melihat bagaimana Adaptiv menguji proses adaptasi siswa.
            </p>
          </div>

          {/* Stepper Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {processSteps.map((step) => {
              const isActive = activeStep === step.num;
              return (
                <button
                  key={step.num}
                  onClick={() => setActiveStep(step.num)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    isActive
                      ? 'bg-[#3F55F0] text-white border-[#3F55F0] shadow-md scale-[1.02]'
                      : 'bg-[#F6F8FF] text-[#0F1B4A] border-[#E3E8F8] hover:border-[#3F55F0]/40'
                  }`}
                >
                  <div className={`text-xs font-mono font-bold mb-1 ${isActive ? 'text-blue-200' : 'text-[#3F55F0]'}`}>
                    0{step.num}.
                  </div>
                  <h4 className="text-xs font-bold leading-snug">{step.title}</h4>
                  <p className={`text-[10px] mt-1.5 line-clamp-2 ${isActive ? 'text-blue-100' : 'text-[#5B6585]'}`}>
                    {step.desc}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Highlight Card for the Selected Phase */}
          <motion.div 
            key={activeStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-6 p-6 rounded-2xl bg-[#F6F8FF] border border-[#E3E8F8] flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#3F55F0] text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                {activeStep}
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0F1B4A]">
                  Fokus Pengujian Tahap {activeStep}: {processSteps[activeStep - 1].title}
                </h4>
                <p className="text-xs text-[#5B6585] mt-0.5">
                  {processSteps[activeStep - 1].desc}
                </p>
              </div>
            </div>

            <button
              onClick={() => onEnterDemo('sesi')}
              className="px-4 py-2 rounded-xl bg-[#3F55F0] hover:bg-[#2A38B8] text-white text-xs font-bold transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-2xs"
            >
              <span>Uji Tahap Ini di Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>

        </div>
      </section>

      {/* 3. SIMULATOR INTERAKTIF: UJI SKOR 5 DIMENSI SECARA LANGSUNG */}
      <section id="simulator" className="py-20 bg-[#F6F8FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-12 space-y-2">
            <span className="text-xs font-bold text-[#3F55F0] uppercase tracking-wider">
              Simulator Interaktif
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F1B4A] tracking-tight">
              Coba Simulator Indeks Adaptasi (IA)
            </h2>
            <p className="text-xs sm:text-sm text-[#5B6585]">
              Ubah skor 5 dimensi di bawah ini untuk melihat bagaimana bentuk grafik radar dan status kelulusan beradaptasi berubah secara otomatis.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Sliders Control Box (7 cols) */}
            <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white border border-[#E3E8F8] shadow-sm space-y-5">
              
              <div className="flex items-center justify-between pb-3 border-b border-[#E3E8F8]">
                <h3 className="text-sm font-bold text-[#0F1B4A] flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#3F55F0]" />
                  Sesuaikan Nilai Rubrik (Skala 0 - 4)
                </h3>
                <span className="text-[11px] font-mono text-[#5B6585]">
                  Formula Resmi Adaptiv
                </span>
              </div>

              {/* Slider 1: Prediksi */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#0F1B4A]">1. Ketepatan Prediksi (Bobot 20%)</span>
                  <span className="text-[#3F55F0] font-mono">{simScores.prediksi} / 4</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="4"
                  step="1"
                  value={simScores.prediksi}
                  onChange={(e) => setSimScores({ ...simScores, prediksi: parseInt(e.target.value) })}
                  className="w-full accent-[#3F55F0] cursor-pointer"
                />
              </div>

              {/* Slider 2: Penyesuaian */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#0F1B4A]">2. Kualitas Penyesuaian (Bobot 30% - Terbesar)</span>
                  <span className="text-[#3F55F0] font-mono">{simScores.penyesuaian} / 4</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="4"
                  step="1"
                  value={simScores.penyesuaian}
                  onChange={(e) => setSimScores({ ...simScores, penyesuaian: parseInt(e.target.value) })}
                  className="w-full accent-[#3F55F0] cursor-pointer"
                />
              </div>

              {/* Slider 3: Hasil */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#0F1B4A]">3. Hasil Kerja Variasi (Bobot 25%)</span>
                  <span className="text-[#3F55F0] font-mono">{simScores.hasil} / 4</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="4"
                  step="1"
                  value={simScores.hasil}
                  onChange={(e) => setSimScores({ ...simScores, hasil: parseInt(e.target.value) })}
                  className="w-full accent-[#3F55F0] cursor-pointer"
                />
              </div>

              {/* Slider 4: Kemandirian */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#0F1B4A]">4. Kemandirian (Bobot 15% - Tanpa Petunjuk)</span>
                  <span className="text-[#3F55F0] font-mono">{simScores.kemandirian} / 4</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="4"
                  step="1"
                  value={simScores.kemandirian}
                  onChange={(e) => setSimScores({ ...simScores, kemandirian: parseInt(e.target.value) })}
                  className="w-full accent-[#3F55F0] cursor-pointer"
                />
              </div>

              {/* Slider 5: Evaluasi */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#0F1B4A]">5. Evaluasi Diri &amp; Metakognisi (Bobot 10%)</span>
                  <span className="text-[#3F55F0] font-mono">{simScores.evaluasi} / 4</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="4"
                  step="1"
                  value={simScores.evaluasi}
                  onChange={(e) => setSimScores({ ...simScores, evaluasi: parseInt(e.target.value) })}
                  className="w-full accent-[#3F55F0] cursor-pointer"
                />
              </div>

            </div>

            {/* Live Visual Result & Radar Preview (5 cols) */}
            <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-white border border-[#E3E8F8] shadow-lg space-y-6 text-center">
              
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B6585]">
                  Hasil Perhitungan Realtime
                </span>
                <div className="text-4xl sm:text-5xl font-black text-[#3F55F0] font-mono mt-1">
                  {calculatedIA}
                  <span className="text-base font-normal text-[#5B6585]"> / 100</span>
                </div>
                <div className="mt-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${simLevel.color}`}>
                    {simLevel.title}
                  </span>
                </div>
              </div>

              {/* Live Morphing SVG Radar Chart */}
              <div className="w-56 h-56 mx-auto relative flex items-center justify-center">
                <svg viewBox="0 0 220 220" className="w-full h-full overflow-visible">
                  {/* Concentric Grid Pentagons */}
                  {[0.25, 0.5, 0.75, 1.0].map((scale, sIdx) => {
                    const gridPts = radarDimensions.map((_, i) => {
                      const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
                      const r = scale * maxR;
                      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
                    }).join(' ');
                    return (
                      <polygon
                        key={sIdx}
                        points={gridPts}
                        fill="none"
                        stroke="#E3E8F8"
                        strokeWidth="1.2"
                      />
                    );
                  })}

                  {/* Dynamic Morphed Polygon */}
                  <polygon
                    points={polygonPoints}
                    fill="#4A8BFF"
                    fillOpacity="0.3"
                    stroke="#3F55F0"
                    strokeWidth="2.5"
                    className="transition-all duration-300"
                  />

                  {/* Points */}
                  {radarDimensions.map((d, i) => {
                    const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
                    const r = (d.score / 4) * maxR;
                    return (
                      <circle
                        key={i}
                        cx={cx + r * Math.cos(angle)}
                        cy={cy + r * Math.sin(angle)}
                        r="4"
                        fill="#3F55F0"
                        stroke="#FFF"
                        strokeWidth="1.5"
                        className="transition-all duration-300"
                      />
                    );
                  })}
                </svg>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onEnterDemo('paspor')}
                  className="w-full py-3 rounded-xl bg-[#0F1B4A] hover:bg-[#1E2888] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Award className="w-4 h-4 text-[#4A8BFF]" />
                  <span>Buka Paspor Lengkap di Demo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 4. SHOWCASE MITRA INDUSTRI & TESTIMONI */}
      <section id="mitra" className="py-20 bg-white border-y border-[#E3E8F8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 rounded-3xl overflow-hidden border border-[#E3E8F8] shadow-lg">
              <img
                src="/src/assets/images/industry_engineer_tablet_1792696958848.jpg"
                alt="Manajer Industri Memeriksa Paspor Kemampuan"
                referrerPolicy="no-referrer"
                className="w-full h-auto aspect-4/3 object-cover object-center"
              />
            </div>

            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold text-[#3F55F0] uppercase tracking-wider">
                Solusi Link &amp; Match Nyata
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F1B4A] tracking-tight">
                Dipercaya Mitra Industri Penerima Magang
              </h2>
              <p className="text-sm sm:text-base text-[#5B6585] leading-relaxed">
                Industri tidak lagi merekrut teknisi magang hanya berdasarkan nilai rapor. Dengan portal mitra Adaptiv, perusahaan dapat menyaring kandidat berdasarkan tingkat adaptabilitas dan memberikan umpan balik validasi kerja nyata setelah magang usai.
              </p>

              {/* Testimonial Quote */}
              <div className="p-6 rounded-2xl bg-[#F6F8FF] border border-[#E3E8F8] space-y-3">
                <p className="text-xs sm:text-sm text-[#0F1B4A] italic leading-relaxed">
                  &ldquo;Siswa lulusan dengan paspor Adaptiv menunjukkan kecepatan pemahaman sirkuit 2x lebih cepat saat kami tugaskan di proyek lapangan baru. Mereka tidak panik ketika merek kontaktor atau jalur kabel di lapangan berbeda dengan di buku panduan.&rdquo;
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-[#E3E8F8]">
                  <div>
                    <h5 className="text-xs font-bold text-[#0F1B4A]">Hendra Wijaya, S.T.</h5>
                    <p className="text-[11px] text-[#5B6585]">Manajer Rekayasa Lapangan — PT Maju Daya Elektrika</p>
                  </div>
                  <span className="text-[10px] font-bold text-[#3F55F0] bg-white border border-[#E3E8F8] px-2.5 py-0.5 rounded-lg">
                    PLN Group Partner
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onEnterDemo('industri')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3F55F0] hover:bg-[#2A38B8] text-white text-xs font-bold transition-colors shadow-2xs"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Lihat Portal Mitra Industri di Demo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 5. INTERACTIVE CIRCUIT SCHEMATIC SHOWCASE (TITL) */}
      <section className="py-20 bg-white border-b border-[#E3E8F8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12 space-y-2">
            <span className="text-xs font-bold text-[#3F55F0] uppercase tracking-wider">
              Simulasi Lapangan Interaktif
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F1B4A] tracking-tight">
              Saksikan Bagaimana Aliran Arus Menyesuaikan Saat Kondisi Berubah
            </h2>
            <p className="text-xs sm:text-sm text-[#5B6585]">
              Coba nyalakan/matikan saklar di bawah ini untuk melihat perbedaan alur fasa pada Sirkuit Dasar vs Sirkuit Variasi 2 Titik Kendali (SPDT).
            </p>
          </div>

          <CircuitVisualizer mode="interactive" initialState="variation" />
        </div>
      </section>

      {/* 6. FAQ & OBJECTION HANDLING ACCORDION */}
      <section className="py-20 bg-[#F6F8FF] border-b border-[#E3E8F8]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-[#3F55F0] uppercase tracking-wider">
              Tanya Jawab (FAQ)
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F1B4A] tracking-tight">
              Pertanyaan Seputar Platform Adaptiv
            </h2>
            <p className="text-xs sm:text-sm text-[#5B6585]">
              Segala hal yang perlu diketahui oleh Kepala Sekolah, Guru Produktif, dan Mitra Industri.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "Bagaimana Adaptiv memastikan penilai tidak mengubah lebih dari 1 kondisi sekaligus?",
                a: "Sistem Adaptiv menerapkan aturan validasi otomatis melalui Task Equivalence Checklist. Penilai hanya dapat memilih variasi yang telah diverifikasi rekan sejawat dengan tepat 1 variabel bebas yang diisolasi (misal: hanya spesifikasi kendali, atau hanya beban daya), sehingga hasil evaluasi tidak bias."
              },
              {
                q: "Apakah sekolah atau BLK perlu membeli peralatan dan sensor baru?",
                a: "Sama sekali tidak. Adaptiv didesain agnostik terhadap hardware. Sistem memanfaatkan papan kerja latihan, multimeter digital, pipa konduit, dan saklar yang sudah ada di bengkel sekolah. Bukti praktik berupa foto/video singkat diunggah langsung melalui smartphone peserta."
              },
              {
                q: "Bagaimana keabsahan dan privasi Paspor Kemampuan bagi siswa SMK?",
                a: "Setiap Paspor Kemampuan memiliki kode verifikasi unik (contoh: ADAPT-2026-TITL-0891) dengan QR code resmi. Selaras dengan UU Perlindungan Data Pribadi (UU PDP), siswa di bawah 18 tahun memiliki kontrol penuh terhadap izin akses perusahaan mitra industri."
              },
              {
                q: "Berapa lama durasi pelaksanaan satu sesi penilaian dinamis?",
                a: "Satu sesi berurutan (Fase 0 hingga 7) umumnya berlangsung antara 35 hingga 50 menit. Waktu ini sangat efisien dan pas dengan alokasi jam praktikum blok maupun Uji Kompetensi Keahlian (UKK) tahunan."
              }
            ].map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#E3E8F8] bg-white overflow-hidden transition-all shadow-xs"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-[#0F1B4A] hover:bg-[#F6F8FF] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-[#3F55F0] transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="px-5 pb-5 text-xs text-[#5B6585] leading-relaxed border-t border-[#F6F8FF]"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. BOTTOM CTA BANNER: DIRECT ACCESS INTO DEMO */}
      <section className="py-16 bg-gradient-to-br from-[#0F1B4A] via-[#1E2888] to-[#2A38B8] text-white relative overflow-hidden">
        
        {/* Subtle Dynamic Arrow Motif */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-12 translate-y-12">
          <img
            src="/brand/adaptiv-symbol-nobg.png"
            alt="Motif"
            className="w-96 h-96 object-contain"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold max-w-2xl mx-auto">
            Siap Membuktikan Kemampuan Beradaptasi Nyata Siswa Anda?
          </h2>
          <p className="text-sm text-blue-200 max-w-xl mx-auto leading-relaxed">
            Coba simulasi penilaian interaktif sekarang juga tanpa instalasi. Jelajahi peran sebagai Siswa SMK, Guru Penilai, atau Mitra Industri.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => onEnterDemo('sesi')}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#4A8BFF] hover:bg-white text-[#0F1B4A] text-sm font-bold transition-all shadow-xl hover:scale-105 active:scale-95"
            >
              <span>Jelajahi Demo Interaktif Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenBrandKit}
              className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold transition-colors"
            >
              <Palette className="w-4 h-4 text-[#4A8BFF]" />
              <span>Unduh Logo No-BG</span>
            </button>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="py-12 bg-white border-t border-[#E3E8F8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#E3E8F8]">
            <Logo variant="horizontal" transparent={true} size="md" />
            
            <div className="flex flex-wrap items-center gap-6 text-xs text-[#5B6585] font-semibold">
              <a href="#hero" className="hover:text-[#0F1B4A]">Beranda</a>
              <a href="#simulator" className="hover:text-[#0F1B4A]">Simulator Radar</a>
              <a href="#mitra" className="hover:text-[#0F1B4A]">Mitra Industri</a>
              <button onClick={() => onEnterDemo('sesi')} className="text-[#3F55F0] hover:underline font-bold">
                Masuk ke Demo
              </button>
              <button onClick={onOpenBrandKit} className="text-[#3F55F0] hover:underline">
                Unduh Logo No-BG
              </button>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5B6585]">
            <p>© 2026 Adaptiv Platform Penilaian Dinamis. Hak Cipta Dilindungi Undang-Undang.</p>
            <p>Kepatuhan Standar PUIL 2020 &amp; UU Perlindungan Data Pribadi (UU PDP).</p>
          </div>
        </div>
      </footer>

    </div>
  );
};
