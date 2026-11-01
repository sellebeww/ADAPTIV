/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { verifyUrl } from '../../utils/passports';
import { AbilityPassport, HistoricalSessionRecord } from '../../types/adaptiv';
import { Logo } from '../brand/Logo';
import { SkillTrendChart } from './SkillTrendChart';
import {
  QrCode,
  Share2,
  ExternalLink,
  ShieldCheck,
  Award,
  Sparkles,
  CheckCircle2,
  Printer,
  Layers,
  ArrowLeft,
} from 'lucide-react';

interface PassportViewProps {
  passport: AbilityPassport;
  onBackToSession: () => void;
  backLabel?: string;
  sessionHistory?: HistoricalSessionRecord[];
}

export const PassportView: React.FC<PassportViewProps> = ({ 
  passport, 
  onBackToSession,
  backLabel = 'Sesi Uji',
  sessionHistory 
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  const link = verifyUrl(passport.publicCode);
  const [qr, setQr] = useState('');
  useEffect(() => {
    let live = true;
    QRCode.toDataURL(link, { margin: 1, width: 160, color: { dark: '#0F1B4A', light: '#FFFFFF' } })
      .then((url) => live && setQr(url))
      .catch(() => live && setQr(''));
    return () => {
      live = false;
    };
  }, [link]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      // Clipboard API is blocked on insecure origins and some embedded views; let the user copy by hand.
      window.prompt('Salin tautan verifikasi:', link);
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Math coordinates for 5-axis Radar Chart (Pentagon)
  // 5 dimensions: Prediksi, Penyesuaian, Hasil, Kemandirian, Evaluasi
  const dimensions = passport.dimensions;
  const numAxes = dimensions.length;
  const cx = 150;
  const cy = 150;
  const radius = 100;

  const getCoordinates = (index: number, value: number, maxValue: number) => {
    const angle = (Math.PI * 2 / numAxes) * index - Math.PI / 2;
    const r = (value / maxValue) * radius;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle)
    };
  };

  // Polygon points for score polygon
  const polygonPoints = dimensions
    .map((dim, i) => {
      const { x, y } = getCoordinates(i, dim.score, dim.maxScore);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="space-y-6">
      
      <button
        onClick={onBackToSession}
        className="print:hidden inline-flex items-center gap-1.5 text-xs font-semibold text-[#3F55F0] hover:underline"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Kembali ke {backLabel}
      </button>

      {/* Top Action Bar */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl bg-white border border-[#E3E8F8] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#3F55F0]/10 flex items-center justify-center text-[#3F55F0]">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#0F1B4A]">
              Paspor Kemampuan Adaptiv (Output Resmi)
            </h2>
            <p className="text-xs text-[#5B6585]">
              Bukti autentik adaptabilitas kerja berdasarkan standar Dynamic Assessment.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E3E8F8] hover:border-[#3F55F0] bg-white text-xs font-semibold text-[#0F1B4A] transition-colors"
          >
            {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> : <Share2 className="w-3.5 h-3.5 text-[#5B6585]" />}
            {copiedLink ? 'Tersalin' : 'Bagikan Tautan'}
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3F55F0] hover:bg-[#2A38B8] text-white text-xs font-semibold transition-all shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            Cetak / Ekspor PDF
          </button>
        </div>
      </div>

      {/* Official Certificate Card with Adaptiv Branding */}
      <div className="p-6 sm:p-10 rounded-3xl bg-white border-2 border-[#E3E8F8] shadow-lg relative overflow-hidden space-y-8 print:border-none print:shadow-none">
        
        {/* Subtle Brand Watermark Background */}
        <div className="absolute right-0 top-0 opacity-[0.03] pointer-events-none -translate-y-8 translate-x-8">
          <img
            src="/brand/adaptiv-symbol-nobg.png"
            alt="Watermark"
            className="w-96 h-96 object-contain"
          />
        </div>

        {/* Certificate Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-[#E3E8F8]">
          <Logo variant="horizontal" transparent={true} size="lg" />
          
          <div className="text-left sm:text-right space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5" />
              Terverifikasi Lembaga &amp; Industri
            </span>
            <div className="text-xs font-mono text-[#5B6585]">
              Nomor Verifikasi: <strong className="text-[#0F1B4A]">{passport.publicCode}</strong>
            </div>
            <div className="text-[11px] text-[#5B6585]">
              Diterbitkan: {passport.issuedAt} | {passport.participant.institutionName}
            </div>
          </div>
        </div>

        {/* Participant & Score Banner */}
        <div className="stagger grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl bg-[#F6F8FF] border border-[#E3E8F8]">
          <div className="space-y-1 md:col-span-2">
            <span className="text-xs font-semibold text-[#3F55F0] uppercase tracking-wider">
              Pemegang Paspor Kemampuan
            </span>
            <h1 className="text-2xl font-black text-[#0F1B4A]">
              {passport.participant.name}
            </h1>
            <div className="text-xs text-[#5B6585]">
              NISN: <span className="font-mono font-medium text-[#0F1B4A]">{passport.participant.nisn}</span> • {passport.participant.major} ({passport.participant.class})
            </div>
            <div className="mt-3 text-xs text-[#0F1B4A]">
              <strong>Kompetensi Teruji:</strong> {passport.competency.name}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#E3E8F8] flex flex-col justify-center items-center text-center shadow-xs">
            <span className="text-[10px] font-bold text-[#5B6585] uppercase tracking-wider">
              Indeks Adaptasi Resmi (IA)
            </span>
            <div className="text-3xl font-black text-[#3F55F0] font-mono mt-1">
              {passport.result.adaptationIndex}
              <span className="text-sm font-normal text-[#5B6585]"> / 100</span>
            </div>
            <span className="mt-1 px-3 py-0.5 rounded-full text-xs font-extrabold bg-[#3F55F0]/10 text-[#3F55F0]">
              {passport.result.level}
            </span>
          </div>
        </div>

        {/* 5-Dimensional Radar Chart & Sub-Scores */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Custom SVG Radar Chart */}
          <div className="flex flex-col items-center p-4 rounded-2xl bg-white border border-[#E3E8F8]">
            <h4 className="text-xs font-bold text-[#0F1B4A] uppercase tracking-wider mb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#3F55F0]" />
              Grafik Radar 5 Dimensi Adaptasi
            </h4>
            
            <div className="relative w-full max-w-[440px] aspect-[22/16]">
              <svg viewBox="-70 -20 440 320" className="w-full h-full overflow-visible">
                {/* Background grid concentric pentagons */}
                {[0.25, 0.5, 0.75, 1.0].map((level, lIdx) => {
                  const gridPoints = dimensions.map((_, i) => {
                    const { x, y } = getCoordinates(i, level * 4, 4);
                    return `${x},${y}`;
                  }).join(' ');
                  return (
                    <polygon
                      key={lIdx}
                      points={gridPoints}
                      fill="none"
                      stroke="#E3E8F8"
                      strokeWidth="1.2"
                      strokeDasharray={level === 1 ? 'none' : '3,3'}
                    />
                  );
                })}

                {/* Axes lines */}
                {dimensions.map((_, i) => {
                  const { x, y } = getCoordinates(i, 4, 4);
                  return (
                    <line
                      key={i}
                      x1={cx}
                      y1={cy}
                      x2={x}
                      y2={y}
                      stroke="#E3E8F8"
                      strokeWidth="1.2"
                    />
                  );
                })}

                {/* Radar Fill Area */}
                <polygon
                  points={polygonPoints}
                  fill="#4A8BFF"
                  fillOpacity="0.25"
                  stroke="#3F55F0"
                  strokeWidth="2.5"
                />

                {/* Points on radar */}
                {dimensions.map((dim, i) => {
                  const { x, y } = getCoordinates(i, dim.score, dim.maxScore);
                  return (
                    <g key={i}>
                      <circle
                        cx={x}
                        cy={y}
                        r="5"
                        fill="#3F55F0"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                      />
                    </g>
                  );
                })}

                {/* Labels: sisi kiri/kanan menempel keluar dari sumbu agar tidak menimpa titik data */}
                {dimensions.map((dim, i) => {
                  const angle = (Math.PI * 2 / numAxes) * i - Math.PI / 2;
                  const cos = Math.cos(angle);
                  const sin = Math.sin(angle);
                  const gap = radius + 18;
                  const side = Math.abs(cos) < 0.2 ? 'middle' : cos > 0 ? 'start' : 'end';
                  const x = cx + gap * cos;
                  const y = cy + gap * sin + (sin > 0.5 ? 6 : 0);
                  return (
                    <text
                      key={i}
                      x={x}
                      y={y}
                      textAnchor={side}
                      dominantBaseline="central"
                      className="text-[10px] font-bold fill-[#0F1B4A]"
                    >
                      <tspan x={x} dy="-0.6em">{dim.label}</tspan>
                      <tspan x={x} dy="1.3em" className="fill-[#5B6585] font-semibold">({dim.score}/4)</tspan>
                    </text>
                  );
                })}
              </svg>
            </div>
            <div className="text-[11px] text-[#5B6585] text-center mt-2">
              Formula: IA = 100 × (0.20P + 0.30K + 0.25H + 0.15M + 0.10E) / 4
            </div>
          </div>

          {/* Breakdown Metrics */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-[#0F1B4A] uppercase tracking-wider">
              Rincian Dimensi Kemampuan
            </h4>
            <div className="space-y-3">
              {dimensions.map((dim) => (
                <div key={dim.key} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-[#0F1B4A]">{dim.label}</span>
                    <span className="text-[#3F55F0] font-mono font-bold">
                      {dim.score} / {dim.maxScore}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#E3E8F8] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#3F55F0] to-[#4A8BFF] rounded-full"
                      style={{ width: `${(dim.score / dim.maxScore) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#E3E8F8] grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#F6F8FF] border border-[#E3E8F8]">
                <span className="text-[#5B6585] block text-[11px]">Selisih Transfer</span>
                <span className="font-bold text-[#0F1B4A] text-sm font-mono">
                  {passport.result.transferGap}
                </span>
                <p className="text-[10px] text-[#5B6585] mt-0.5">Penurunan skor minimal saat variasi.</p>
              </div>
              <div className="p-3 rounded-xl bg-[#F6F8FF] border border-[#E3E8F8]">
                <span className="text-[#5B6585] block text-[11px]">Kalibrasi Diri</span>
                <span className="font-bold text-[#0F1B4A] text-sm font-mono">
                  {passport.result.calibration}
                </span>
                <p className="text-[10px] text-[#5B6585] mt-0.5">Akurasi estimasi vs performa nyata.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Tren Peningkatan Keterampilan Multi-Sesi (Recharts) */}
        <SkillTrendChart
          sessionHistory={sessionHistory || passport.sessionHistory}
          currentSessionScore={passport.result.adaptationIndex}
        />

        {/* Peta Batas Kemampuan (Matriks Kategori Perubahan) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-[#0F1B4A] uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#3F55F0]" />
              Peta Batas Kemampuan (Adaptability Boundary Matrix)
            </h4>
            <span className="text-[11px] text-[#5B6585]">
              Menandai kategori variasi yang sudah dikuasai dan batas tantangan
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {passport.categoryMastery.map((item) => (
              <div
                key={item.category}
                className={`p-3.5 rounded-2xl border transition-all ${
                  item.mastered
                    ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                    : 'bg-amber-50/50 border-amber-200 text-amber-950'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold">{item.label}</span>
                  {item.mastered ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-200 text-amber-800">
                      Batas
                    </span>
                  )}
                </div>
                <div className="text-[10px] opacity-75">
                  {item.mastered ? 'Terbukti Adaptif' : 'Perlu Penguatan Lanjutan'} ({item.testedCount}x uji)
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certificate Verification Footer */}
        <div className="p-4 rounded-2xl bg-[#0F1B4A] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-xl bg-white p-1 flex items-center justify-center shrink-0">
              {qr ? <img src={qr} alt={`QR code verifikasi paspor ${passport.publicCode}`} className="w-full h-full" /> : <QrCode className="w-10 h-10 text-[#0F1B4A]" />}
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#4A8BFF]" />
                Verifikasi Integritas Publik
              </div>
              <p className="text-[11px] text-blue-200">
                Pindai kode QR atau buka tautan resmi: <span className="font-mono underline text-white">{link}</span>
              </p>
            </div>
          </div>

          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-[#3F55F0] hover:bg-[#4A8BFF] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            Buka Halaman Verifikasi
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>

    </div>
  );
};
