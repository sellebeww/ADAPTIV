import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { RubricDimensionScore } from '../types/adaptiv';
import {
  RUBRIC_DIMENSIONS,
  calculateAdaptationIndex,
  computeSessionResult,
  describeResult,
  getAdaptationLevel,
} from './scoring';
import { mulberry32, seededShuffle } from '../test/prng';

type Key = RubricDimensionScore['key'];
const KEYS: Key[] = ['prediksi', 'penyesuaian', 'hasil', 'kemandirian', 'evaluasi'];

/** Skor per dimensi sesuai urutan KEYS: prediksi, penyesuaian, hasil, kemandirian, evaluasi. */
const make = (values: number[]): RubricDimensionScore[] =>
  KEYS.map((key, i) => ({ key, label: key, weight: 0, score: values[i] }));
const uniform = (v: number) => make([v, v, v, v, v]);

/*
 * Tes karakterisasi: nilai yang diharapkan dihitung manual dari rumus di docs
 * (IA = 100 x (0,20P + 0,30K + 0,25H + 0,15M + 0,10E) / 4), bukan disalin dari keluaran kode.
 */

describe('RUBRIC_DIMENSIONS', () => {
  it('memuat lima dimensi dengan bobot berjumlah 1', () => {
    expect(RUBRIC_DIMENSIONS.map((d) => d.key)).toEqual(KEYS);
    const total = RUBRIC_DIMENSIONS.reduce((s, d) => s + d.weight, 0);
    expect(total).toBeCloseTo(1, 10);
  });

  it('bobot yang ditampilkan sama dengan bobot yang dipakai rumus IA', () => {
    const rand = mulberry32(2026);
    for (let n = 0; n < 50; n++) {
      const values = KEYS.map(() => Math.floor(rand() * 5));
      const fromWeights = RUBRIC_DIMENSIONS.reduce((s, d, i) => s + d.weight * values[i], 0);
      const expected = Math.round(((100 * fromWeights) / 4) * 10) / 10;
      expect(calculateAdaptationIndex(make(values))).toBe(expected);
    }
  });

  it('punya deskriptor untuk setiap skor 0 sampai 4', () => {
    for (const d of RUBRIC_DIMENSIONS) {
      expect(Object.keys(d.descriptors).map(Number)).toEqual([0, 1, 2, 3, 4]);
    }
  });
});

describe('calculateAdaptationIndex', () => {
  it('semua skor maksimal (semua benar) menghasilkan 100', () => {
    expect(calculateAdaptationIndex(uniform(4))).toBe(100);
  });

  it('semua skor 0 (semua salah) menghasilkan 0', () => {
    expect(calculateAdaptationIndex(uniform(0))).toBe(0);
  });

  it('semua skor 2 menghasilkan tepat 50', () => {
    expect(calculateAdaptationIndex(uniform(2))).toBe(50);
  });

  it('tanpa jawaban sama sekali (daftar kosong) menghasilkan 0', () => {
    expect(calculateAdaptationIndex([])).toBe(0);
  });

  it('dimensi yang tidak ada dihitung 0: hanya penyesuaian = 4 memberi 30', () => {
    expect(calculateAdaptationIndex([{ key: 'penyesuaian', label: 'x', weight: 0, score: 4 }])).toBe(30);
  });

  it('contoh campuran: P3 K4 H3 M3 E4 = 85', () => {
    // 0,6 + 1,2 + 0,75 + 0,45 + 0,4 = 3,4 -> 100 x 3,4 / 4 = 85
    expect(calculateAdaptationIndex(make([3, 4, 3, 3, 4]))).toBe(85);
  });

  it('satu dimensi bernilai 4 memberi 100 x bobot', () => {
    expect(calculateAdaptationIndex(make([4, 0, 0, 0, 0]))).toBe(20);
    expect(calculateAdaptationIndex(make([0, 4, 0, 0, 0]))).toBe(30);
    expect(calculateAdaptationIndex(make([0, 0, 4, 0, 0]))).toBe(25);
    expect(calculateAdaptationIndex(make([0, 0, 0, 4, 0]))).toBe(15);
    expect(calculateAdaptationIndex(make([0, 0, 0, 0, 4]))).toBe(10);
  });

  it('pembulatan satu desimal: hasil 6,25 dibulatkan ke 6,3', () => {
    expect(calculateAdaptationIndex(make([0, 0, 1, 0, 0]))).toBe(6.3);
  });

  it('hasil tidak bergantung pada urutan daftar skor (urutan acak dengan seed)', () => {
    const base = make([3, 4, 3, 3, 4]);
    const rand = mulberry32(42);
    for (let n = 0; n < 25; n++) {
      expect(calculateAdaptationIndex(seededShuffle(base, rand))).toBe(85);
    }
  });

  it('seed yang sama selalu menghasilkan urutan yang sama', () => {
    const a = seededShuffle([1, 2, 3, 4, 5, 6, 7, 8], mulberry32(7));
    const b = seededShuffle([1, 2, 3, 4, 5, 6, 7, 8], mulberry32(7));
    expect(a).toEqual(b);
  });

  it('naik monoton: menaikkan satu skor tidak pernah menurunkan IA', () => {
    const rand = mulberry32(99);
    for (let n = 0; n < 100; n++) {
      const values = KEYS.map(() => Math.floor(rand() * 4));
      const i = Math.floor(rand() * 5);
      const higher = values.map((v, j) => (j === i ? v + 1 : v));
      expect(calculateAdaptationIndex(make(higher))).toBeGreaterThan(calculateAdaptationIndex(make(values)));
    }
  });

  it('IA selalu berada di rentang 0 sampai 100 untuk skor 0 sampai 4', () => {
    const rand = mulberry32(5);
    for (let n = 0; n < 200; n++) {
      const ia = calculateAdaptationIndex(make(KEYS.map(() => Math.floor(rand() * 5))));
      expect(ia).toBeGreaterThanOrEqual(0);
      expect(ia).toBeLessThanOrEqual(100);
    }
  });
});

