/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Zap, Info, Power } from 'lucide-react';

/** Kabel dengan warna aktif; saat dialiri arus, titik putih bergerak mengikuti arah arus. */
const Wire: React.FC<{ d: string; on: boolean; color: string }> = ({ d, on, color }) => (
  <g fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} stroke={on ? color : '#94A3B8'} strokeOpacity={on ? 1 : 0.6} strokeWidth={5} />
    {on && <path d={d} stroke="#FFFFFF" strokeOpacity={0.9} strokeWidth={2.5} strokeDasharray="1 16" className="circuit-flow" />}
  </g>
);

/** Titik terminal. */
const Dot: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <circle cx={x} cy={y} r={7} fill="#0F1B4A" stroke="#E2E8F0" strokeWidth={3} />
);

/** Saklar tukar (SPDT): terminal common di satu sisi, T-1 dan T-2 di sisi lain, tuas menunjuk posisi aktif. */
const SpdtSwitch: React.FC<{ x: number; y: number; mirrored: boolean; title: string; on: boolean; powerOn: boolean }> = ({
  x, y, mirrored, title, on, powerOn,
}) => {
  const w = 140;
  const commonX = mirrored ? x + w : x;
  const throwX = mirrored ? x : x + w;
  const targetY = on ? y + 70 : y + 120; // T-1 (atas) atau T-2 (bawah)
  return (
    <g>
      <rect x={x} y={y} width={w} height={160} rx={12} fill="#1E2888" stroke="#6D80FF" strokeWidth={3} />
      <text x={x + w / 2} y={y + 25} fill="#FFFFFF" fontSize="16" fontWeight="800" textAnchor="middle">{title}</text>
      <text x={x + w / 2} y={y + 44} fill="#93C5FD" fontSize="13" fontWeight="600" textAnchor="middle">Common [0]</text>
      <line
        x1={commonX} y1={y + 95} x2={throwX} y2={targetY}
        stroke={powerOn ? '#FBBF24' : '#E2E8F0'} strokeWidth={6} strokeLinecap="round"
      />
      <Dot x={commonX} y={y + 95} />
      <Dot x={throwX} y={y + 70} />
      <Dot x={throwX} y={y + 120} />
      <text x={x + w / 2} y={y + 150} fill="#FFFFFF" fontSize="14" fontWeight="700" textAnchor="middle">
        Posisi: {on ? 'T-1 (Atas)' : 'T-2 (Bawah)'}
      </text>
    </g>
  );
};

interface CircuitVisualizerProps {
  mode?: 'interactive' | 'compact';
  initialState?: 'base' | 'variation';
}

