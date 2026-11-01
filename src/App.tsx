/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserRole, AssessmentSession as SessionType, AbilityPassport } from './types/adaptiv';
import { 
  INITIAL_COMPLETED_SESSION, 
  INITIAL_ABILITY_PASSPORT, 
  CURRENT_INSTITUTION 
} from './data/seedData';
import { CompanyProfile } from './components/company/CompanyProfile';
import { Navbar } from './components/layout/Navbar';
import { BrandKitModal } from './components/brand/BrandKitModal';
import { AssessmentSession } from './components/assessment/AssessmentSession';
import { PassportView } from './components/passport/PassportView';
import { TaskLibrary } from './components/library/TaskLibrary';
import { IndustryPortal } from './components/industry/IndustryPortal';
import { InstitutionDashboard } from './components/admin/InstitutionDashboard';
import { Logo } from './components/brand/Logo';
import { 
  Palette, 
  Sparkles, 
  Download, 
  ArrowLeft,
  GraduationCap,
  FileBadge2,
  BookOpen,
  Building2,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function App() {
  // 'company_profile' or 'demo'
  const [viewMode, setViewMode] = useState<'company_profile' | 'demo'>('company_profile');
  
  const [currentRole, setCurrentRole] = useState<UserRole>('peserta');
  const [activeTab, setActiveTab] = useState<string>('sesi');
  const [isBrandKitOpen, setIsBrandKitOpen] = useState<boolean>(false);
  
  const [session, setSession] = useState<SessionType>(INITIAL_COMPLETED_SESSION);
  const [passport, setPassport] = useState<AbilityPassport>(INITIAL_ABILITY_PASSPORT);

  // Sync result to passport whenever session result is computed
  const handleUpdateSession = (updatedSession: SessionType) => {
    setSession(updatedSession);
    if (updatedSession.result) {
      setPassport((prev) => {
        const updatedHistory = prev.sessionHistory?.map((sess) => {
          if (sess.id === 'hist-sess-04') {
            const pred = updatedSession.scores?.find((s) => s.key === 'prediksi')?.score ?? sess.dimensionScores.prediksi;
            const pen = updatedSession.scores?.find((s) => s.key === 'penyesuaian')?.score ?? sess.dimensionScores.penyesuaian;
            const has = updatedSession.scores?.find((s) => s.key === 'hasil')?.score ?? sess.dimensionScores.hasil;
            const kem = updatedSession.scores?.find((s) => s.key === 'kemandirian')?.score ?? sess.dimensionScores.kemandirian;
            const eva = updatedSession.scores?.find((s) => s.key === 'evaluasi')?.score ?? sess.dimensionScores.evaluasi;
            return {
              ...sess,
              adaptationIndex: updatedSession.result!.adaptationIndex,
              transferGap: updatedSession.result!.transferGap,
              level: updatedSession.result!.level,
              dimensionScores: {
                prediksi: pred,
                penyesuaian: pen,
                hasil: has,
                kemandirian: kem,
                evaluasi: eva
              }
            };
          }
          return sess;
        });

        return {
          ...prev,
          result: updatedSession.result!,
          dimensions: (updatedSession.scores || []).map((s) => ({
            key: s.key,
            label: s.label,
            score: s.score,
            maxScore: 4
          })),
          sessionHistory: updatedHistory || prev.sessionHistory
        };
      });
    }
  };

  const handleEnterDemo = (targetTab: string = 'sesi') => {
    setActiveTab(targetTab);
    setViewMode('demo');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCompanyProfile = () => {
    setViewMode('company_profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8FF] text-[#0F1B4A] font-sans">
      
      {/* VIEW MODE 1: COMPANY PROFILE */}
      {viewMode === 'company_profile' ? (
        <div className="min-h-screen flex flex-col">
          <Navbar
            currentRole={currentRole}
            onRoleChange={setCurrentRole}
            onOpenBrandKit={() => setIsBrandKitOpen(true)}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onBackToCompanyProfile={handleBackToCompanyProfile}
            viewMode="company_profile"
            onEnterDemo={handleEnterDemo}
          />
          <main className="flex-1">
            <CompanyProfile
              onEnterDemo={handleEnterDemo}
              onOpenBrandKit={() => setIsBrandKitOpen(true)}
            />
          </main>
        </div>
      ) : (
        /* VIEW MODE 2: INTERACTIVE DEMO ENVIRONMENT */
        <div className="min-h-screen flex flex-col">
          
          {/* Top Return Banner */}
          <div className="bg-[#0F1B4A] text-white py-2.5 px-4 sm:px-6 border-b border-[#1E2888] shadow-sm">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-center sm:text-left">
                <span className="w-2 h-2 rounded-full bg-[#4A8BFF] animate-ping" />
                <span className="font-semibold text-blue-100">
                  Mode Demo Interaktif Platform Adaptiv
                </span>
                <span className="hidden md:inline text-blue-300">
                  • Simulasi Penilaian Dinamis 8 Fase &amp; Paspor Kemampuan
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleBackToCompanyProfile}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white text-white hover:text-[#0F1B4A] text-xs font-bold transition-all shadow-xs"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Kembali ke Company Profile</span>
                </button>
              </div>
            </div>
          </div>

          {/* Top Navigation */}
          <Navbar
            currentRole={currentRole}
            onRoleChange={setCurrentRole}
            onOpenBrandKit={() => setIsBrandKitOpen(true)}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onBackToCompanyProfile={handleBackToCompanyProfile}
            viewMode="demo"
            onEnterDemo={handleEnterDemo}
          />

          {/* Main Demo Content Area */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            
            {/* Quick Demo Context Callout */}
            <div className="mb-6 p-4 rounded-2xl bg-white border border-[#E3E8F8] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3F55F0] to-[#4A8BFF] flex items-center justify-center text-white shrink-0 shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#0F1B4A]">
                      Simulasi Aktif: {CURRENT_INSTITUTION.name}
                    </span>
                    <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-[#16A34A]/10 text-[#16A34A]">
                      Role: {currentRole.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-[#5B6585]">
                    Ganti simulasi peran di pojok kanan atas untuk mencoba sudut pandang <strong>Siswa SMK</strong>, <strong>Guru Penilai</strong>, <strong>Mitra Industri</strong>, atau <strong>Admin Sekolah</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsBrandKitOpen(true)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0F1B4A] hover:bg-[#1E2888] text-white text-xs font-semibold transition-all shadow-xs"
                >
                  <Palette className="w-3.5 h-3.5 text-[#4A8BFF]" />
                  Logo No-BG &amp; Brand Kit
                </button>
              </div>
            </div>

            {/* Tab View Routing */}
            {activeTab === 'sesi' && (
              <AssessmentSession
                session={session}
                onUpdateSession={handleUpdateSession}
                currentRole={currentRole}
                onViewPassport={() => setActiveTab('paspor')}
              />
            )}

            {activeTab === 'paspor' && (
              <PassportView
                passport={passport}
                onBackToSession={() => setActiveTab('sesi')}
              />
            )}

            {activeTab === 'pustaka' && <TaskLibrary />}

            {activeTab === 'industri' && (
              <IndustryPortal onSelectPassport={() => setActiveTab('paspor')} />
            )}

            {activeTab === 'admin' && <InstitutionDashboard />}

          </main>

          {/* Footer in Demo */}
          <footer className="mt-auto bg-white border-t border-[#E3E8F8] py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                <Logo variant="horizontal" transparent={true} size="sm" />
                <span className="hidden sm:inline text-[#E3E8F8]">|</span>
                <p className="text-xs text-[#5B6585]">
                  Platform Penilaian Kemampuan Beradaptasi Vokasi &amp; Praktisi (Dynamic Assessment).
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold text-[#5B6585]">
                <button
                  onClick={handleBackToCompanyProfile}
                  className="hover:text-[#3F55F0] transition-colors flex items-center gap-1.5 font-bold text-[#0F1B4A]"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-[#3F55F0]" />
                  Kembali ke Company Profile
                </button>
                <span className="text-[#E3E8F8]">•</span>
                <button
                  onClick={() => setIsBrandKitOpen(true)}
                  className="hover:text-[#3F55F0] transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-[#3F55F0]" />
                  Unduh Logo No-BG
                </button>
              </div>
            </div>
          </footer>

        </div>
      )}

      {/* Brand Kit & Logo Studio Modal (accessible in both views) */}
      <BrandKitModal
        isOpen={isBrandKitOpen}
        onClose={() => setIsBrandKitOpen(false)}
      />

    </div>
  );
}
