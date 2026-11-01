/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  Check,
  Copy,
  Sparkles,
  Palette,
  Eye,
  Layers,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';

interface BrandKitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BrandKitModal: React.FC<BrandKitModalProps> = ({ isOpen, onClose }) => {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [previewBg, setPreviewBg] = useState<'transparent' | 'light' | 'dark'>('transparent');

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const brandColors = [
    {
      name: 'Brand Indigo',
      token: 'brand-indigo',
      hex: '#3F55F0',
      role: 'Warna Primer, Tombol Utama, Huruf A',
      contrast: 'text-white'
    },
    {
      name: 'Brand Sky',
      token: 'brand-sky',
      hex: '#4A8BFF',
      role: 'Aksen, Panah Dinamis, Tautan, Titik i',
      contrast: 'text-[#0F1B4A]'
    },
    {
      name: 'Brand Navy',
      token: 'brand-navy',
      hex: '#0F1B4A',
      role: 'Teks Utama, Judul, Wordmark "Adaptiv"',
      contrast: 'text-white'
    },
    {
      name: 'Brand Indigo Dark',
      token: 'brand-indigo-dark',
      hex: '#2A38B8',
      role: 'Hover States & Bayangan Berbobot',
      contrast: 'text-white'
    },
    {
      name: 'Surface Netral',
      token: 'brand-surface',
      hex: '#F6F8FF',
      role: 'Latar Belakang Bagian & Halaman',
      contrast: 'text-[#0F1B4A]'
    },
    {
      name: 'Border Netral',
      token: 'brand-border',
      hex: '#E3E8F8',
      role: 'Garis Batas, Pemisah, Kartu',
      contrast: 'text-[#0F1B4A]'
    },
    {
      name: 'Teks Sekunder',
      token: 'brand-muted',
      hex: '#5B6585',
      role: 'Keterangan, Metadata, Label Rubrik',
      contrast: 'text-white'
    },
    {
      name: 'Status Sukses',
      token: 'status-success',
      hex: '#16A34A',
      role: 'Lulus Kriteria, Indeks Mahir',
      contrast: 'text-white'
    }
  ];