describe('getAdaptationLevel', () => {
  it.each([
    [0, 'Tergantung Prosedur'],
    [39.9, 'Tergantung Prosedur'],
    [40, 'Berkembang'],
    [59.9, 'Berkembang'],
    [60, 'Cakap Beradaptasi'],
    [79.9, 'Cakap Beradaptasi'],
    [80, 'Mahir Beradaptasi'],
    [100, 'Mahir Beradaptasi'],
  ])('IA %s -> %s', (ia, level) => {
    expect(getAdaptationLevel(ia)).toBe(level);
  });
});

describe('computeSessionResult', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-01T10:00:00.000Z'));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('semua benar, keyakinan 5, tugas dasar 4: tanpa selisih transfer dan kalibrasi', () => {
    const r = computeSessionResult(uniform(4), 4, 5, 'beban');
    expect(r.adaptationIndex).toBe(100);
    expect(r.level).toBe('Mahir Beradaptasi');
    expect(r.transferGap).toBe(0);
    expect(r.calibration).toBe(0);
    expect(r.weakestCategory).toBe('beban');
    expect(r.strengths).toHaveLength(3);
    expect(r.recommendations).toEqual([
      'Latihan lanjutan disarankan pada pengujian sirkuit kategori "beban" dalam kondisi tegangan kerja.',
    ]);
  });

  it('semua salah, tugas dasar 3,5, keyakinan 5: gap 3,5, overconfident, kekuatan bawaan', () => {
    const r = computeSessionResult(uniform(0), 3.5, 5, 'alat');
    expect(r.adaptationIndex).toBe(0);
    expect(r.level).toBe('Tergantung Prosedur');
    expect(r.transferGap).toBe(3.5);
    expect(r.calibration).toBe(4);
    expect(r.strengths).toEqual(['Menunjukkan komitmen menyelesaikan tugas dasar sesuai SOP.']);
    expect(r.recommendations).toHaveLength(3);
    expect(r.recommendations[0]).toMatch(/gap transfer/);
    expect(r.recommendations[1]).toMatch(/overconfident/);
    expect(r.recommendations[2]).toMatch(/kategori "alat"/);
  });

  it('keyakinan 1 dengan hasil bagus: underconfident', () => {
    const r = computeSessionResult(uniform(4), 3.5, 1, 'waktu');
    expect(r.calibration).toBe(-4);
    expect(r.transferGap).toBe(-0.5);
    expect(r.recommendations.some((t) => /underconfident/.test(t))).toBe(true);
  });

  it('kalibrasi memetakan keyakinan 1-5 ke 0-4: keyakinan 3 = 2', () => {
    expect(computeSessionResult(uniform(2), 2, 3, 'bahan').calibration).toBe(0);
  });

  it('ambang selisih transfer: tepat 1,0 belum memicu saran, 1,1 memicu', () => {
    const atLimit = computeSessionResult(uniform(2.5), 3.5, 3, 'bahan');
    expect(atLimit.transferGap).toBe(1);
    expect(atLimit.recommendations.some((t) => /gap transfer/.test(t))).toBe(false);

    const over = computeSessionResult(make([2, 2, 2, 3, 3]), 3.5, 3, 'bahan');
    expect(over.transferGap).toBe(1.1);
    expect(over.recommendations.some((t) => /gap transfer/.test(t))).toBe(true);
  });

  it('ambang kalibrasi underconfident: tepat -0,8 belum memicu saran', () => {
    // keyakinan 3 -> 2; rata-rata skor 2,8 -> kalibrasi -0,8
    const r = computeSessionResult(uniform(2.8), 2.8, 3, 'bahan');
    expect(r.calibration).toBe(-0.8);
    expect(r.recommendations.some((t) => /underconfident|overconfident/.test(t))).toBe(false);
  });

  it('kekuatan muncul tepat pada skor 3 ke atas untuk prediksi, penyesuaian, kemandirian', () => {
    const r = computeSessionResult(make([3, 2, 0, 0, 0]), 3, 3, 'ukuran');
    expect(r.strengths).toEqual(['Kemampuan prediksi mental & antisipasi konsekuensi teknis sangat tajam.']);
    const r2 = computeSessionResult(make([0, 3, 0, 3, 0]), 3, 3, 'ukuran');
    expect(r2.strengths).toHaveLength(2);
  });

  it('computedAt memakai waktu sistem (diuji dengan fake timer) dan tidak bergantung zona waktu', () => {
    expect(computeSessionResult(uniform(2), 2, 3, 'bahan').computedAt).toBe('2026-03-01T10:00:00.000Z');
  });

  it('deterministik: input sama, waktu sama, hasil identik', () => {
    const a = computeSessionResult(make([3, 4, 3, 3, 4]), 3.5, 4, 'spesifikasi');
    const b = computeSessionResult(make([3, 4, 3, 3, 4]), 3.5, 4, 'spesifikasi');
    expect(a).toEqual(b);
    expect(a.adaptationIndex).toBe(85);
    expect(a.level).toBe('Mahir Beradaptasi');
  });

  it('urutan skor tidak memengaruhi hasil (shuffle dengan seed)', () => {
    const base = make([3, 4, 3, 3, 4]);
    const expected = computeSessionResult(base, 3.5, 4, 'spesifikasi');
    const rand = mulberry32(1234);
    for (let n = 0; n < 20; n++) {
      expect(computeSessionResult(seededShuffle(base, rand), 3.5, 4, 'spesifikasi')).toEqual(expected);
    }
  });

  // Karakterisasi perilaku saat ini, belum diubah. Lihat docs/AUDIT.md.
  it('KNOWN ISSUE: daftar skor kosong menghasilkan NaN pada selisih transfer dan kalibrasi', () => {
    const r = computeSessionResult([], 3.5, 3, 'bahan');
    expect(r.adaptationIndex).toBe(0);
    expect(Number.isNaN(r.transferGap)).toBe(true);
    expect(Number.isNaN(r.calibration)).toBe(true);
  });
});

