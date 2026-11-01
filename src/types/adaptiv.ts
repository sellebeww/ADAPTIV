/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'peserta' | 'penilai' | 'mitra_industri' | 'admin_lembaga' | 'super_admin';

export type ChangeCategory = 
  | 'bahan' 
  | 'alat' 
  | 'ukuran' 
  | 'beban' 
  | 'waktu' 
  | 'spesifikasi' 
  | 'lingkungan' 
  | 'kegagalan_komponen';

export type AdaptationLevel = 
  | 'Tergantung Prosedur' // IA < 40
  | 'Berkembang'          // 40 - 59
  | 'Cakap Beradaptasi'   // 60 - 79
  | 'Mahir Beradaptasi';  // 80+

export interface User {
  id: string;
  name: string;
  email: string;
  nisn?: string;
  role: UserRole;
  institutionId: string;
  institutionName: string;
  major?: string;
  class?: string;
  avatarUrl?: string;
}

export interface Competency {
  id: string;
  name: string;
  major: string;
  level: 'dasar' | 'menengah' | 'lanjut';
  description: string;
  indicators: string[];
}

export interface BaseTask {
  id: string;
  competencyId: string;
  title: string;
  objective: string;
  instructions: string[];
  materials: string[];
  tools: string[];
  successCriteria: string[];
  estMinutes: number;
  diagramUrl?: string;
  status: 'aktif' | 'arsip';
}

export interface Hint {
  id: string;
  level: 1 | 2 | 3;
  levelTitle: string; // "Pertanyaan Pemandu", "Petunjuk Arah", "Contoh Langkah"
  penalty: number;    // e.g. 0.2, 0.4, 0.8
  text: string;
}

export interface TaskVariation {
  id: string;
  baseTaskId: string;
  changedCondition: string;
  changeCategory: ChangeCategory;
  difficulty: 1 | 2 | 3 | 4 | 5;
  relevanceReason: string;
  expectedPrediction: string;
  hints: Hint[];
  equivalenceChecklist: {
    singleConditionChanged: boolean;
    brandIndependent: boolean;
    timeProportional: boolean;
    materialsReadilyAvailable: boolean;
  };
  reviewedBy?: string;
  status: 'draft' | 'ditinjau' | 'terbit';
}

export type AssessmentPhase = 
  | 0 // Persiapan
  | 1 // Tugas Dasar
  | 2 // Perubahan Kondisi
  | 3 // Prediksi
  | 4 // Penyesuaian
  | 5 // Evaluasi Diri
  | 6 // Penilaian & Umpan Balik
  | 7; // Tindak Lanjut

export interface EvidenceItem {
  id: string;
  phase: number;
  type: 'foto' | 'video' | 'berkas' | 'audio' | 'catatan';
  title: string;
  url: string;
  note?: string;
  measuredValues?: Record<string, string>;
  createdAt: string;
}

export interface StructuredPrediction {
  changeSummary: string;
  expectedEffects: {
    category: string;
    description: string;
  }[];
  mainRisk: string;
  plan: string;
  confidence: number; // 1 to 5
  lockedAt?: string;
}

export interface SelfReflection {
  outcomeVsPrediction: string;
  worked: string;
  missed: string;
  nextTime: string;
  submittedAt?: string;
}

export interface RubricDimensionScore {
  key: 'prediksi' | 'penyesuaian' | 'hasil' | 'kemandirian' | 'evaluasi';
  label: string;
  weight: number;
  score: number; // 0 to 4
  rationale?: string;
}

export interface SessionResult {
  adaptationIndex: number; // 0 to 100
  transferGap: number;     // base score - variation score
  calibration: number;     // confidence vs actual score difference
  level: AdaptationLevel;
  weakestCategory: ChangeCategory;
  strengths: string[];
  recommendations: string[];
  computedAt: string;
}

export interface AssessmentSession {
  id: string;
  participant: User;
  assessor: User;
  competency: Competency;
  baseTask: BaseTask;
  variation: TaskVariation;
  currentPhase: AssessmentPhase;
  status: 'terjadwal' | 'berjalan' | 'selesai' | 'dijeda';
  startedAt: string;
  evidence: EvidenceItem[];
  prediction?: StructuredPrediction;
  reflection?: SelfReflection;
  openedHintIds: string[];
  scores?: RubricDimensionScore[];
  result?: SessionResult;
  assessorNotes: {
    timestamp: string;
    text: string;
    tag?: 'perhatian' | 'positif' | 'petunjuk';
  }[];
}

export interface HistoricalSessionRecord {
  id: string;
  sessionCode: string;
  sessionNumber: number;
  date: string;
  title: string;
  variationType: string;
  difficulty: number;
  adaptationIndex: number;
  transferGap: number;
  level: AdaptationLevel;
  dimensionScores: {
    prediksi: number;
    penyesuaian: number;
    hasil: number;
    kemandirian: number;
    evaluasi: number;
  };
  notes?: string;
}

export interface AbilityPassport {
  id: string;
  publicCode: string;
  participant: User;
  competency: Competency;
  result: SessionResult;
  dimensions: {
    key: string;
    label: string;
    score: number; // 0 to 4
    maxScore: number;
  }[];
  categoryMastery: {
    category: ChangeCategory;
    label: string;
    mastered: boolean;
    testedCount: number;
  }[];
  sessionHistory?: HistoricalSessionRecord[];
  verificationUrl: string;
  issuedAt: string;
  qrCodeUrl?: string;
}