  const logoAssets = [
    {
      id: 'logo-nobg',
      title: 'Logo Lengkap (Transparan / No-BG)',
      desc: 'Simbol A + Wordmark Adaptiv vertikal dengan latar belakang transparan',
      src: '/brand/adaptiv-logo-nobg.png',
      downloadName: 'Adaptiv-Logo-Transparent.png',
      badge: 'Utama (No BG)'
    },
    {
      id: 'horizontal-nobg',
      title: 'Logo Horizontal (Transparan / No-BG)',
      desc: 'Simbol di samping kiri wordmark, ideal untuk Navbar, Header, & Sertifikat',
      src: '/brand/adaptiv-horizontal-nobg.png',
      downloadName: 'Adaptiv-Horizontal-Transparent.png',
      badge: 'Navbar & Header'
    },
    {
      id: 'symbol-nobg',
      title: 'Simbol Huruf A + Panah (No-BG)',
      desc: 'Hanya ikon huruf A dengan panah melengkung biru langit (favicon & avatar)',
      src: '/brand/adaptiv-symbol-nobg.png',
      downloadName: 'Adaptiv-Symbol-Transparent.png',
      badge: 'Favicon & App Icon'
    },
    {
      id: 'wordmark-nobg',
      title: 'Wordmark Adaptiv Saja (No-BG)',
      desc: 'Tipografi rounded sans-serif dengan titik huruf i berwarna brand-sky',
      src: '/brand/adaptiv-wordmark-nobg.png',
      downloadName: 'Adaptiv-Wordmark-Transparent.png',
      badge: 'Tipografi'
    },
    {
      id: 'horizontal-white',
      title: 'Logo Putih Satu Warna (Dark Mode)',
      desc: 'Versi monokrom putih bersih untuk latar gelap, banner malam, & footer gelap',
      src: '/brand/adaptiv-horizontal-white.png',
      downloadName: 'Adaptiv-Logo-White-Monochrome.png',
      badge: 'Latar Gelap'
    },
    {
      id: 'official-with-bg',
      title: 'Logo Resmi Orisinal (Dengan Background)',
      desc: 'File master asli Adaptiv_Dynamic_Arrow_Logo.png untuk arsip dokumen',
      src: '/brand/adaptiv-logo.png',
      downloadName: 'Adaptiv-Logo-Original.png',
      badge: 'Master File'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F1B4A]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-[#E3E8F8]">
        
        {/* Header Modal */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-5 bg-white/95 backdrop-blur-md border-b border-[#E3E8F8]">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-[#3F55F0]/10 text-[#3F55F0]">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#0F1B4A]">Identitas Merek & Studio Logo Adaptiv</h2>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-[#4A8BFF]/15 text-[#3F55F0]">
                  Official Assets & No-BG
                </span>
              </div>
              <p className="text-xs text-[#5B6585]">
                Koleksi logo transparan (no-bg), turunan favicon, dan design token warna resmi Adaptiv.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#5B6585] hover:text-[#0F1B4A] hover:bg-[#F6F8FF] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Background Preview Selector */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#F6F8FF] border border-[#E3E8F8]">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#3F55F0]" />
              <span className="text-sm font-semibold text-[#0F1B4A]">Mode Pratinjau Latar Belakang:</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPreviewBg('transparent')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  previewBg === 'transparent'
                    ? 'bg-white text-[#3F55F0] shadow-sm ring-2 ring-[#3F55F0]'
                    : 'text-[#5B6585] hover:bg-white/60'
                }`}
              >
                Transparansi (Grid)
              </button>
              <button
                onClick={() => setPreviewBg('light')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  previewBg === 'light'
                    ? 'bg-white text-[#3F55F0] shadow-sm ring-2 ring-[#3F55F0]'
                    : 'text-[#5B6585] hover:bg-white/60'
                }`}
              >
                Latar Putih (#FFF)
              </button>
              <button
                onClick={() => setPreviewBg('dark')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  previewBg === 'dark'
                    ? 'bg-[#0F1B4A] text-white shadow-sm ring-2 ring-[#4A8BFF]'
                    : 'text-[#5B6585] hover:bg-white/60'
                }`}
              >
                Latar Gelap Navy (#0F1B4A)
              </button>
            </div>
          </div>

          {/* Logo Asset Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#0F1B4A] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#3F55F0]" />
                Koleksi Logo Transparan (No-BG) Siap Pakai
              </h3>
              <span className="text-xs text-[#5B6585]">
                Format PNG resolusi tinggi & Alpha channel transparan
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {logoAssets.map((asset) => {
                const isWhiteLogo = asset.id.includes('white');
                const cardBgClass = 
                  previewBg === 'transparent'
                    ? (isWhiteLogo ? 'bg-[#0F1B4A]' : 'bg-transparency-grid')
                    : previewBg === 'light'
                    ? (isWhiteLogo ? 'bg-[#0F1B4A]' : 'bg-white')
                    : 'bg-[#0F1B4A]';

                return (
                  <div
                    key={asset.id}
                    className="flex flex-col justify-between p-4 rounded-2xl border border-[#E3E8F8] bg-white hover:border-[#3F55F0]/40 transition-all shadow-sm hover:shadow-md"
                  >
                    <div>
                      {/* Visual Display Box */}
                      <div
                        className={`relative w-full h-44 rounded-xl flex items-center justify-center p-4 overflow-hidden border border-[#E3E8F8]/60 ${cardBgClass} transition-colors`}
                      >
                        <img
                          src={asset.src}
                          alt={asset.title}
                          referrerPolicy="no-referrer"
                          className="max-h-28 max-w-[85%] object-contain drop-shadow-sm transition-transform duration-300 hover:scale-105"
                        />
                        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 text-[10px] font-bold rounded-md bg-white/90 text-[#0F1B4A] shadow-xs backdrop-blur-xs">
                          {asset.badge}
                        </span>
                      </div>

                      <div className="mt-3">
                        <h4 className="text-sm font-bold text-[#0F1B4A] leading-snug">
                          {asset.title}
                        </h4>
                        <p className="mt-1 text-xs text-[#5B6585] leading-relaxed line-clamp-2">
                          {asset.desc}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#E3E8F8] flex items-center gap-2">
                      <a
                        href={asset.src}
                        download={asset.downloadName}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#3F55F0] hover:bg-[#2A38B8] text-white text-xs font-semibold transition-colors shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Unduh File
                      </a>
                      <a
                        href={asset.src}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl border border-[#E3E8F8] text-[#5B6585] hover:text-[#0F1B4A] hover:bg-[#F6F8FF] transition-colors"
                        title="Lihat ukuran penuh"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Brand Color Tokens Palette */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#0F1B4A] flex items-center gap-2">
                  <Palette className="w-4 h-4 text-[#3F55F0]" />
                  Palet Warna Resmi & Design Tokens
                </h3>
                <p className="text-xs text-[#5B6585]">
                  Sesuai ketentuan Bagian 3: Identitas Merek Adaptiv
                </p>
              </div>
              <span className="text-xs font-medium text-[#3F55F0] bg-[#3F55F0]/10 px-2.5 py-1 rounded-lg">
                Klik warna untuk menyalin kode HEX
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {brandColors.map((c) => {
                const isCopied = copiedColor === c.hex;
                return (
                  <button
                    key={c.hex}
                    onClick={() => handleCopyColor(c.hex)}
                    className="text-left p-3.5 rounded-2xl border border-[#E3E8F8] hover:border-[#3F55F0] hover:shadow-md transition-all group relative bg-white"
                  >
                    <div
                      className="w-full h-14 rounded-xl mb-2.5 flex items-end justify-end p-1.5 shadow-inner border border-black/5"
                      style={{ backgroundColor: c.hex }}
                    >
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/30 backdrop-blur-xs text-white`}>
                        {c.hex}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0F1B4A] group-hover:text-[#3F55F0] transition-colors">
                        {c.name}
                      </span>
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-green-600 animate-bounce" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-[#5B6585] opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                    <p className="text-[11px] text-[#5B6585] mt-0.5 line-clamp-1">
                      {c.role}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brand Philosophy Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#3F55F0]/10 via-[#4A8BFF]/10 to-transparent border border-[#E3E8F8] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#3F55F0]" />
                <h4 className="text-sm font-bold text-[#0F1B4A]">Filosofi Visual Simbol Adaptiv</h4>
              </div>
              <p className="text-xs text-[#5B6585] max-w-2xl leading-relaxed">
                Huruf <strong>A</strong> tebal berwarna <em>Brand Indigo</em> (#3F55F0) dengan sudut membulat merepresentasikan fondasi kompetensi yang kokoh. Panah melengkung <em>Brand Sky</em> (#4A8BFF) yang melesat ke kanan atas melambangkan kelenturan berpikir dan penyesuaian diri ketika kondisi kerja berubah nyata.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E3E8F8] text-xs font-semibold text-[#0F1B4A] shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#3F55F0]" />
                WCAG AA Compliant
              </span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#F6F8FF] border-t border-[#E3E8F8] flex items-center justify-between">
          <div className="text-xs text-[#5B6585]">
            Tersimpan di sistem: <code className="font-mono text-[#0F1B4A]">/public/brand/</code>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#0F1B4A] hover:bg-[#1E2888] text-white text-xs font-semibold transition-colors"
          >
            Tutup Studio
          </button>
        </div>

      </div>
    </div>
  );
};