export const CircuitVisualizer: React.FC<CircuitVisualizerProps> = ({
  mode = 'interactive',
  initialState = 'base'
}) => {
  const [circuitType, setCircuitType] = useState<'base' | 'variation'>(initialState);
  const [switch1On, setSwitch1On] = useState<boolean>(true);
  const [switch2On, setSwitch2On] = useState<boolean>(false);
  const [powerOn, setPowerOn] = useState<boolean>(true);

  // Logic for whether lamp is illuminated:
  // Base: lamp is ON if power is on AND switch1 is ON
  // Variation (Two-way / Hotel switch SPDT):
  // Lamp is ON if switch1On === switch2On (both in position 1 or both in position 2)
  const isLampOn = powerOn && (circuitType === 'base' ? switch1On : switch1On === switch2On);

  const circuitSummary =
    circuitType === 'base'
      ? `Sirkuit dasar satu saklar. Daya ${powerOn ? 'hidup' : 'mati'}, saklar ${switch1On ? 'tertutup' : 'terbuka'}, lampu ${isLampOn ? 'menyala' : 'padam'}.`
      : `Sirkuit variasi dua saklar tukar. Daya ${powerOn ? 'hidup' : 'mati'}, saklar tukar 1 posisi ${switch1On ? 'T-1' : 'T-2'}, saklar tukar 2 posisi ${switch2On ? 'T-1' : 'T-2'}, lampu ${isLampOn ? 'menyala' : 'padam'}.`;

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E3E8F8] shadow-xs space-y-5">
      
      {/* Top Header & Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3E8F8]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#3F55F0]/10 text-[#3F55F0] uppercase tracking-wider">
              Visualizer Sirkuit Dinamis
            </span>
            <span className="text-xs text-[#5B6585]">
              Standar PUIL 2020 TITL
            </span>
          </div>
          <h3 className="text-base font-bold text-[#0F1B4A] mt-1">
            {circuitType === 'base' 
              ? 'Tugas Dasar: Sirkuit 1 Saklar Tunggal' 
              : 'Variasi Kondisi: Sirkuit 2 Saklar Tukar (SPDT)'}
          </h3>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F6F8FF] rounded-xl border border-[#E3E8F8]">
          <button
            onClick={() => setCircuitType('base')}
            aria-pressed={circuitType === 'base'}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              circuitType === 'base'
                ? 'bg-white text-[#0F1B4A] shadow-xs ring-1 ring-[#0F1B4A]/10'
                : 'text-[#5B6585] hover:text-[#0F1B4A]'
            }`}
          >
            Sirkuit Dasar
          </button>
          <button
            onClick={() => setCircuitType('variation')}
            aria-pressed={circuitType === 'variation'}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              circuitType === 'variation'
                ? 'bg-[#3F55F0] text-white shadow-xs'
                : 'text-[#3F55F0] hover:bg-white'
            }`}
          >
            <Zap className="w-3 h-3 text-[#4A8BFF]" />
            <span>Variasi 2 Titik</span>
          </button>
        </div>
      </div>

      {/* Interactive Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#F6F8FF] rounded-2xl border border-[#E3E8F8] text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPowerOn(!powerOn)}
            aria-pressed={powerOn}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
              powerOn 
                ? 'bg-emerald-700 text-white shadow-xs' 
                : 'bg-slate-300 text-slate-700'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>MCB 2A: {powerOn ? 'ON (220V)' : 'TRIP / OFF'}</span>
          </button>

          <span className="text-[#5B6585] hidden sm:inline">•</span>

          <span className="text-[#5B6585]">
            Status Lampu: <strong className={isLampOn ? 'text-amber-700' : 'text-slate-600'}>
              {isLampOn ? 'MENYALA TERANG (15W)' : 'PADAM'}
            </strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSwitch1On(!switch1On)}
            className="px-2.5 py-1 rounded-lg bg-white border border-[#E3E8F8] font-semibold text-[#0F1B4A] hover:border-[#3F55F0] transition-colors"
          >
            {circuitType === 'base' 
              ? `Saklar: ${switch1On ? 'Tertutup (ON)' : 'Terbuka (OFF)'}` 
              : `Saklar Tukar 1: Posisi ${switch1On ? 'A' : 'B'}`}
          </button>

          {circuitType === 'variation' && (
            <button
              onClick={() => setSwitch2On(!switch2On)}
              className="px-2.5 py-1 rounded-lg bg-white border border-[#E3E8F8] font-semibold text-[#0F1B4A] hover:border-[#3F55F0] transition-colors"
            >
              Saklar Tukar 2: Posisi {switch2On ? 'A' : 'B'}
            </button>
          )}
        </div>
      </div>

      {/* Skema sirkuit: area gulir fokusable di layar sempit agar teks tetap terbaca */}
      <div className="relative w-full bg-[#0F1B4A] rounded-2xl border border-[#E3E8F8] overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#4A8BFF_1px,transparent_1px)] [background-size:16px_16px]" />
        <div
          role="region"
          aria-label="Diagram sirkuit, geser ke samping bila terpotong"
          tabIndex={0}
          className="relative overflow-x-auto p-3 sm:p-5"
        >
          <p role="status" className="sr-only">{circuitSummary}</p>
          <svg
            viewBox="0 0 800 395"
            className="block w-full min-w-[600px] h-auto"
            role="img"
            aria-label={circuitSummary}
          >
            <defs>
              <radialGradient id="lamp-glow">
                <stop offset="0%" stopColor="#FDE047" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#FDE047" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Kawat netral (biru): masuk dari sisi kanan lampu */}
            <Wire d="M 20 315 H 750 V 205 H 724" on={isLampOn} color="#60A5FA" />
            <text x="24" y="302" fill="#93C5FD" fontSize="15" fontWeight="700">
              Kawat Netral (N · biru)
            </text>

            {/* Kawat pentanahan (hijau/kuning) */}
            <path d="M 20 358 H 750" stroke="#22C55E" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M 20 358 H 750" stroke="#FACC15" strokeWidth="5" fill="none" strokeDasharray="14 14" />
            <text x="24" y="384" fill="#86EFAC" fontSize="14" fontWeight="600">
              Pentanahan / Grounding (PE · hijau-kuning)
            </text>

            {/* Kawat fasa dari sumber ke MCB */}
            <text x="24" y="70" fill="#FBBF24" fontSize="15" fontWeight="700">
              Fasa (L · hitam 220V)
            </text>
            <Wire d="M 20 125 H 100" on={powerOn} color="#FBBF24" />

            {/* MCB */}
            <rect x="100" y="95" width="68" height="60" rx="10" fill="#1E2888" stroke={powerOn ? '#4ADE80' : '#F87171'} strokeWidth="3" />
            <text x="134" y="121" fill="#FFFFFF" fontSize="16" fontWeight="800" textAnchor="middle">MCB</text>
            <text x="134" y="142" fill={powerOn ? '#4ADE80' : '#F87171'} fontSize="13" fontWeight="700" textAnchor="middle">
              {powerOn ? 'ON' : 'OFF'}
            </text>

            {circuitType === 'base' ? (
              <g>
                <Wire d="M 168 125 H 330" on={powerOn} color="#FBBF24" />
                <rect x="330" y="70" width="160" height="110" rx="12" fill="#1E2888" stroke="#6D80FF" strokeWidth="3" />
                <text x="410" y="96" fill="#FFFFFF" fontSize="16" fontWeight="800" textAnchor="middle">Saklar Tunggal</text>
                {/* Tuas: lurus saat tertutup, terangkat saat terbuka */}
                <line
                  x1="342" y1="125" x2="478" y2={switch1On ? 125 : 105}
                  stroke={switch1On && powerOn ? '#FBBF24' : '#E2E8F0'} strokeWidth="6" strokeLinecap="round"
                />
                <Dot x={330} y={125} />
                <Dot x={490} y={125} />
                <text x="410" y="164" fill={switch1On ? '#4ADE80' : '#F87171'} fontSize="15" fontWeight="800" textAnchor="middle">
                  {switch1On ? 'TERTUTUP (ON)' : 'TERBUKA (OFF)'}
                </text>

                <Wire d="M 490 125 H 690 V 171" on={isLampOn} color="#FBBF24" />
                <text x="590" y="108" fill="#E2E8F0" fontSize="14" textAnchor="middle">
                  {isLampOn ? 'Fasa mengalir ke lampu' : 'Fasa terputus'}
                </text>
              </g>
            ) : (
              <g>
                <Wire d="M 168 125 H 200" on={powerOn} color="#FBBF24" />

                <SpdtSwitch x={200} y={30} mirrored={false} title="Saklar Tukar 1" on={switch1On} powerOn={powerOn} />
                <SpdtSwitch x={500} y={30} mirrored title="Saklar Tukar 2" on={switch2On} powerOn={powerOn} />

                {/* Kawat strapping 1 (T-1) dan 2 (T-2) */}
                <Wire d="M 340 100 H 500" on={powerOn && switch1On} color="#FBBF24" />
                <text x="420" y="88" fill="#E2E8F0" fontSize="13" fontWeight="600" textAnchor="middle">
                  Strapping Wire 1 [T-1]
                </text>
                <Wire d="M 340 150 H 500" on={powerOn && !switch1On} color="#FBBF24" />
                <text x="420" y="176" fill="#E2E8F0" fontSize="13" fontWeight="600" textAnchor="middle">
                  Strapping Wire 2 [T-2]
                </text>

                <Wire d="M 640 125 H 690 V 171" on={isLampOn} color="#FBBF24" />
              </g>
            )}

            {/* Lampu 15W */}
            <g transform="translate(690, 205)">
              {isLampOn && (
                <>
                  <circle r="78" fill="url(#lamp-glow)" className="animate-pulse" />
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
                    <line
                      key={a}
                      x1="0" y1="-46" x2="0" y2="-58"
                      stroke="#FDE047" strokeWidth="4" strokeLinecap="round"
                      transform={`rotate(${a})`}
                    />
                  ))}
                </>
              )}
              <circle r="34" fill={isLampOn ? '#FEF08A' : '#334155'} stroke={isLampOn ? '#F59E0B' : '#CBD5E1'} strokeWidth="4" />
              <path d="M -12 10 L -8 -6 L 0 6 L 8 -6 L 12 10" fill="none" stroke={isLampOn ? '#D97706' : '#CBD5E1'} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="-14" y="34" width="28" height="14" rx="3" fill="#CBD5E1" />
              <line x1="-14" y1="41" x2="14" y2="41" stroke="#64748B" strokeWidth="2" />
              <text y="74" fill="#FFFFFF" fontSize="15" fontWeight="800" textAnchor="middle">Lampu 15W</text>
              <text y="92" fill={isLampOn ? '#FDE047' : '#CBD5E1'} fontSize="13" fontWeight="700" textAnchor="middle">
                {isLampOn ? 'MENYALA' : 'PADAM'}
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* Technical Insight Box */}
      <div className="p-3.5 rounded-2xl bg-[#F6F8FF] border border-[#E3E8F8] flex items-start gap-3 text-xs">
        <Info className="w-4 h-4 text-[#3F55F0] shrink-0 mt-0.5" />
        <div className="text-[#0F1B4A] leading-relaxed">
          {circuitType === 'base' ? (
            <span>
              <strong>Karakteristik Tugas Dasar:</strong> Sirkuit hanya memiliki satu jalur fasa yang diputus oleh saklar tunggal. Kawat fasa wajib dialirkan ke lidah fiting (kontak tengah), bukan ulir luar untuk mencegah risiko sengatan listrik saat mengganti lampu.
            </span>
          ) : (
            <span>
              <strong>Tantangan Adaptasi Variasi:</strong> Siswa harus memahami prinsip <em>two-way strapping</em>. Fasa masuk ke Terminal 0 Saklar 1, dialirkan melalui sepasang kawat strapping (Terminal 1 &amp; 2), dan diteruskan ke lampu melalui Terminal 0 Saklar 2. Salah identifikasi terminal common akan menyebabkan trip MCB atau lampu gagal mati.
            </span>
          )}
        </div>
      </div>

    </div>
  );
};
