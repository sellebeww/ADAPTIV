/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Building2, Search, Filter, CheckCircle2, Send, Star, ExternalLink, ShieldCheck } from 'lucide-react';
import { SEED_USERS } from '../../data/seedData';

export const IndustryPortal: React.FC<{ onSelectPassport: () => void }> = ({ onSelectPassport }) => {
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [variationDescription, setVariationDescription] = useState('');
  const [submittedRequest, setSubmittedRequest] = useState(false);

  const candidates = [
    {
      id: 'c1',
      name: 'Rizky Pratama',
      school: 'SMK Negeri 2 Nusantara',
      major: 'Teknik Instalasi Tenaga Listrik',
      iaScore: 82.5,
      level: 'Mahir Beradaptasi',
      weakest: 'Beban / Daya Tinggi',
      verified: true
    },
    {
      id: 'c2',
      name: 'Fauzan Hidayat',
      school: 'SMK Negeri 2 Nusantara',
      major: 'Teknik Instalasi Tenaga Listrik',
      iaScore: 74.0,
      level: 'Cakap Beradaptasi',
      weakest: 'Variasi Jenis Kabel',
      verified: true
    },
    {
      id: 'c3',
      name: 'Anisa Kusuma',
      school: 'SMK Negeri 2 Nusantara',
      major: 'Teknik Instalasi Tenaga Listrik',
      iaScore: 68.5,
      level: 'Cakap Beradaptasi',
      weakest: 'Tekanan Waktu Kerja',
      verified: true
    },
    {
      id: 'c4',
      name: 'Bayu Saputra',
      school: 'SMK Negeri 2 Nusantara',
      major: 'Teknik Instalasi Tenaga Listrik',
      iaScore: 52.0,
      level: 'Berkembang',
      weakest: 'Kegagalan Komponen',
      verified: true
    }
  ];

  const filteredCandidates = candidates.filter(c => {
    if (filterLevel === 'all') return true;
    return c.level.toLowerCase().includes(filterLevel.toLowerCase());
  });

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!variationDescription.trim()) return;
    setSubmittedRequest(true);
    setTimeout(() => {
      setSubmittedRequest(false);
      setVariationDescription('');
    }, 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0F1B4A] to-[#1E2888] text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#4A8BFF]">
            <Building2 className="w-3.5 h-3.5" />
            Portal Mitra Industri (Rekrutmen &amp; Magang)
          </div>
          <h2 className="text-xl sm:text-2xl font-bold mt-2">
            PT Maju Daya Elektrika (PLN Group Partner)
          </h2>
          <p className="text-xs text-blue-200 mt-1 max-w-xl">
            Saring calon teknisi magang yang terbukti adaptif menghadapi kondisi lapangan yang dinamis, bukan sekadar hafal teori ujian.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md text-center">
          <span className="text-[10px] uppercase font-bold text-blue-200">Kandidat Teruji Siap Kerja</span>
          <div className="text-2xl font-black font-mono">18 Siswa</div>
          <span className="text-[10px] text-emerald-300">Izin Akses PDP Aktif</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Talent List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-[#E3E8F8]">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#3F55F0]" />
              <span className="text-xs font-bold text-[#0F1B4A]">Filter Tingkat Adaptasi:</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto">
              {['all', 'Mahir', 'Cakap', 'Berkembang'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setFilterLevel(lvl)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    filterLevel === lvl
                      ? 'bg-[#3F55F0] text-white shadow-xs'
                      : 'bg-[#F6F8FF] text-[#5B6585] hover:bg-[#E3E8F8]'
                  }`}
                >
                  {lvl === 'all' ? 'Semua' : lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredCandidates.map((c) => (
              <div
                key={c.id}
                className="p-5 rounded-2xl bg-white border border-[#E3E8F8] hover:border-[#3F55F0]/50 transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[#0F1B4A]">{c.name}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#3F55F0]/10 text-[#3F55F0]">
                      {c.level}
                    </span>
                  </div>
                  <div className="text-xs text-[#5B6585]">
                    {c.school} • {c.major}
                  </div>
                  <div className="text-[11px] text-amber-700 font-medium">
                    Batas Performa Terdeteksi: <span className="font-semibold">{c.weakest}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-xs text-[#5B6585]">Indeks Adaptasi</div>
                    <div className="text-xl font-black text-[#3F55F0] font-mono">
                      {c.iaScore} <span className="text-xs font-normal text-[#5B6585]">/ 100</span>
                    </div>
                  </div>
                  <button
                    onClick={onSelectPassport}
                    className="px-4 py-2.5 rounded-xl bg-[#3F55F0] hover:bg-[#2A38B8] text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
                  >
                    Buka Paspor
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Request Variation Form from Industry */}
        <div className="p-6 rounded-3xl bg-white border border-[#E3E8F8] shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#0F1B4A] uppercase tracking-wider">
              Formulir Permintaan Variasi Industri
            </span>
          </div>

          <p className="text-xs text-[#5B6585] leading-relaxed">
            Perusahaan Anda sering menghadapi kasus mendadak di lapangan? Tuliskan situasi tersebut agar guru SMK dapat mengonversinya menjadi variasi tugas latihan.
          </p>

          <form onSubmit={handleSubmitRequest} className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-[#0F1B4A] uppercase mb-1">
                Deskripsi Situasi / Perubahan Nyata:
              </label>
              <textarea
                value={variationDescription}
                onChange={(e) => setVariationDescription(e.target.value)}
                rows={4}
                required
                placeholder="Contoh: Genset backup otomatis gagal sinkron saat terjadi fluktuasi frekuensi beban induktif motor listrik..."
                className="w-full p-3 rounded-xl border border-[#E3E8F8] bg-[#F6F8FF] text-xs text-[#0F1B4A] focus:bg-white focus:border-[#3F55F0]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-[#0F1B4A] hover:bg-[#1E2888] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              Kirim ke Tim Kurikulum SMK
            </button>

            {submittedRequest && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                Permintaan berhasil dikirim ke Kurikulum SMK Negeri 2!
              </div>
            )}
          </form>
        </div>

      </div>

    </div>
  );
};
