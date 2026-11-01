/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, CheckCircle2, AlertTriangle, ArrowRight, Info, ShieldCheck, Power } from 'lucide-react';

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

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E3E8F8] shadow-xs space-y-5">
      
      {/* Top Header & Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3E8F8]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#3F55F0]/10 text-[#3F55F0] uppercase tracking-wider">
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
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
              powerOn 
                ? 'bg-emerald-600 text-white shadow-xs' 
                : 'bg-slate-300 text-slate-700'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>MCB 2A: {powerOn ? 'ON (220V)' : 'TRIP / OFF'}</span>
          </button>

          <span className="text-[#5B6585] hidden sm:inline">•</span>

          <span className="text-[#5B6585]">
            Status Lampu: <strong className={isLampOn ? 'text-amber-600' : 'text-slate-500'}>
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

      {/* Circuit Schematic SVG Canvas with Animated Current Flow */}
      <div className="relative w-full h-64 sm:h-72 bg-[#0F1B4A] rounded-2xl p-4 overflow-hidden border border-[#E3E8F8] flex items-center justify-center">
        
        {/* Subtle grid lines background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#4A8BFF_1px,transparent_1px)] [background-size:16px_16px]" />

        <svg viewBox="0 0 600 240" className="w-full h-full max-w-lg">
          <defs>
            {/* Animated flow pattern for Phase wire */}
            <pattern id="flow-line" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="5" cy="10" r="2" fill="#4A8BFF" />
            </pattern>
          </defs>

          {/* Neutral Wire (Blue #4A8BFF / Cyan) - Always connected to Lamp Shell */}
          <path
            d="M 60 190 L 520 190 L 520 115"
            fill="none"
            stroke="#4A8BFF"
            strokeWidth="3"
            strokeDasharray={powerOn ? "4,4" : "none"}
            className={powerOn ? "animate-pulse" : ""}
          />
          <text x="70" y="210" fill="#4A8BFF" fontSize="10" fontWeight="bold">
            Kawat Netral (N - Biru)
          </text>

          {/* Phase Wire from MCB to Switch 1 */}
          <path
            d="M 60 70 L 140 70"
            fill="none"
            stroke={powerOn ? "#F59E0B" : "#64748B"}
            strokeWidth="3.5"
          />
          <text x="65" y="55" fill="#F59E0B" fontSize="10" fontWeight="bold">
            Fasa (L - Hitam 220V)
          </text>

          {/* MCB Icon Box */}
          <rect x="90" y="52" width="36" height="36" rx="6" fill="#1E2888" stroke="#3F55F0" strokeWidth="2" />
          <text x="108" y="74" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">
            MCB
          </text>

          {/* Render circuit logic based on circuitType */}
          {circuitType === 'base' ? (
            /* BASE TASK: SINGLE SWITCH */
            <g>
              {/* Switch 1 Box */}
              <rect x="220" y="45" width="80" height="50" rx="10" fill="#1E2888" stroke="#3F55F0" strokeWidth="2" />
              <text x="260" y="65" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">
                Saklar Tunggal
              </text>
              <text x="260" y="82" fill={switch1On ? "#10B981" : "#EF4444"} fontSize="9" textAnchor="middle">
                {switch1On ? "TERTUTUP (ON)" : "TERBUKA (OFF)"}
              </text>

              {/* Wire: MCB to Switch */}
              <line x1="140" y1="70" x2="220" y2="70" stroke={powerOn ? "#F59E0B" : "#64748B"} strokeWidth="3" />

              {/* Wire: Switch to Lamp */}
              <path
                d="M 300 70 L 480 70 L 480 85"
                fill="none"
                stroke={powerOn && switch1On ? "#F59E0B" : "#64748B"}
                strokeWidth="3"
                strokeDasharray={powerOn && switch1On ? "6,4" : "none"}
              />

              <text x="360" y="60" fill="#E2E8F0" fontSize="9">
                Fasa Terputus ke Fiting
              </text>
            </g>
          ) : (
            /* VARIATION: TWO-WAY SWITCHES (SPDT) WITH STRAPPING WIRES */
            <g>
              {/* Switch Tukar 1 */}
              <rect x="170" y="40" width="80" height="60" rx="10" fill="#1E2888" stroke="#3F55F0" strokeWidth="2" />
              <text x="210" y="58" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">
                Saklar Tukar 1
              </text>
              <text x="210" y="74" fill="#4A8BFF" fontSize="8" textAnchor="middle">
                Common [0]
              </text>
              <text x="210" y="88" fill="#93C5FD" fontSize="8" textAnchor="middle">
                Posisi: {switch1On ? "T-1 (Atas)" : "T-2 (Bawah)"}
              </text>

              {/* Wire MCB to Switch 1 Common */}
              <line x1="140" y1="70" x2="170" y2="70" stroke={powerOn ? "#F59E0B" : "#64748B"} strokeWidth="3" />

              {/* Switch Tukar 2 */}
              <rect x="360" y="40" width="80" height="60" rx="10" fill="#1E2888" stroke="#3F55F0" strokeWidth="2" />
              <text x="400" y="58" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">
                Saklar Tukar 2
              </text>
              <text x="400" y="74" fill="#4A8BFF" fontSize="8" textAnchor="middle">
                Common [0]
              </text>
              <text x="400" y="88" fill="#93C5FD" fontSize="8" textAnchor="middle">
                Posisi: {switch2On ? "T-1 (Atas)" : "T-2 (Bawah)"}
              </text>

              {/* Strapping Wire 1 (Top: Terminal 1 to 1) */}
              <path
                d="M 250 55 L 360 55"
                fill="none"
                stroke={powerOn && switch1On ? "#F59E0B" : "#475569"}
                strokeWidth="2.5"
                strokeDasharray="4,4"
              />
              <text x="305" y="48" fill="#94A3B8" fontSize="8" textAnchor="middle">
                Strapping Wire 1 [T-1]
              </text>

              {/* Strapping Wire 2 (Bottom: Terminal 2 to 2) */}
              <path
                d="M 250 85 L 360 85"
                fill="none"
                stroke={powerOn && !switch1On ? "#F59E0B" : "#475569"}
                strokeWidth="2.5"
                strokeDasharray="4,4"
              />
              <text x="305" y="98" fill="#94A3B8" fontSize="8" textAnchor="middle">
                Strapping Wire 2 [T-2]
              </text>

              {/* Output from Switch 2 Common to Lamp */}
              <path
                d="M 440 70 L 485 70 L 485 85"
                fill="none"
                stroke={isLampOn ? "#F59E0B" : "#64748B"}
                strokeWidth="3"
                strokeDasharray={isLampOn ? "6,4" : "none"}
              />
            </g>
          )}

          {/* Lamp Unit with Realistic Glow Effect */}
          <g transform="translate(480, 85)">
            {/* Glow Aura */}
            {isLampOn && (
              <circle
                cx="20"
                cy="20"
                r="38"
                fill="#FBBF24"
                fillOpacity="0.35"
                className="animate-pulse"
              />
            )}
            {/* Glass Bulb */}
            <circle
              cx="20"
              cy="20"
              r="22"
              fill={isLampOn ? "#FEF08A" : "#334155"}
              stroke={isLampOn ? "#F59E0B" : "#64748B"}
              strokeWidth="2"
            />
            {/* Filament */}
            <path
              d="M 15 22 Q 20 12 25 22"
              fill="none"
              stroke={isLampOn ? "#D97706" : "#475569"}
              strokeWidth="2"
            />
            {/* Base */}
            <rect x="14" y="38" width="12" height="8" fill="#94A3B8" rx="2" />
            <text x="20" y="58" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">
              Lampu 15W
            </text>
          </g>

          {/* Grounding Wire (Green/Yellow) */}
          <path
            d="M 60 220 L 520 220"
            fill="none"
            stroke="#16A34A"
            strokeWidth="2"
            strokeDasharray="8,4"
          />
          <text x="70" y="235" fill="#16A34A" fontSize="9">
            Pentanahan / Grounding (PE - Hijau/Kuning)
          </text>
        </svg>

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
