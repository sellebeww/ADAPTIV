/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AdaptationLevel, ChangeCategory, RubricDimensionScore, SessionResult } from '../types/adaptiv';

export const RUBRIC_DIMENSIONS: {
  key: 'prediksi' | 'penyesuaian' | 'hasil' | 'kemandirian' | 'evaluasi';
  label: string;
  weight: number;
  descriptors: Record<number, string>;
}[] = [
  {
    key: 'prediksi',
    label: 'Ketepatan Prediksi',
    weight: 0.20,
    descriptors: {
      0: 'Tidak mampu mengidentifikasi konsekuensi teknis dari perubahan kondisi atau prediksi sama sekali keliru.',
      1: 'Menyebutkan perubahan secara umum, namun gagal memprediksi dampak spesifik pada keselamatan atau beban sirkuit.',
      2: 'Mampu memprediksi dampak utama dengan benar, namun mengabaikan risiko sekunder.',
      3: 'Prediksi komprehensif, mengidentifikasi alur arus, modifikasi strapping switch, dan risiko bahaya dengan tepat.',
      4: 'Prediksi presisi tinggi, mencakup implikasi langsung dan sistemik serta parameter teknis spesifik.'
    }
  },
  {
    key: 'penyesuaian',
    label: 'Kualitas Penyesuaian',
    weight: 0.30,
    descriptors: {
      0: 'Melanjutkan prosedur dasar tanpa penyesuaian, mengabaikan instruksi kondisi baru.',
      1: 'Mencoba penyesuaian namun dengan metode yang salah dan berisiko korsleting.',
      2: 'Langkah penyesuaian fungsional namun tidak efisien atau tidak rapi secara estetika bengkel.',
      3: 'Penyesuaian sistematis, aman sesuai standar PUIL 2020, dan mempertahankan standar kerja industri.',
      4: 'Penyesuaian sangat elegan, cepat, aman, dan mendemonstrasikan pemahaman prinsip teknis mendalam.'
    }
  },
  {
    key: 'hasil',
    label: 'Hasil Kerja pada Variasi',
    weight: 0.25,
    descriptors: {
      0: 'Sirkuit tidak menyala atau terjadi trip MCB pengaman.',
      1: 'Hanya satu titik kendali berfungsi, polaritas atau pentanahan terbalik.',
      2: 'Kedua saklar tukar berfungsi menyalakan/mematikan lampu, tetapi terdapat sambungan kawat yang longgar.',
      3: 'Kedua titik kendali berfungsi sempurna, pengujian kontinuitas dan polaritas memenuhi syarat lulus.',
      4: 'Hasil kerja sempurna tanpa cacat, rapi, isolasi kuat, pengujian beban 100% lulus toleransi.'
    }
  },
  {
    key: 'kemandirian',
    label: 'Kemandirian',
    weight: 0.15,
    descriptors: {
      0: 'Memerlukan intervensi langsung penilai atau membuka semua petunjuk (Level 1, 2, dan 3).',
      1: 'Membuka petunjuk teknis Level 2 & 3 serta sering meminta konfirmasi penilai.',
      2: 'Membuka 1-2 petunjuk pemandu namun mampu melanjutkan eksekusi mandiri.',
      3: 'Menyelesaikan variasi tugas hanya dengan 1 pertanyaan pemandu (Level 1) atau tanpa bantuan teknis berarti.',
      4: 'Sepenuhnya mandiri, tidak membuka petunjuk apa pun, mampu memecahkan hambatan secara otonom.'
    }
  },
  {
    key: 'evaluasi',
    label: 'Evaluasi Diri & Batas Kemampuan',
    weight: 0.10,
    descriptors: {
      0: 'Tidak ada refleksi atau menolak mengakui kesalahan fatal yang terjadi.',
      1: 'Refleksi dangkal ("semua lancar") tanpa membandingkan data prediksi dengan kenyataan pengujian.',
      2: 'Mampu menyebutkan apa yang berhasil dan gagal, namun belum memahami akar penyebabnya.',
      3: 'Refleksi tajam, jujur mengenai kesulitan saat wiring saklar tukar, dan merumuskan perbaikan konkret.',
      4: 'Kesadaran metakognitif luar biasa, menganalisis akurasi prediksi vs realita dan mengenali batas toleransi keahliannya.'
    }
  }
];