describe('describeResult (tampilan ringkasan hasil)', () => {
  const real = {
    adaptationIndex: 0,
    transferGap: 0,
    calibration: 0,
    level: 'Tergantung Prosedur' as const,
    weakestCategory: 'alat' as const,
    strengths: [],
    recommendations: [],
    computedAt: '2026-03-01T10:00:00.000Z',
  };

  it('nilai 0 yang valid tidak boleh diganti angka contoh (bug: operator || pada UI)', () => {
    const d = describeResult(real);
    expect(d.adaptationIndex).toBe(0);
    expect(d.transferGap).toBe(0);
    expect(d.calibration).toBe(0);
    expect(d.level).toBe('Tergantung Prosedur');
  });

  it('tanpa hasil, memakai angka contoh sesi demo', () => {
    expect(describeResult(undefined)).toEqual({
      adaptationIndex: 82.5,
      level: 'Mahir Beradaptasi',
      transferGap: 0.3,
      calibration: 0.2,
      weakestCategory: 'Beban / Daya Tinggi',
    });
  });
});

describe('getAdaptationLevel vs pratinjau skor langsung', () => {
  it('IA di bawah 40 adalah "Tergantung Prosedur", bukan "Berkembang" (bug: ternary UI lama)', () => {
    expect(getAdaptationLevel(calculateAdaptationIndex(uniform(1)))).toBe('Tergantung Prosedur');
  });
});
