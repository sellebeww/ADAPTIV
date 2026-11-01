/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole, AssessmentSession as SessionType, AbilityPassport } from './types/adaptiv';
import {
  INITIAL_COMPLETED_SESSION,
  INITIAL_ABILITY_PASSPORT,
  CURRENT_INSTITUTION,
  SEED_CANDIDATES,
} from './data/seedData';
import { findPassportByCode, passportForCandidate } from './utils/passports';
import { VerificationView } from './components/passport/VerificationView';
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
} from 'lucide-react';

const TAB_TITLES: Record<string, string> = {
  sesi: 'Sesi Penilaian Adaptiv',
  paspor: 'Paspor Kemampuan',
  pustaka: 'Pustaka Variasi Tugas',
  industri: 'Portal Mitra Industri',
  admin: 'Dasbor Lembaga'
};

export default function App() {
  // 'company_profile' or 'demo'
  const [viewMode, setViewMode] = useState<'company_profile' | 'demo'>('company_profile');
  
  const [currentRole, setCurrentRole] = useState<UserRole>('peserta');
  const [activeTab, setActiveTab] = useState<string>('sesi');
  const [isBrandKitOpen, setIsBrandKitOpen] = useState<boolean>(false);
  
  const [session, setSession] = useState<SessionType>(INITIAL_COMPLETED_SESSION);
  const [passport, setPassport] = useState<AbilityPassport>(INITIAL_ABILITY_PASSPORT);
  // Remounts the assessment screen so its local form state restarts with a new session.
  const [sessionKey, setSessionKey] = useState(0);
  // Passport opened from the industry portal; null = the live participant passport.
  const [candidateId, setCandidateId] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState<string | null>(() => new URLSearchParams(window.location.search).get('verifikasi'));

  const candidate = SEED_CANDIDATES.find((c) => c.id === candidateId);
  const shownPassport = candidate ? passportForCandidate(passport, candidate) : passport;

  const handleResetSession = () => {
    setSession({
      ...INITIAL_COMPLETED_SESSION,
      id: `sess-demo-${Date.now().toString(36)}`,
      currentPhase: 0,
      status: 'berjalan',
      startedAt: new Date().toISOString(),
      evidence: [],
      prediction: undefined,
      reflection: undefined,
      openedHintIds: [],
      scores: undefined,
      result: undefined,
      assessorNotes: []
    });
    setSessionKey((k) => k + 1);
    setActiveTab('sesi');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab: string) => {
    setCandidateId(null);
    setActiveTab(tab);
  };

  const closeVerification = () => {
    window.history.replaceState(null, '', window.location.pathname);
    setVerifyCode(null);
  };

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
    setCandidateId(null);
    setActiveTab(targetTab);
    setViewMode('demo');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCompanyProfile = () => {
    setViewMode('company_profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (verifyCode) {
    return <VerificationView code={verifyCode} passport={findPassportByCode(passport, verifyCode)} onClose={closeVerification} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8FF] text-[#0F1B4A] font-sans">

      {/* VIEW MODE 1: COMPANY PROFILE */}
      {viewMode === 'company_profile' ? (
        <div key="company" className="min-h-screen flex flex-col animate-[riseIn_500ms_cubic-bezier(0.23,1,0.32,1)_both]">
          <Navbar
            currentRole={currentRole}
            onRoleChange={setCurrentRole}
            onOpenBrandKit={() => setIsBrandKitOpen(true)}
            activeTab={activeTab}
            onTabChange={handleTabChange}
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
        <div key="demo" className="min-h-screen flex flex-col animate-[riseIn_500ms_cubic-bezier(0.23,1,0.32,1)_both]">

          {/* Top Navigation */}
          <Navbar
            currentRole={currentRole}
            onRoleChange={setCurrentRole}
            onOpenBrandKit={() => setIsBrandKitOpen(true)}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onBackToCompanyProfile={handleBackToCompanyProfile}
            viewMode="demo"
            onEnterDemo={handleEnterDemo}
          />

          {/* Main Demo Content Area */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            
            {/* Quick Demo Context Callout */}
            <div className="mb-6 p-4 rounded-2xl bg-white border border-[#E3E8F8] shadow-2xs animate-[riseIn_480ms_cubic-bezier(0.23,1,0.32,1)_both] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3F55F0] to-[#4A8BFF] flex items-center justify-center text-white shrink-0 shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-xs font-bold text-[#0F1B4A]">
                      Simulasi Aktif: {CURRENT_INSTITUTION.name}
                    </span>
                    <span className="whitespace-nowrap px-2 py-0.5 rounded-full text-xs font-bold bg-[#16A34A]/10 text-[#166534]">
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
                  className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0F1B4A] hover:bg-[#1E2888] text-white text-xs font-semibold transition-all shadow-xs"
                >
                  <Palette className="w-3.5 h-3.5 text-[#4A8BFF]" />
                  Logo No-BG &amp; Brand Kit
                </button>
              </div>
            </div>

            <h1 className="sr-only">{TAB_TITLES[activeTab]}</h1>

            {/* Tab View Routing: key per tab -> fade/slide keluar-masuk */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -6, transition: { duration: 0.15 } }}
                transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
              >
                {activeTab === 'sesi' && (
                  <AssessmentSession
                    key={sessionKey}
                    session={session}
                    onUpdateSession={handleUpdateSession}
                    currentRole={currentRole}
                    onViewPassport={() => handleTabChange('paspor')}
                    onResetSession={handleResetSession}
                    onSwitchRole={setCurrentRole}
                  />
                )}

                {activeTab === 'paspor' && (
                  <PassportView
                    passport={shownPassport}
                    backLabel={candidate ? 'Portal Mitra Industri' : 'Sesi Uji'}
                    onBackToSession={() => handleTabChange(candidate ? 'industri' : 'sesi')}
                  />
                )}

                {activeTab === 'pustaka' && <TaskLibrary />}

                {activeTab === 'industri' && (
                  <IndustryPortal
                    onSelectPassport={(id) => {
                      setCandidateId(id);
                      setActiveTab('paspor');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                )}

                {activeTab === 'admin' && <InstitutionDashboard />}
              </motion.div>
            </AnimatePresence>

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
