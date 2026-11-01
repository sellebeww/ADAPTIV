/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { downloadText, toCsv, escapeHtml } from '../../utils/download';
import { CURRENT_INSTITUTION } from '../../data/seedData';
import {
  BarChart3,
  FileSpreadsheet,
  AlertTriangle,
  Download,
  Check,
} from 'lucide-react';

const DISTRIBUTION = [
  { label: 'Mahir Beradaptasi (IA ≥ 80)', count: 48, pct: 33.8, color: 'bg-[#3F55F0]' },
  { label: 'Cakap Beradaptasi (60 ≤ IA < 80)', count: 64, pct: 45.1, color: 'bg-[#4A8BFF]' },
  { label: 'Berkembang (40 ≤ IA < 60)', count: 24, pct: 16.9, color: 'bg-amber-400' },
  { label: 'Tergantung Prosedur (IA < 40)', count: 6, pct: 4.2, color: 'bg-red-500' }
];

const CHALLENGES = [
  { category: 'Beban / Daya Tinggi', failureRate: '34.2%', note: 'Sering keliru menghitung KHA kabel dan tripping MCB.' },
  { category: 'Kegagalan Komponen Sengaja', failureRate: '28.1%', note: 'Membutuhkan penelusuran multitester sistematis.' },
  { category: 'Spesifikasi Kendali (Saklar Tukar)', failureRate: '15.4%', note: 'Sebagian besar siswa berhasil mengadaptasi strapping wire.' },
  { category: 'Variasi Waktu Kerja Singkat', failureRate: '11.0%', note: 'Penyesuaian kecepatan tetap memenuhi standar K3.' }
];

const STATS = [
  ['Total Sesi Diuji', '142'],
  ['Rata-rata Indeks Adaptasi', '71.8'],
  ['Kesepakatan Penilai (Kappa)', '0.86'],
  ['Korelasi Kinerja Lapangan', 'r = 0.79']
];

