/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { UserRole } from '../../types/adaptiv';
import { Logo } from '../brand/Logo';
import { LandingNav } from './LandingNav';
import { 
  Palette, 
  UserCheck, 
  GraduationCap, 
  Building2, 
  ShieldCheck, 
  SlidersHorizontal,
  FileBadge2,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Zap,
  Sparkles,
  Layers,
  Compass,
  CheckCircle2,
  BookOpen,
  Award,
  AlertTriangle,
  RotateCcw,
  BarChart3,
  Cpu,
  HelpCircle,
  FileCheck2,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenBrandKit: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onBackToCompanyProfile: () => void;
  viewMode: 'company_profile' | 'demo';
  onEnterDemo: (targetTab?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  onOpenBrandKit,
  activeTab,
  onTabChange,
  onBackToCompanyProfile,
  viewMode,
  onEnterDemo
}) => {
  const [openDropdown, setOpenDropdown] = useState<'metodologi' | 'solusi' | 'kasus' | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roleConfig: Record<UserRole, { label: string; icon: React.ReactNode; badge: string }> = {
    peserta: {
      label: 'Siswa SMK (Peserta)',
      icon: <GraduationCap className="w-4 h-4 text-[#3F55F0]" />,
      badge: 'Rizky Pratama (TITL)'
    },
    penilai: {
      label: 'Guru Produktif (Penilai)',
      icon: <UserCheck className="w-4 h-4 text-[#16A34A]" />,
      badge: 'Ir. Suryadi, S.T.'
    },
    mitra_industri: {
      label: 'Mitra Industri (Magang)',
      icon: <Building2 className="w-4 h-4 text-[#F59E0B]" />,
      badge: 'PT Maju Daya Elektrika'
    },
    admin_lembaga: {
      label: 'Admin Lembaga (SMK)',
      icon: <ShieldCheck className="w-4 h-4 text-[#0F1B4A]" />,
      badge: 'SMK Negeri 2 Nusantara'
    },
    super_admin: {
      label: 'Super Admin',
      icon: <SlidersHorizontal className="w-4 h-4 text-[#2A38B8]" />,
      badge: 'Pusat Adaptiv'
    }
  };

  if (viewMode === 'company_profile') return <LandingNav onEnterDemo={onEnterDemo} />;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E3E8F8] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-20">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => {
                if (viewMode === 'demo') onBackToCompanyProfile();
              }}
              className="text-left focus:outline-hidden group"
            >
              <Logo variant="horizontal" transparent={true} size="md" />
            </button>

            {/* Structured Navigation with Dropdowns */}
            <nav className="hidden xl:flex items-center gap-1" ref={dropdownRef}>
              
              {/* Dropdown 1: Metodologi & Riset */}
              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'metodologi' ? null : 'metodologi')}
                  className={`inline-flex items-center gap-1.5 whitespace-nowrap px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    openDropdown === 'metodologi'
                      ? 'bg-[#3F55F0]/10 text-[#3F55F0]'
                      : 'text-[#5B6585] hover:text-[#0F1B4A] hover:bg-[#F6F8FF]'
                  }`}
                >
                  <span>Metodologi &amp; Riset</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === 'metodologi' ? 'rotate-180 text-[#3F55F0]' : ''}`} />
                </button>

                <AnimatePresence>
                  {openDropdown === 'metodologi' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 mt-2 w-[440px] p-3.5 bg-white rounded-2xl shadow-2xl border border-[#E3E8F8] z-50"
                    >
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#5B6585] px-2.5 py-1">
                        Fondasi Ilmiah Adaptiv
                      </div>
                      
                      <div className="grid grid-cols-1 gap-1.5 mt-1">
                        <button
                          onClick={() => {
                            setOpenDropdown(null);
                            onEnterDemo('sesi');
                          }}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#F6F8FF] text-left transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-[#3F55F0]/10 text-[#3F55F0] flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                            <Zap className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-bold text-[#0F1B4A] group-hover:text-[#3F55F0] transition-colors flex items-center justify-between">
                              <span>Dynamic Assessment Lapangan</span>
                              <span className="text-[10px] text-[#3F55F0] font-normal">Coba di Demo →</span>
                            </div>
                            <p className="text-[11px] text-[#5B6585] mt-0.5 leading-snug">
                              Menguji proses berpikir dan reaksi saat 1 kondisi mendadak berubah di bengkel.
                            </p>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setOpenDropdown(null);
                            onEnterDemo('sesi');
                          }}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#F6F8FF] text-left transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                            <Layers className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-bold text-[#0F1B4A] group-hover:text-[#3F55F0] transition-colors">
                              Rubrik 5 Dimensi Adaptasi
                            </div>
                            <p className="text-[11px] text-[#5B6585] mt-0.5 leading-snug">
                              Prediksi (20%), Penyesuaian (30%), Hasil (25%), Kemandirian (15%), Evaluasi (10%).
                            </p>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setOpenDropdown(null);
                            onEnterDemo('pustaka');
                          }}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#F6F8FF] text-left transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#3F55F0] flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                            <FileCheck2 className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-bold text-[#0F1B4A] group-hover:text-[#3F55F0] transition-colors flex items-center justify-between">
                              <span>Pemeriksa Kesetaraan Tugas</span>
                              <span className="text-[10px] text-[#3F55F0] font-normal">Pustaka →</span>
                            </div>
                            <p className="text-[11px] text-[#5B6585] mt-0.5 leading-snug">
                              Checklist kepastian hanya 1 variabel yang berubah tanpa bias merek alat.
                            </p>
                          </div>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Dropdown 2: Solusi Vokasi & Paspor */}
              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'solusi' ? null : 'solusi')}
                  className={`inline-flex items-center gap-1.5 whitespace-nowrap px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    openDropdown === 'solusi'
                      ? 'bg-[#3F55F0]/10 text-[#3F55F0]'
                      : 'text-[#5B6585] hover:text-[#0F1B4A] hover:bg-[#F6F8FF]'
                  }`}
                >
                  <span>Solusi &amp; Paspor</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === 'solusi' ? 'rotate-180 text-[#3F55F0]' : ''}`} />
                </button>

                <AnimatePresence>
                  {openDropdown === 'solusi' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 mt-2 w-[420px] p-3.5 bg-white rounded-2xl shadow-2xl border border-[#E3E8F8] z-50"
                    >
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#5B6585] px-2.5 py-1">
                        Implementasi &amp; Output Terverifikasi
                      </div>

                      <div className="grid grid-cols-1 gap-1.5 mt-1">
                        <button
                          onClick={() => {
                            setOpenDropdown(null);
                            onEnterDemo('paspor');
                          }}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#F6F8FF] text-left transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-[#3F55F0]/10 text-[#3F55F0] flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                            <Award className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-bold text-[#0F1B4A] group-hover:text-[#3F55F0] transition-colors flex items-center justify-between">
                              <span>Paspor Kemampuan Digital</span>
                              <span className="text-[10px] text-[#3F55F0] font-normal">Buka Sampel →</span>
                            </div>
                            <p className="text-[11px] text-[#5B6585] mt-0.5 leading-snug">
                              Grafik Radar 5 Dimensi, Peta Batas Kemampuan, dan QR Code Publik.
                            </p>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setOpenDropdown(null);
                            onEnterDemo('industri');
                          }}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#F6F8FF] text-left transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                            <Building2 className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-bold text-[#0F1B4A] group-hover:text-[#3F55F0] transition-colors flex items-center justify-between">
                              <span>Portal Mitra Industri</span>
                              <span className="text-[10px] text-[#3F55F0] font-normal">Industri →</span>
                            </div>
                            <p className="text-[11px] text-[#5B6585] mt-0.5 leading-snug">
                              Perekrutan magang &amp; pengiriman tantangan riil bengkel ke kurikulum SMK.
                            </p>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setOpenDropdown(null);
                            onEnterDemo('admin');
                          }}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#F6F8FF] text-left transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                            <BarChart3 className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-bold text-[#0F1B4A] group-hover:text-[#3F55F0] transition-colors flex items-center justify-between">
                              <span>Dasbor Manajemen Sekolah</span>
                              <span className="text-[10px] text-[#3F55F0] font-normal">Admin →</span>
                            </div>
                            <p className="text-[11px] text-[#5B6585] mt-0.5 leading-snug">
                              Analitik Cohen's Kappa antar-guru dan sebaran tingkat adaptasi siswa.
                            </p>
                          </div>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Dropdown 3: Kasus Lapangan */}
              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'kasus' ? null : 'kasus')}
                  className={`inline-flex items-center gap-1.5 whitespace-nowrap px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    openDropdown === 'kasus'
                      ? 'bg-[#3F55F0]/10 text-[#3F55F0]'
                      : 'text-[#5B6585] hover:text-[#0F1B4A] hover:bg-[#F6F8FF]'
                  }`}
                >
                  <span>Studi Kasus TITL</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === 'kasus' ? 'rotate-180 text-[#3F55F0]' : ''}`} />
                </button>

                <AnimatePresence>
                  {openDropdown === 'kasus' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 mt-2 w-[380px] p-3.5 bg-white rounded-2xl shadow-2xl border border-[#E3E8F8] z-50"
                    >
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#5B6585] px-2.5 py-1">
                        Simulasi Aktif di Demo
                      </div>
                      
                      <div className="p-3 bg-[#F6F8FF] rounded-xl border border-[#E3E8F8] space-y-2 mt-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-[#3F55F0] text-white text-[10px] font-bold">
                            TITL
                          </span>
                          <span className="text-xs font-bold text-[#0F1B4A]">
                            Instalasi Penerangan Rumah Tinggal
                          </span>
                        </div>
                        <p className="text-[11px] text-[#5B6585] leading-relaxed">
                          Siswa merakit saklar tunggal dasar, lalu kondisi diubah menjadi saklar tukar (2 titik kendali) sesuai standar PUIL 2020.
                        </p>
                        <button
                          onClick={() => {
                            setOpenDropdown(null);
                            onEnterDemo('sesi');
                          }}
                          className="w-full mt-2 py-2 rounded-lg bg-[#3F55F0] hover:bg-[#2A38B8] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                        >
                          <span>Mulai Uji Kasus TITL Ini</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Demo Tabs Link (Only visible in Demo mode) */}
              {viewMode === 'demo' && (
                <div className="flex items-center gap-1 pl-2 border-l border-[#E3E8F8]">
                  <button
                    onClick={() => onTabChange('sesi')}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      activeTab === 'sesi' ? 'bg-[#3F55F0] text-white shadow-2xs' : 'text-[#5B6585] hover:text-[#0F1B4A]'
                    }`}
                  >
                    Sesi Uji
                  </button>
                  <button
                    onClick={() => onTabChange('paspor')}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      activeTab === 'paspor' ? 'bg-[#3F55F0] text-white shadow-2xs' : 'text-[#5B6585] hover:text-[#0F1B4A]'
                    }`}
                  >
                    Paspor
                  </button>
                  <button
                    onClick={() => onTabChange('pustaka')}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      activeTab === 'pustaka' ? 'bg-[#3F55F0] text-white shadow-2xs' : 'text-[#5B6585] hover:text-[#0F1B4A]'
                    }`}
                  >
                    Pustaka
                  </button>
                </div>
              )}

            </nav>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3 shrink-0">
            
            {/* View Mode Switcher Button */}
            {viewMode === 'demo' ? (
              <button
                onClick={onBackToCompanyProfile}
                className="inline-flex items-center gap-2 whitespace-nowrap px-3.5 sm:px-4 py-2.5 rounded-xl border border-[#3F55F0]/30 bg-[#3F55F0]/5 hover:bg-[#3F55F0]/10 hover:border-[#3F55F0] text-xs font-bold text-[#3F55F0] transition-all shadow-2xs group"
                title="Kembali ke Halaman Company Profile"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>Company Profile</span>
              </button>
            ) : (
              <button
                onClick={() => onEnterDemo('sesi')}
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-[#3F55F0] hover:bg-[#2A38B8] text-white text-xs font-bold transition-all shadow-md shadow-[#3F55F0]/20 hover:scale-[1.02] active:scale-95"
              >
                <span>Masuk ke Demo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Role Switcher (in Demo mode) */}
            {viewMode === 'demo' && (
              <div className="relative group">
                <div tabIndex={0} role="button" aria-haspopup="menu" aria-label="Ganti peran simulasi" className="flex items-center gap-2 whitespace-nowrap pl-3 pr-2.5 py-1.5 rounded-xl border border-[#E3E8F8] bg-[#F6F8FF] hover:border-[#3F55F0]/50 transition-colors cursor-pointer">
                  <div className="w-7 h-7 rounded-lg bg-white shadow-2xs flex items-center justify-center">
                    {roleConfig[currentRole].icon}
                  </div>
                  <div className="text-left hidden xl:block">
                    <div className="text-[9px] font-bold text-[#5B6585] uppercase tracking-wider leading-none">
                      Peran Aktif
                    </div>
                    <div className="text-xs font-bold text-[#0F1B4A] leading-tight">
                      {roleConfig[currentRole].badge}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#5B6585]" />
                </div>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-1 w-64 p-2 bg-white rounded-2xl shadow-xl border border-[#E3E8F8] opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-150 z-50">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-[#5B6585] uppercase tracking-wider">
                    Ganti Simulasi Peran (RBAC)
                  </div>
                  {(Object.keys(roleConfig) as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        onRoleChange(r);
                        if (r === 'mitra_industri') onTabChange('industri');
                        else if (r === 'admin_lembaga') onTabChange('admin');
                        else onTabChange('sesi');
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                        currentRole === r
                          ? 'bg-[#3F55F0]/10 text-[#3F55F0] font-bold'
                          : 'text-[#0F1B4A] hover:bg-[#F6F8FF]'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-md bg-white border border-[#E3E8F8] flex items-center justify-center">
                        {roleConfig[r].icon}
                      </div>
                      <div className="flex-1">
                        <div>{roleConfig[r].label}</div>
                        <div className="text-[10px] text-[#5B6585] font-normal">
                          {roleConfig[r].badge}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="xl:hidden p-2 rounded-xl text-[#0F1B4A] hover:bg-[#F6F8FF] border border-[#E3E8F8] transition-colors"
              aria-label="Toggle Menu"
            >
              {isMobileOpen ? <X className="w-5 h-5 text-[#3F55F0]" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* Animated Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="xl:hidden border-t border-[#E3E8F8] bg-white overflow-hidden shadow-xl"
          >
            <div className="p-4 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              
              {/* Quick Actions */}
              <div className="flex gap-2">
                {viewMode === 'demo' ? (
                  <button
                    onClick={() => {
                      setIsMobileOpen(false);
                      onBackToCompanyProfile();
                    }}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-[#0F1B4A] text-white text-xs font-bold text-center flex items-center justify-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Company Profile</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsMobileOpen(false);
                      onEnterDemo('sesi');
                    }}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-[#3F55F0] text-white text-xs font-bold text-center flex items-center justify-center gap-1.5"
                  >
                    <span>Masuk ke Demo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsMobileOpen(false);
                    onOpenBrandKit();
                  }}
                  className="py-2.5 px-3 rounded-xl border border-[#E3E8F8] text-xs font-semibold text-[#0F1B4A] flex items-center gap-1.5"
                >
                  <Palette className="w-3.5 h-3.5 text-[#3F55F0]" />
                  <span>Brand Kit</span>
                </button>
              </div>

              {/* Metodologi Items */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#5B6585] uppercase tracking-wider block px-1">
                  Metodologi Penilaian
                </span>
                <button
                  onClick={() => {
                    setIsMobileOpen(false);
                    onEnterDemo('sesi');
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-[#F6F8FF] text-xs font-bold text-[#0F1B4A] flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-[#3F55F0]" />
                    Dynamic Assessment Sesi
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#5B6585]" />
                </button>
                <button
                  onClick={() => {
                    setIsMobileOpen(false);
                    onEnterDemo('pustaka');
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-[#F6F8FF] text-xs font-bold text-[#0F1B4A] flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                    Pustaka Tugas &amp; Kesetaraan
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#5B6585]" />
                </button>
              </div>

              {/* Solusi & Paspor */}
              <div className="space-y-1 pt-2 border-t border-[#E3E8F8]">
                <span className="text-[10px] font-bold text-[#5B6585] uppercase tracking-wider block px-1">
                  Solusi &amp; Output
                </span>
                <button
                  onClick={() => {
                    setIsMobileOpen(false);
                    onEnterDemo('paspor');
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-[#F6F8FF] text-xs font-bold text-[#0F1B4A] flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-[#3F55F0]" />
                    Paspor Kemampuan (Radar &amp; QR)
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#5B6585]" />
                </button>
                <button
                  onClick={() => {
                    setIsMobileOpen(false);
                    onEnterDemo('industri');
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-[#F6F8FF] text-xs font-bold text-[#0F1B4A] flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-amber-600" />
                    Portal Mitra Industri Magang
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#5B6585]" />
                </button>
                <button
                  onClick={() => {
                    setIsMobileOpen(false);
                    onEnterDemo('admin');
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-[#F6F8FF] text-xs font-bold text-[#0F1B4A] flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <BarChart3 className="w-3.5 h-3.5 text-purple-600" />
                    Dasbor Manajemen Sekolah (SMK)
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#5B6585]" />
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