export function calculateAdaptationIndex(scores: RubricDimensionScore[]): number {
  const scoreMap = new Map(scores.map(s => [s.key, s.score]));
  
  const p = scoreMap.get('prediksi') ?? 0;
  const k = scoreMap.get('penyesuaian') ?? 0;
  const h = scoreMap.get('hasil') ?? 0;
  const m = scoreMap.get('kemandirian') ?? 0;
  const e = scoreMap.get('evaluasi') ?? 0;

  // Formula: IA = 100 x (0.20*Prediksi + 0.30*Penyesuaian + 0.25*Hasil + 0.15*Kemandirian + 0.10*Evaluasi) / 4
  const weightedSum = (0.20 * p) + (0.30 * k) + (0.25 * h) + (0.15 * m) + (0.10 * e);
  const rawIndex = (100 * weightedSum) / 4;
  return Math.round(rawIndex * 10) / 10;
}

export function getAdaptationLevel(index: number): AdaptationLevel {
  if (index < 40) return 'Tergantung Prosedur';
  if (index < 60) return 'Berkembang';
  if (index < 80) return 'Cakap Beradaptasi';
  return 'Mahir Beradaptasi';
}

export function computeSessionResult(
  scores: RubricDimensionScore[],
  baseTaskScore: number,
  confidenceRating: number,
  category: ChangeCategory
): SessionResult {
  const adaptationIndex = calculateAdaptationIndex(scores);
  const level = getAdaptationLevel(adaptationIndex);

  // Transfer Gap = base score - variation score (scale 0-4 average)
  const averageVariationScore = scores.reduce((sum, s) => sum + s.score, 0) / scores.length;
  const transferGap = Math.round((baseTaskScore - averageVariationScore) * 10) / 10;

  // Self-calibration = confidence (1-5 mapped to 0-4) - actual performance (0-4)
  const normalizedConfidence = ((confidenceRating - 1) / 4) * 4;
  const calibration = Math.round((normalizedConfidence - averageVariationScore) * 10) / 10;

  const strengths: string[] = [];
  const recommendations: string[] = [];

  const predScore = scores.find(s => s.key === 'prediksi')?.score ?? 0;
  const adjScore = scores.find(s => s.key === 'penyesuaian')?.score ?? 0;
  const indepScore = scores.find(s => s.key === 'kemandirian')?.score ?? 0;

  if (predScore >= 3) {
    strengths.push('Kemampuan prediksi mental & antisipasi konsekuensi teknis sangat tajam.');
  }
  if (adjScore >= 3) {
    strengths.push('Fleksibilitas perakitan dan kepatuhan keselamatan kerja PUIL terjaga prima.');
  }
  if (indepScore >= 3) {
    strengths.push('Kemandirian tinggi dalam menghadapi ketidakpastian prosedur.');
  }

  if (transferGap > 1.0) {
    recommendations.push('Perlu latihan variasi beban dan spesifikasi komponen dengan frekuensi lebih sering untuk memperkecil gap transfer.');
  }
  if (calibration > 1.0) {
    recommendations.push('Kalibrasi diri overconfident: tingkatkan ketelitian pemeriksaan risiko sebelum mulai bertindak.');
  } else if (calibration < -0.8) {
    recommendations.push('Kalibrasi diri underconfident: peserta memiliki kapasitas teknis lebih tinggi dari perkiraannya sendiri.');
  }

  recommendations.push(`Latihan lanjutan disarankan pada pengujian sirkuit kategori "${category}" dalam kondisi tegangan kerja.`);

  return {
    adaptationIndex,
    transferGap,
    calibration,
    level,
    weakestCategory: category,
    strengths: strengths.length ? strengths : ['Menunjukkan komitmen menyelesaikan tugas dasar sesuai SOP.'],
    recommendations,
    computedAt: new Date().toISOString()
  };
}


/** Angka contoh yang tampil di sesi demo sebelum penilai menerbitkan hasil. */
const DEMO_RESULT = {
  adaptationIndex: 82.5,
  level: 'Mahir Beradaptasi' as AdaptationLevel,
  transferGap: 0.3,
  calibration: 0.2,
  weakestCategory: 'Beban / Daya Tinggi'
};

/** Ringkasan hasil untuk layar; nilai 0 yang sah tidak diganti angka contoh (gunakan ??, bukan ||). */
export function describeResult(result?: SessionResult) {
  return {
    adaptationIndex: result?.adaptationIndex ?? DEMO_RESULT.adaptationIndex,
    level: result?.level ?? DEMO_RESULT.level,
    transferGap: result?.transferGap ?? DEMO_RESULT.transferGap,
    calibration: result?.calibration ?? DEMO_RESULT.calibration,
    weakestCategory: result?.weakestCategory ?? DEMO_RESULT.weakestCategory
  };
}