export const InstitutionDashboard: React.FC = () => {
  const [done, setDone] = useState<'csv' | 'laporan' | null>(null);
  const flash = (k: 'csv' | 'laporan') => {
    setDone(k);
    setTimeout(() => setDone(null), 2200);
  };

  const exportCsv = () => {
    downloadText(
      'adaptiv-rekap-lembaga.csv',
      toCsv([
        ['Bagian', 'Nama', 'Nilai', 'Keterangan'],
        ...STATS.map(([k, v]) => ['Ringkasan', k, v, '']),
        ...DISTRIBUTION.map((d) => ['Distribusi Tingkat Adaptasi', d.label, d.count, `${d.pct}%`]),
        ...CHALLENGES.map((c) => ['Kategori Variasi Menantang', c.category, c.failureRate, c.note])
      ]),
      'text/csv;charset=utf-8'
    );
    flash('csv');
  };

  const exportReport = () => {
    const rows = (items: string[][]) => items.map((r) => `<tr>${r.map((c) => `<td>${escapeHtml(c)}</td>`).join('')}</tr>`).join('');
    const html = `<!doctype html><html lang="id"><head><meta charset="utf-8"><title>Laporan Akreditasi Vokasi</title>
<style>body{font:14px/1.6 system-ui,sans-serif;color:#0F1B4A;max-width:780px;margin:40px auto;padding:0 20px}h1{font-size:22px;margin:0}h2{font-size:15px;margin:28px 0 8px;color:#2A38B8}p.m{color:#5B6585;margin:4px 0 0}table{width:100%;border-collapse:collapse}td,th{border:1px solid #E3E8F8;padding:8px 10px;text-align:left}th{background:#F6F8FF}@media print{body{margin:0}}</style></head><body>
<h1>Laporan Akreditasi Vokasi</h1><p class="m">${escapeHtml(CURRENT_INSTITUTION.name)} · NPSN ${escapeHtml(String(CURRENT_INSTITUTION.npsn))}</p>
<h2>Ringkasan Validitas Penilaian</h2><table><tr><th>Indikator</th><th>Nilai</th></tr>${rows(STATS)}</table>
<h2>Distribusi Tingkat Adaptasi Siswa (N = 142)</h2><table><tr><th>Tingkat</th><th>Siswa</th><th>Persentase</th></tr>${rows(DISTRIBUTION.map((d) => [d.label, String(d.count), `${d.pct}%`]))}</table>
<h2>Kategori Variasi Paling Menantang</h2><table><tr><th>Kategori</th><th>Tingkat Gagal</th><th>Catatan</th></tr>${rows(CHALLENGES.map((c) => [c.category, c.failureRate, c.note]))}</table>
<p class="m" style="margin-top:28px">Dihasilkan oleh Adaptiv pada ${new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}. Gunakan Cetak (Ctrl/Cmd+P) untuk menyimpan sebagai PDF.</p></body></html>`;
    downloadText('laporan-akreditasi-vokasi.html', html, 'text/html;charset=utf-8');
    flash('laporan');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E3E8F8] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#3F55F0]/10 text-[#3F55F0]">
              Dasbor Manajemen Lembaga
            </span>
            <span className="text-xs text-[#5B6585]">
              NPSN: {CURRENT_INSTITUTION.npsn}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0F1B4A] mt-1">
            {CURRENT_INSTITUTION.name}
          </h2>
          <p className="text-xs text-[#5B6585] mt-0.5">
            Analitik Validitas Penilaian, Kesepakatan Antar-Penilai, &amp; Distribusi Indeks Adaptasi Siswa.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={exportCsv} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl border border-[#E3E8F8] hover:border-[#3F55F0] bg-white text-xs font-semibold text-[#0F1B4A] transition-colors shadow-2xs">
            {done === 'csv' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Download className="w-3.5 h-3.5 text-[#5B6585]" />}
            {done === 'csv' ? 'Terunduh' : 'Ekspor CSV'}
          </button>
          <button onClick={exportReport} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#3F55F0] hover:bg-[#2A38B8] text-white text-xs font-semibold transition-colors shadow-xs">
            {done === 'laporan' ? <Check className="w-3.5 h-3.5" /> : <FileSpreadsheet className="w-3.5 h-3.5" />}
            {done === 'laporan' ? 'Terunduh' : 'Laporan Akreditasi Vokasi'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stagger grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#E3E8F8] shadow-xs">
          <span className="text-xs text-[#5B6585] block">Total Sesi Diuji</span>
          <div className="text-2xl font-black text-[#0F1B4A] font-mono mt-1">142</div>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">Kuotaterpakai: 28.4%</span>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-[#E3E8F8] shadow-xs">
          <span className="text-xs text-[#5B6585] block">Rata-rata Indeks Adaptasi</span>
          <div className="text-2xl font-black text-[#3F55F0] font-mono mt-1">71.8</div>
          <span className="text-[10px] text-[#3F55F0] font-semibold mt-1 block">Tingkat: Cakap Beradaptasi</span>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-[#E3E8F8] shadow-xs">
          <span className="text-xs text-[#5B6585] block">Kesepakatan Penilai (Kappa)</span>
          <div className="text-2xl font-black text-[#16A34A] font-mono mt-1">0.86</div>
          <span className="text-[10px] text-[#16A34A] font-semibold mt-1 block">Reliabilitas Sangat Tinggi</span>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-[#E3E8F8] shadow-xs">
          <span className="text-xs text-[#5B6585] block">Korelasi Kinerja Lapangan</span>
          <div className="text-2xl font-black text-[#2A38B8] font-mono mt-1">r = 0.79</div>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">Validitas Prediktif Kuat</span>
        </div>
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="stagger grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Adaptation Level Distribution */}
        <div className="p-6 rounded-3xl bg-white border border-[#E3E8F8] shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#0F1B4A] uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#3F55F0]" />
            Distribusi Tingkat Adaptasi Siswa (N = 142)
          </h3>

          <div className="space-y-3">
            {DISTRIBUTION.map((d, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-[#0F1B4A]">{d.label}</span>
                  <span className="font-mono text-[#5B6585]">{d.count} siswa ({d.pct}%)</span>
                </div>
                <div className="w-full h-3 rounded-full bg-[#F6F8FF] overflow-hidden border border-[#E3E8F8]">
                  <div
                    className={`h-full ${d.color} rounded-full transition-all`}
                    style={{ width: `${d.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 mt-2">
            <strong>Insight Lembaga:</strong> 78.9% siswa berada pada kategori adaptif mandiri. 6 siswa membutuhkan bimbingan intensif pada penyusunan prediksi sebelum aksi.
          </div>
        </div>

        {/* Hardest Change Categories & Boundary Diagnostics */}
        <div className="p-6 rounded-3xl bg-white border border-[#E3E8F8] shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#0F1B4A] uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Analisis Kategori Variasi Paling Menantang
          </h3>

          <div className="space-y-2.5">
            {CHALLENGES.map((c, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-[#F6F8FF] border border-[#E3E8F8] flex items-start justify-between gap-3 text-xs">
                <div>
                  <h4 className="font-bold text-[#0F1B4A]">{c.category}</h4>
                  <p className="text-[11px] text-[#5B6585] mt-0.5">{c.note}</p>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 font-bold shrink-0 font-mono">
                  {c.failureRate}
                </span>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-[#5B6585] pt-1">
            Sistem otomatis merekomendasikan penambahan modul praktik perhitungan daya untuk kelas XII TITL.
          </div>
        </div>

      </div>

    </div>
  );
};
