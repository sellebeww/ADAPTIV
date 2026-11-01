/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { HistoricalSessionRecord } from '../../types/adaptiv';
import {
  TrendingUp,
  ArrowUpRight,
  History,
} from 'lucide-react';

interface SkillTrendChartProps {
  sessionHistory?: HistoricalSessionRecord[];
  currentSessionScore?: number;
}

export const SkillTrendChart: React.FC<SkillTrendChartProps> = ({
  sessionHistory = [],
  currentSessionScore
}) => {
  // Chart View Options: 'ia_overall' | 'dimensions' | 'transfer_gap'
  const [viewMode, setViewMode] = useState<'ia_overall' | 'dimensions' | 'transfer_gap'>('ia_overall');
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    sessionHistory.length > 0 ? sessionHistory[sessionHistory.length - 1].id : null
  );

  // If no history is provided, show placeholder state
  if (!sessionHistory || sessionHistory.length === 0) {
    return (
      <div className="p-6 rounded-3xl bg-[#F6F8FF] border border-[#E3E8F8] text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-white border border-[#E3E8F8] mx-auto flex items-center justify-center text-[#5B6585]">
          <History className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-[#0F1B4A]">
          Belum Ada Riwayat Sesi Sebelumnya
        </h4>
        <p className="text-xs text-[#5B6585] max-w-md mx-auto">
          Grafik tren perkembangan adaptabilitas akan otomatis muncul setelah peserta menyelesaikan minimal 2 sesi penilaian dengan variasi tugas yang berbeda.
        </p>
      </div>
    );
  }

  // Calculate Growth Insights
  const firstSession = sessionHistory[0];
  const latestSession = sessionHistory[sessionHistory.length - 1];
  const scoreDiff = latestSession.adaptationIndex - firstSession.adaptationIndex;
  const percentGrowth = Math.round((scoreDiff / firstSession.adaptationIndex) * 100);
  const gapDiff = (firstSession.transferGap - latestSession.transferGap).toFixed(1);

  // Format data for recharts
  const chartData = sessionHistory.map((sess) => ({
    id: sess.id,
    sessionCode: sess.sessionCode,
    name: sess.date,
    fullName: sess.title,
    variationType: sess.variationType,
    level: sess.level,
    adaptationIndex: sess.adaptationIndex,
    transferGap: sess.transferGap,
    prediksi: sess.dimensionScores.prediksi,
    penyesuaian: sess.dimensionScores.penyesuaian,
    hasil: sess.dimensionScores.hasil,
    kemandirian: sess.dimensionScores.kemandirian,
    evaluasi: sess.dimensionScores.evaluasi,
    notes: sess.notes
  }));

  const activeSessionDetail = sessionHistory.find((s) => s.id === selectedSessionId) || latestSession;

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-3.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#E3E8F8] text-xs space-y-2 min-w-[220px]">
          <div className="flex items-center justify-between border-b border-[#E3E8F8] pb-1.5">
            <span className="font-bold text-[#0F1B4A]">{data.sessionCode}</span>
            <span className="text-xs text-[#5B6585]">{data.name}</span>
          </div>
          <div>
            <div className="font-bold text-[#0F1B4A] text-xs line-clamp-1">{data.fullName}</div>
            <div className="text-xs text-[#5B6585]">{data.variationType}</div>
          </div>
          
          <div className="p-2 rounded-xl bg-[#F6F8FF] border border-[#E3E8F8] space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#5B6585]">Indeks Adaptasi:</span>
              <span className="font-mono font-bold text-[#3F55F0] text-sm">
                {data.adaptationIndex} / 100
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#5B6585]">Tingkat:</span>
              <span className="font-semibold text-emerald-700 text-xs">
                {data.level}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#5B6585]">Selisih Transfer:</span>
              <span className="font-mono font-bold text-[#0F1B4A] text-xs">
                {data.transferGap}
              </span>
            </div>
          </div>

          {viewMode === 'dimensions' && (
            <div className="grid grid-cols-2 gap-1 text-xs pt-1">
              <div className="text-[#8B5CF6]">Prediksi: {data.prediksi}/4</div>
              <div className="text-[#10B981]">Penyesuaian: {data.penyesuaian}/4</div>
              <div className="text-[#F59E0B]">Hasil: {data.hasil}/4</div>
              <div className="text-[#06B6D4]">Kemandirian: {data.kemandirian}/4</div>
              <div className="text-[#EC4899] col-span-2">Evaluasi Diri: {data.evaluasi}/4</div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-5 p-5 sm:p-7 rounded-3xl bg-white border border-[#E3E8F8] shadow-xs">
      
      {/* Top Header & Mode Toggle */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#E3E8F8]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#3F55F0]/10 text-[#3F55F0] uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              Riwayat Tren Perkembangan Adaptabilitas
            </span>
            <span className="text-xs text-[#5B6585] hidden sm:inline">
              Multi-Sesi ({sessionHistory.length} Sesi Teruji)
            </span>
          </div>
          <h3 className="text-base font-bold text-[#0F1B4A] mt-1">
            Trajektori Peningkatan Keterampilan &amp; Reduksi Transfer Gap
          </h3>
        </div>

        {/* Chart View Modes */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F6F8FF] rounded-xl border border-[#E3E8F8] self-start lg:self-auto">
          <button
            onClick={() => setViewMode('ia_overall')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'ia_overall'
                ? 'bg-white text-[#3F55F0] shadow-xs ring-1 ring-[#3F55F0]/20'
                : 'text-[#5B6585] hover:text-[#0F1B4A]'
            }`}
          >
            Indeks Adaptasi (IA)
          </button>
          <button
            onClick={() => setViewMode('dimensions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'dimensions'
                ? 'bg-white text-[#3F55F0] shadow-xs ring-1 ring-[#3F55F0]/20'
                : 'text-[#5B6585] hover:text-[#0F1B4A]'
            }`}
          >
            5 Sub-Dimensi (0-4)
          </button>
          <button
            onClick={() => setViewMode('transfer_gap')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'transfer_gap'
                ? 'bg-white text-[#3F55F0] shadow-xs ring-1 ring-[#3F55F0]/20'
                : 'text-[#5B6585] hover:text-[#0F1B4A]'
            }`}
          >
            Selisih Transfer
          </button>
        </div>
      </div>

      {/* KPI Growth Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-[#F6F8FF] border border-[#E3E8F8]">
          <span className="text-[11px] font-bold text-[#5B6585] uppercase tracking-wider block">
            Pertumbuhan Skor IA
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl font-black text-[#3F55F0] font-mono">
              +{scoreDiff}
            </span>
            <span className="text-xs font-bold text-emerald-700 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +{percentGrowth}%
            </span>
          </div>
          <span className="text-xs text-[#5B6585] mt-0.5 block">
            Dari {firstSession.adaptationIndex} ke {latestSession.adaptationIndex}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#F6F8FF] border border-[#E3E8F8]">
          <span className="text-[11px] font-bold text-[#5B6585] uppercase tracking-wider block">
            Reduksi Transfer Gap
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl font-black text-[#0F1B4A] font-mono">
              {firstSession.transferGap} → {latestSession.transferGap}
            </span>
          </div>
          <span className="text-xs text-emerald-700 font-semibold mt-0.5 block">
            Penurunan {gapDiff} poin (Makin Adaptif)
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#F6F8FF] border border-[#E3E8F8]">
          <span className="text-[11px] font-bold text-[#5B6585] uppercase tracking-wider block">
            Kenaikan Status Level
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-sm font-extrabold text-emerald-700">
              {latestSession.level}
            </span>
          </div>
          <span className="text-xs text-[#5B6585] mt-0.5 block">
            Awal: {firstSession.level}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#F6F8FF] border border-[#E3E8F8]">
          <span className="text-[11px] font-bold text-[#5B6585] uppercase tracking-wider block">
            Ambang Industri
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-black text-[#0F1B4A] font-mono">
              ≥ 70.0
            </span>
          </div>
          <span className="text-xs text-emerald-700 font-semibold mt-0.5 block">
            Terlampaui ({latestSession.adaptationIndex - 70} poin di atas batas)
          </span>
        </div>
      </div>

      {/* Main Recharts Container */}
      <div className="h-[280px] sm:h-[320px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'ia_overall' ? (
            <ComposedChart data={chartData} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
              <defs>
                <linearGradient id="iaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3F55F0" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3F55F0" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E3E8F8" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#5B6585" 
                fontSize={11} 
                tickLine={false}
                axisLine={{ stroke: '#E3E8F8' }}
              />
              <YAxis 
                domain={[40, 100]} 
                stroke="#5B6585" 
                fontSize={11} 
                tickLine={false}
                axisLine={{ stroke: '#E3E8F8' }}
                ticks={[40, 55, 70, 85, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine 
                y={70} 
                stroke="#10B981" 
                strokeDasharray="4 4" 
                label={{ 
                  value: 'Batas Kesiapan Industri (IA ≥ 70)', 
                  fill: '#10B981', 
                  fontSize: 10,
                  position: 'insideTopLeft' 
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="adaptationIndex" 
                fill="url(#iaGradient)" 
                stroke="#3F55F0" 
                strokeWidth={3}
                name="Indeks Adaptasi (IA)"
              />
              <Line
                type="monotone"
                dataKey="adaptationIndex"
                stroke="#3F55F0"
                strokeWidth={3}
                dot={{ r: 5, fill: '#3F55F0', stroke: '#FFFFFF', strokeWidth: 2 }}
                activeDot={{ r: 8, fill: '#2A38B8', stroke: '#FFFFFF', strokeWidth: 2 }}
                name="Indeks Adaptasi (IA)"
              />
            </ComposedChart>
          ) : viewMode === 'dimensions' ? (
            <ComposedChart data={chartData} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E3E8F8" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#5B6585" 
                fontSize={11} 
                tickLine={false}
                axisLine={{ stroke: '#E3E8F8' }}
              />
              <YAxis 
                domain={[0, 4]} 
                stroke="#5B6585" 
                fontSize={11} 
                tickLine={false}
                axisLine={{ stroke: '#E3E8F8' }}
                ticks={[0, 1, 2, 3, 4]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: 11, paddingTop: 10 }} 
                iconType="circle"
              />
              <Line type="monotone" dataKey="prediksi" name="Prediksi" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="penyesuaian" name="Penyesuaian" stroke="#10B981" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="hasil" name="Hasil Kerja" stroke="#F59E0B" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="kemandirian" name="Kemandirian" stroke="#06B6D4" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="evaluasi" name="Evaluasi Diri" stroke="#EC4899" strokeWidth={2} dot={{ r: 4 }} />
            </ComposedChart>
          ) : (
            <ComposedChart data={chartData} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
              <defs>
                <linearGradient id="gapGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E3E8F8" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#5B6585" 
                fontSize={11} 
                tickLine={false}
                axisLine={{ stroke: '#E3E8F8' }}
              />
              <YAxis 
                domain={[0, 2]} 
                stroke="#5B6585" 
                fontSize={11} 
                tickLine={false}
                axisLine={{ stroke: '#E3E8F8' }}
                ticks={[0, 0.5, 1.0, 1.5, 2.0]}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine 
                y={0.5} 
                stroke="#10B981" 
                strokeDasharray="4 4" 
                label={{ 
                  value: 'Batas Gap Ideal (≤ 0.5)', 
                  fill: '#10B981', 
                  fontSize: 10,
                  position: 'insideTopLeft' 
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="transferGap" 
                fill="url(#gapGradient)" 
                stroke="#EF4444" 
                strokeWidth={2.5}
                name="Selisih Transfer (Gap)"
              />
              <Line
                type="monotone"
                dataKey="transferGap"
                stroke="#EF4444"
                strokeWidth={2.5}
                dot={{ r: 5, fill: '#EF4444', stroke: '#FFFFFF', strokeWidth: 2 }}
                name="Selisih Transfer"
              />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Historical Sessions Interactive Cards */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#0F1B4A] uppercase tracking-wider flex items-center gap-1.5">
            <History className="w-4 h-4 text-[#3F55F0]" />
            Daftar Sesi Terverifikasi dalam Paspor
          </span>
          <span className="text-xs text-[#5B6585]">
            Klik sesi untuk melihat catatan evaluator
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {sessionHistory.map((sess) => {
            const isSelected = sess.id === activeSessionDetail.id;
            return (
              <button
                key={sess.id}
                onClick={() => setSelectedSessionId(sess.id)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-[#3F55F0]/5 border-[#3F55F0] ring-2 ring-[#3F55F0]/20 shadow-xs'
                    : 'bg-white border-[#E3E8F8] hover:border-[#3F55F0]/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#3F55F0]">
                    {sess.sessionCode}
                  </span>
                  <span className="text-xs text-[#5B6585]">
                    {sess.date}
                  </span>
                </div>
                <div className="text-xs font-bold text-[#0F1B4A] line-clamp-1">
                  {sess.title}
                </div>
                <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#E3E8F8]/60">
                  <span className="text-xs text-[#5B6585]">Skor IA:</span>
                  <span className="font-mono font-bold text-xs text-[#3F55F0]">
                    {sess.adaptationIndex}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Session Detail Callout */}
        {activeSessionDetail && (
          <div className="p-3.5 rounded-2xl bg-[#F6F8FF] border border-[#E3E8F8] text-xs space-y-1.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#0F1B4A]">
                  {activeSessionDetail.sessionCode} • {activeSessionDetail.title}
                </span>
                <span className="px-2 py-0.2 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  {activeSessionDetail.level}
                </span>
              </div>
              <span className="text-xs text-[#5B6585]">
                {activeSessionDetail.variationType} (Tingkat {activeSessionDetail.difficulty}/5)
              </span>
            </div>
            {activeSessionDetail.notes && (
              <p className="text-xs text-[#5B6585] leading-relaxed">
                <strong>Catatan Evaluator:</strong> {activeSessionDetail.notes}
              </p>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
