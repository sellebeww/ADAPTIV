/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AbilityPassport, AssessmentSession, BaseTask, Competency, HistoricalSessionRecord, TaskVariation, User } from '../types/adaptiv';
import { computeSessionResult, RUBRIC_DIMENSIONS } from '../utils/scoring';

export const CURRENT_INSTITUTION = {
  id: 'inst-smk-01',
  name: 'SMK Negeri 2 Nusantara (Contoh Unggulan)',
  npsn: '20108922',
  address: 'Jl. Vokasi Nasional No. 45, Bandung, Jawa Barat',
  plan: 'Lisensi Lembaga Tahunan',
  sessionQuota: 500,
  sessionsUsed: 142
};

export const SEED_USERS: Record<string, User> = {
  participant1: {
    id: 'user-part-01',
    name: 'Rizky Pratama',
    email: 'rizky.pratama@siswa.smkn2.sch.id',
    nisn: '0072381920',
    role: 'peserta',
    institutionId: CURRENT_INSTITUTION.id,
    institutionName: CURRENT_INSTITUTION.name,
    major: 'Teknik Instalasi Tenaga Listrik (TITL)',
    class: 'XII TITL 2',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  assessor1: {
    id: 'user-ass-01',
    name: 'Ir. Suryadi, S.T., M.Eng.',
    email: 'suryadi@guru.smkn2.sch.id',
    role: 'penilai',
    institutionId: CURRENT_INSTITUTION.id,
    institutionName: CURRENT_INSTITUTION.name,
    major: 'Teknik Ketenagalistrikan'
  },
  assessor2: {
    id: 'user-ass-02',
    name: 'Siti Rahmawati, S.Pd.',
    email: 'siti.rahmawati@guru.smkn2.sch.id',
    role: 'penilai',
    institutionId: CURRENT_INSTITUTION.id,
    institutionName: CURRENT_INSTITUTION.name,
    major: 'Teknik Ketenagalistrikan'
  },
  industryPartner: {
    id: 'user-ind-01',
    name: 'Hendra Wijaya, S.T. (PT Maju Daya Elektrika)',
    email: 'h.wijaya@majudaya.co.id',
    role: 'mitra_industri',
    institutionId: 'ind-01',
    institutionName: 'PT Maju Daya Elektrika (Mitra Industri PLN Group)'
  },
  admin: {
    id: 'user-adm-01',
    name: 'Drs. Bambang Hermanto, M.Pd.',
    email: 'admin.kurikulum@smkn2.sch.id',
    role: 'admin_lembaga',
    institutionId: CURRENT_INSTITUTION.id,
    institutionName: CURRENT_INSTITUTION.name
  }
};

export const SEED_COMPETENCY: Competency = {
  id: 'comp-titl-01',
  name: 'Instalasi Penerangan Listrik Rumah Tinggal',
  major: 'Teknik Instalasi Tenaga Listrik',
  level: 'menengah',
  description: 'Kompetensi merancang, memasang, menguji, dan memodifikasi instalasi penerangan 1 fasa sesuai standar keselamatan PUIL 2020.',
  indicators: [
    'Memeriksa kelaikan komponen pengaman MCB 1 fasa dan grounding',
    'Menyambungkan instalasi saklar dan fiting lampu dengan polaritas fasa-nol yang tepat',
    'Mendiagnosis dan mengadaptasi wiring sirkuit saat spesifikasi kendali berubah di lapangan',
    'Melakukan pengujian tahanan isolasi dan kontinuitas sebelum dialiri tegangan'
  ]
};

export const SEED_BASE_TASK: BaseTask = {
  id: 'task-base-01',
  competencyId: SEED_COMPETENCY.id,
  title: 'Perakitan & Pengujian Sirkuit Saklar Tunggal 1 Titik Lampu',
  objective: 'Merakit satu sirkuit penerangan saklar tunggal yang mengendalikan 1 titik lampu pijar pada papan kerja uji, lengkap dengan proteksi MCB dan pembumian (grounding).',
  instructions: [
    '1. Pastikan sumber tegangan 220V dalam kondisi off dan MCB induk ditandai tag LOTO.',
    '2. Pasang pipa konduit PVC dan kotak sambung (T-dos) pada papan praktikum.',
    '3. Tarik kabel NYA 1.5 mm² (Hitam: Fasa, Biru: Netral, Kuning-Hijau: Ground).',
    '4. Hubungkan kawat fasa dari output MCB menuju terminal input saklar tunggal.',
    '5. Hubungkan kawat fasa output saklar menuju lidah tengah fiting lampu (bukan ulir).',
    '6. Sambungkan kawat netral langsung ke ulir fiting lampu.',
    '7. Lakukan uji kontinuitas dengan multimeter, kemudian uji fungsi dengan tegangan kerja.'
  ],
  materials: [
    '1 unit Lampu LED/Pijar 220V 15W',
    '1 unit Saklar Tunggal Inbow',
    '1 unit Fiting Gantung/Tempel E27',
    '1 unit MCB 1 Fasa 2A',
    'Kabel NYA 1.5 mm² (Fasa, Netral, Grounding)',
    'Pipa konduit PVC 20mm & T-dos'
  ],
  tools: [
    'Multimeter Digital (Sanwa / Fluke)',
    'Obeng Plus & Minus Insulated 1000V',
    'Tang Kupas Kabel & Tang Kombinasi',
    'Tespen Tegangan AC 100-500V'
  ],
  successCriteria: [
    'Polaritas fasa masuk ke saklar dan lidah fiting (bukan ulir kontak luar)',
    'Pentanahan terpasang aman dan kontinuitas 100%',
    'Lampu menyala saat saklar ditegangkan dan padam saat saklar dimatikan tanpa dengung',
    'Kerapian jalur kawat konduit dan sambungan ekor babi terlindungi lasdop'
  ],
  estMinutes: 30,
  status: 'aktif'
};

export const SEED_VARIATION_A: TaskVariation = {
  id: 'var-titl-01',
  baseTaskId: SEED_BASE_TASK.id,
  changedCondition: 'Spesifikasi Kendali Berubah: Klien meminta lampu dikendalikan dari 2 tempat terpisah (Saklar Tukar / Hotel Switch untuk tangga atau lorong).',
  changeCategory: 'spesifikasi',
  difficulty: 3,
  relevanceReason: 'Di dunia kerja konstruksi & interior hunian bertingkat, permintaan mendadak perubahan kendali saklar tangga dari 1 titik ke 2 titik sangat sering terjadi setelah pipa konduit terpasang.',
  expectedPrediction: 'Peserta harus menyadari bahwa saklar tunggal harus diganti menjadi dua buah saklar SPDT (saklar tukar), membutuhkan 2 jalur kawat penghubung (strapping wires) tambahan di dalam konduit, dan alur fasa harus dialirkan melalui terminal umum (common).',
  hints: [
    {
      id: 'hint-01',
      level: 1,
      levelTitle: 'Pertanyaan Pemandu (Tingkat 1)',
      penalty: 0.2,
      text: 'Bagaimana jalur aliran arus listrik jika Anda ingin memutus atau menghubungkan sirkuit dari dua lokasi yang berbeda tanpa menyebabkan kontak singkat (short circuit)?'
    },
    {
      id: 'hint-02',
      level: 2,
      levelTitle: 'Petunjuk Arah Diagram (Tingkat 2)',
      penalty: 0.4,
      text: 'Gunakan dua unit Saklar Tukar (SPDT). Fasa dari MCB masuk ke terminal 0 saklar pertama. Hubungkan terminal 1 dan 2 saklar pertama ke terminal 1 dan 2 saklar kedua. Terminal 0 saklar kedua keluar menuju fiting lampu.'
    },
    {
      id: 'hint-03',
      level: 3,
      levelTitle: 'Contoh Langkah Pengawatan Konkret (Tingkat 3)',
      penalty: 0.8,
      text: 'Langkah pengawatan: Ganti saklar tunggal dengan Saklar Tukar A dan pasang Saklar Tukar B di titik kedua. Tambahkan 2 konduktor kawat penghubung di antara terminal 1 & 2 kedua saklar. Hubungkan beban lampu ke terminal 0 Saklar Tukar B.'
    }
  ],
  equivalenceChecklist: {
    singleConditionChanged: true, // Hanya logika sirkuit kendali yang berubah
    brandIndependent: true,       // Kompatibel dengan merek Broco, Schneider, Panasonic
    timeProportional: true,       // Waktu 25-35 menit sepadan dengan tugas dasar
    materialsReadilyAvailable: true // Saklar tukar dan kabel tambahan ada di bengkel
  },
  reviewedBy: 'Ir. Suryadi, S.T., M.Eng.',
  status: 'terbit'
};

export const SEED_VARIATION_B: TaskVariation = {
  id: 'var-titl-02',
  baseTaskId: SEED_BASE_TASK.id,
  changedCondition: 'Beban Daya Meningkat Tajam: Beban diganti dengan lampu sorot halogen daya tinggi 1500W (I = ~6.8A), melampaui kapasitas MCB 2A dan kawat awal.',
  changeCategory: 'beban',
  difficulty: 4,
  relevanceReason: 'Instalatur listrik sering menghadapi kasus penambahan beban oleh pemilik rumah tanpa perhitungan, yang berisiko memicu trip MCB terus-menerus atau kebakaran kabel.',
  expectedPrediction: 'Peserta harus mengidentifikasi bahwa arus beban (6.8A) akan melebihi rating MCB 2A sehingga MCB akan trip saat dinyalakan. Penampang kabel 1.5mm² harus dievaluasi KHA-nya dan MCB harus di-upgrade menjadi minimal 10A.',
  hints: [
    {
      id: 'hint-b-01',
      level: 1,
      levelTitle: 'Pertanyaan Pemandu (Tingkat 1)',
      penalty: 0.2,
      text: 'Hitung arus nominal beban baru (P = V x I). Apakah MCB 2A saat ini sanggup menahan arus tersebut saat dinyalakan?'
    },
    {
      id: 'hint-b-02',
      level: 2,
      levelTitle: 'Petunjuk Arah Diagram (Tingkat 2)',
      penalty: 0.4,
      text: 'Arus I = 1500W / 220V = 6.81A. Ganti pengaman MCB ke rating standar berikutnya (minimal 10A) dan pastikan kuat hantar arus (KHA) kabel penampang 2.5 mm² aman.'
    },
    {
      id: 'hint-b-03',
      level: 3,
      levelTitle: 'Contoh Langkah Pengawatan Konkret (Tingkat 3)',
      penalty: 0.8,
      text: 'Ganti MCB 2A dengan MCB 10A Schneider/ABB. Periksa kabel konduit, gunakan minimal NYA 2.5 mm² untuk jalur fasa dan netral beban 1500W.'
    }
  ],
  equivalenceChecklist: {
    singleConditionChanged: true,
    brandIndependent: true,
    timeProportional: true,
    materialsReadilyAvailable: true
  },
  reviewedBy: 'Siti Rahmawati, S.Pd.',
  status: 'terbit'
};

// Initial Seed Scores for Rizky Pratama in completed session
const defaultScores = [
  { key: 'prediksi' as const, label: 'Ketepatan Prediksi', weight: 0.20, score: 3, rationale: 'Memprediksi kebutuhan 2 strapping wire dan perpindahan fasa ke terminal common dengan akurat.' },
  { key: 'penyesuaian' as const, label: 'Kualitas Penyesuaian', weight: 0.30, score: 4, rationale: 'Wiring sangat rapi, polaritas fasa terisolasi baik, jalur konduit tidak terpelintir.' },
  { key: 'hasil' as const, label: 'Hasil Kerja pada Variasi', weight: 0.25, score: 3, rationale: 'Kedua titik saklar berfungsi 100%, pengujian beban dan isolasi lolos batas aman PUIL.' },
  { key: 'kemandirian' as const, label: 'Kemandirian', weight: 0.15, score: 3, rationale: 'Hanya membuka 1 pertanyaan pemandu (Level 1) saat mengonfirmasi skema terminal saklar.' },
  { key: 'evaluasi' as const, label: 'Evaluasi Diri', weight: 0.10, score: 4, rationale: 'Refleksi sangat jujur dan mendalam terkait batas waktu penarikan kawat tambahan.' }
];

export const INITIAL_COMPLETED_SESSION: AssessmentSession = {
  id: 'sess-demo-2026-01',
  participant: SEED_USERS.participant1,
  assessor: SEED_USERS.assessor1,
  competency: SEED_COMPETENCY,
  baseTask: SEED_BASE_TASK,
  variation: SEED_VARIATION_A,
  currentPhase: 7, // Finished
  status: 'selesai',
  startedAt: '2026-10-22T08:30:00.000Z',
  evidence: [
    {
      id: 'ev-01',
      phase: 1,
      type: 'foto',
      title: 'Hasil Perakitan Tugas Dasar: Saklar Tunggal & MCB',
      url: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=600&auto=format&fit=crop&q=80',
      note: 'Instalasi dasar selesai sesuai SOP, polaritas fasa sudah diverifikasi dengan tespen.',
      measuredValues: { 'Tegangan MCB': '221.4 V', 'Tahanan Isolasi': '> 100 MΩ' },
      createdAt: '2026-10-22T08:45:00.000Z'
    },
    {
      id: 'ev-02',
      phase: 4,
      type: 'foto',
      title: 'Hasil Modifikasi Saklar Tukar 2 Titik Kendali',
      url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
      note: 'Dua saklar tukar (SPDT) terpasang di dua sisi papan kerja, kawat strapping 1.5mm² ditarik rapi.',
      measuredValues: { 'Uji Kontinuitas Posisi 1': 'Tersambung (0.02 Ω)', 'Uji Kontinuitas Posisi 2': 'Tersambung (0.02 Ω)' },
      createdAt: '2026-10-22T09:18:00.000Z'
    }
  ],
  prediction: {
    changeSummary: 'Sirkuit kendali diubah dari 1 saklar tunggal menjadi 2 saklar tukar (kendali 2 titik)',
    expectedEffects: [
      { category: 'Komponen', description: 'Memerlukan 2 saklar tukar (SPDT) menggantikan saklar tunggal.' },
      { category: 'Kabeling', description: 'Harus menarik 2 jalur kabel tambahan (strapping wires) melewati konduit PVC.' },
      { category: 'Logika Sirkuit', description: 'Arus dialirkan melalui common saklar 1 menuju switch cabang, lalu diteruskan ke beban lewat common saklar 2.' }
    ],
    mainRisk: 'Salah sambung terminal common dengan terminal cabang, menyebabkan korsleting fasa-nol atau lampu hanya bisa menyala dari salah satu saklar saja.',
    plan: '1. Matikan MCB. 2. Lepas saklar tunggal. 3. Pasang saklar tukar A dan B. 4. Pasang 2 kabel strapping antar terminal 1 & 2 kedua saklar. 5. Sambungkan fasa input ke saklar A dan fasa output ke lampu dari saklar B. 6. Tes kontinuitas.',
    confidence: 4,
    lockedAt: '2026-10-22T09:02:14.000Z'
  },
  reflection: {
    outcomeVsPrediction: 'Sirkuit saklar tukar berhasil menyalakan dan mematikan lampu dari kedua titik secara independen sesuai prediksi.',
    worked: 'Skema pemisahan kawat strapping dan terminal common berjalan lancar tanpa ada trip MCB.',
    missed: 'Sempat kesulitan menarik 2 kawat tambahan karena konduit PVC 20mm sudah terisi 3 kawat awal, membutuhkan pelumas penarik kabel.',
    nextTime: 'Akan memperhitungkan diameter konduit dan mengisi ruang pengisian kawat maksimal 40% sesuai PUIL sebelum memasang jalur pipa.',
    submittedAt: '2026-10-22T09:25:30.000Z'
  },
  openedHintIds: ['hint-01'],
  scores: defaultScores,
  result: computeSessionResult(defaultScores, 3.5, 4, 'spesifikasi'),
  assessorNotes: [
    { timestamp: '08:42', text: 'Peserta menunjukkan kepatuhan K3 listrik sangat baik (menggunakan sepatu isolasi).', tag: 'positif' },
    { timestamp: '09:05', text: 'Membuka Petunjuk Level 1 untuk memverifikasi diagram terminal common.', tag: 'petunjuk' },
    { timestamp: '09:15', text: 'Kerapian strapping wire sangat memuaskan, tidak ada tembaga terbuka di luar terminal.', tag: 'positif' }
  ]
};

export const SEED_SESSION_HISTORY: HistoricalSessionRecord[] = [
  {
    id: 'hist-sess-01',
    sessionCode: 'SESI-TITL-01',
    sessionNumber: 1,
    date: '15 Agt 2026',
    title: 'Baseline: Pengawatan Sirkuit Standar',
    variationType: 'Tugas Dasar (Standard SOP)',
    difficulty: 1,
    adaptationIndex: 58,
    transferGap: 1.4,
    level: 'Berkembang',
    dimensionScores: {
      prediksi: 2,
      penyesuaian: 2,
      hasil: 3,
      kemandirian: 2,
      evaluasi: 2,
    },
    notes: 'Sesi diagnostik awal. Cukup memahami SOP dasar tetapi ragu saat isolasi sirkuit diubah.'
  },
  {
    id: 'hist-sess-02',
    sessionCode: 'SESI-TITL-02',
    sessionNumber: 2,
    date: '05 Sep 2026',
    title: 'Variasi 1: Konfigurasi Pipa Konduit Sempit',
    variationType: 'Variasi Ukuran & Lingkungan',
    difficulty: 2,
    adaptationIndex: 68,
    transferGap: 0.9,
    level: 'Cakap Beradaptasi',
    dimensionScores: {
      prediksi: 3,
      penyesuaian: 3,
      hasil: 3,
      kemandirian: 2,
      evaluasi: 3,
    },
    notes: 'Peningkatan signifikan dalam perhitungan penarikan kabel konduit dan manajemen waktu kerja.'
  },
  {
    id: 'hist-sess-03',
    sessionCode: 'SESI-TITL-03',
    sessionNumber: 3,
    date: '28 Sep 2026',
    title: 'Variasi 2: Beban Daya Halogen & Upgrade MCB',
    variationType: 'Variasi Beban Daya (1500W)',
    difficulty: 4,
    adaptationIndex: 76,
    transferGap: 0.6,
    level: 'Cakap Beradaptasi',
    dimensionScores: {
      prediksi: 3,
      penyesuaian: 3,
      hasil: 3,
      kemandirian: 3,
      evaluasi: 4,
    },
    notes: 'Mampu menghitung arus nominal beban (I = P/V) dan meng-upgrade MCB serta penampang kawat.'
  },
  {
    id: 'hist-sess-04',
    sessionCode: 'SESI-TITL-04',
    sessionNumber: 4,
    date: '22 Okt 2026',
    title: 'Variasi 3: 2 Saklar Tukar SPDT (Sesi Terkini)',
    variationType: 'Variasi Spesifikasi Kendali',
    difficulty: 3,
    adaptationIndex: 85,
    transferGap: 0.3,
    level: 'Mahir Beradaptasi',
    dimensionScores: {
      prediksi: 3,
      penyesuaian: 4,
      hasil: 3,
      kemandirian: 3,
      evaluasi: 4,
    },
    notes: 'Penguasaan wiring saklar hotel dan strapping wires sangat rapi. Evaluasi diri dan kalibrasi akurat.'
  }
];

export const INITIAL_ABILITY_PASSPORT: AbilityPassport = {
  id: 'pass-001',
  publicCode: 'ADAPT-2026-TITL-0891',
  participant: SEED_USERS.participant1,
  competency: SEED_COMPETENCY,
  result: INITIAL_COMPLETED_SESSION.result!,
  dimensions: [
    { key: 'prediksi', label: 'Ketepatan Prediksi', score: 3, maxScore: 4 },
    { key: 'penyesuaian', label: 'Kualitas Penyesuaian', score: 4, maxScore: 4 },
    { key: 'hasil', label: 'Hasil Kerja Variasi', score: 3, maxScore: 4 },
    { key: 'kemandirian', label: 'Kemandirian', score: 3, maxScore: 4 },
    { key: 'evaluasi', label: 'Evaluasi Diri', score: 4, maxScore: 4 }
  ],
  categoryMastery: [
    { category: 'spesifikasi', label: 'Spesifikasi Kendali', mastered: true, testedCount: 3 },
    { category: 'alat', label: 'Variasi Alat Uji', mastered: true, testedCount: 2 },
    { category: 'bahan', label: 'Variasi Jenis Kabel', mastered: true, testedCount: 2 },
    { category: 'beban', label: 'Variasi Beban Daya', mastered: false, testedCount: 1 }, // weakest
    { category: 'waktu', label: 'Tekanan Waktu Kerja', mastered: true, testedCount: 2 },
    { category: 'kegagalan_komponen', label: 'Komponen Rusak/Trip', mastered: false, testedCount: 1 },
    { category: 'lingkungan', label: 'Kondisi Lembab/Sempit', mastered: false, testedCount: 0 },
    { category: 'ukuran', label: 'Dimensi & Jarak Panel', mastered: true, testedCount: 1 }
  ],
  sessionHistory: SEED_SESSION_HISTORY,
  verificationUrl: 'https://adaptiv.id/verifikasi/ADAPT-2026-TITL-0891',
  issuedAt: '2026-10-22'
};
